import Sale from "../models/salesModel.js";
import Product from "../models/productModel.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import crypto from 'crypto'
import Razorpay from "razorpay";
dotenv.config();


// Add a Razor Pay Gateway
const razorpayClient = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

export const razorpayPayement = async (req,res) => {
  const {amount} = req.body;
  const options = {
    amount:amount*100,
    currency: "INR",
    receipt: `receipt_${Math.random()}`,
  }
  try {
    const order = await razorpayClient.orders.create(options);
    res.status(201).json({data : order,message:'Razor Pay Order Created ', success : true});
  } catch (error) {
    console.log(error);
    res.status(400).json({message:error.message, success:false})

  }
};


export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = req.body;

    // 1. Validate request parameters
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification parameters'
      });
    }

    // 2. Generate signature for verification
    const generatedSignature = crypto
      .createHmac('sha256', import.meta.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // 3. Signature validation
    if (generatedSignature !== razorpay_signature) {
      return res.status(401).json({
        success: false,
        message: 'Payment verification failed: Invalid digital signature'
      });
    }

    // 4. Verify payment status with Razorpay API
    const payment = await razorpayClient.payments.fetch(razorpay_payment_id);

    // 5. Check payment status
    if (payment.status !== 'captured') {
      return res.status(402).json({
        success: false,
        message: `Payment not captured. Current status: ${payment.status}`,
        payment_status: payment.status
      });
    }

    // 6. Successful verification
    res.status(200).json({
      success: true,
      message: 'Payment successfully verified and captured',
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        order_id: payment.order_id,
        created_at: payment.created_at
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    
    // Handle specific error cases
    if (error.error?.code === 'BAD_REQUEST_ERROR') {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment parameters provided',
        error: error.error.description
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during payment verification',
      error: error.message
    });
  }
};

// Add Stripe payment gateway integration

//  export const stripePayment = async (req, res) => {
//   try {
//     const {amount} = req.body;
//     const paymentIntent = await stripeClient.paymentIntents.create({
//       amount:amount,
//       currency: 'inr',
//     });
//     res.status(200).json({clientSecret: paymentIntent.client_secret,message:"Client Secret sent Successfully...", success:true})
//   } catch (error) {
//     res.status(500).json({message: error.message, success:false})
//   }
// }

// Sales Controllers....
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find({})
      .select("-customerEmail,-customerPhone")
      .populate("staff", "name")
      .exec();
    res.json({
      data: sales,
      message: "All sales retrieved successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const addSales = async (req, res) => {
  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Begin a transaction

  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      totalAmount,
      products,
      paymentId,
    } = req.body;
    const staffId = req?.user?.id; // Get staff ID

    // Validate required fields
    if (
      !customerName ||
      !customerPhone ||
      !totalAmount ||
      !products ||
      !customerEmail
    ) {
      throw new Error("Missing required fields.");
    }
    if (!paymentId) {
      throw new Error("Payment ID is required.");
    }

    // Create a new sale record inside the transaction
    const newSale = new Sale({
      customerName,
      customerPhone,
      customerEmail,
      totalAmount,
      products,
      staff: staffId,
      paymentId,
    });

    const savedSale = await newSale.save({ session });

    // Reduce stock for each product
    await Promise.all(
      products.map(async (product) => {
        const existingProduct = await Product.findById(product._id).session(
          session
        );
        if (!existingProduct) {
          throw new Error(`Product with ID ${product._id} not found.`);
        }

        // Convert productQuantity from string to number
        const currentQuantity = Number(existingProduct.productQuantity);
        const requestedQuantity = Number(product.quantity);

        if (currentQuantity < requestedQuantity) {
          throw new Error(
            `Not enough stock for product ${existingProduct.name}.`
          );
        }

        // Update stock and convert it back to string for DB
        existingProduct.productQuantity = (
          currentQuantity - requestedQuantity
        ).toString();
        await existingProduct.save({ session });
      })
    );

    // Commit the transaction (finalize changes)
    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({
        message: "New Sale Added & Stock Updated",
        success: true,
        data: savedSale,
      });
  } catch (error) {
    await session.abortTransaction(); // Rollback changes if any error occurs
    session.endSession();
    console.error("Transaction failed:", error);
    res.status(400).json({ message: error.message, success: false });
  }
};

export const getSalesByStaff = async (req, res) => {
  try {
    const sales = await Sale.find({ staff: req.user.id });
    if (!sales) {
      return res
        .status(404)
        .json({ message: "No sales found for this staff", success: false });
    }
    res.json({
      data: sales,
      message: "Sales retrieved successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
    console.log(error);
  }
};
