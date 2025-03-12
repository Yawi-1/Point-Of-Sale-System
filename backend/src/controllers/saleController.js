import Sale from "../models/salesModel.js";
import Product from '../models/productModel.js'
import dotenv from 'dotenv';
import stripe from 'stripe'
import mongoose from "mongoose";
dotenv.config()

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
 // Add Stripe payment gateway integration

 export const stripePayment = async (req, res) => {
  try {
    const {amount} = req.body;
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount:amount,
      currency: 'inr',
    });
    res.status(200).json({clientSecret: paymentIntent.client_secret,message:"Client Secret sent Successfully...", success:true})
  } catch (error) {
    res.status(500).json({message: error.message, success:false})
  }
}


// Sales Controllers....
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find({})
    .select('-customerEmail,-customerPhone')
    .populate('staff','name')
    .exec();
    res.json({
      data:sales,
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
    const { customerName, customerPhone, customerEmail, totalAmount, products, paymentId } = req.body;
    const staffId = req?.user?.id; // Get staff ID

    // Validate required fields
    if (!customerName || !customerPhone || !totalAmount || !products || !customerEmail) {
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
        const existingProduct = await Product.findById(product._id).session(session);
        if (!existingProduct) {
          throw new Error(`Product with ID ${product._id} not found.`);
        }

        // Convert productQuantity from string to number
        const currentQuantity = Number(existingProduct.productQuantity);
        const requestedQuantity = Number(product.quantity);

        if (currentQuantity < requestedQuantity) {
          throw new Error(`Not enough stock for product ${existingProduct.name}.`);
        }

        // Update stock and convert it back to string for DB
        existingProduct.productQuantity = (currentQuantity - requestedQuantity).toString();
        await existingProduct.save({ session });
      })
    );

    // Commit the transaction (finalize changes)
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "New Sale Added & Stock Updated", success: true, data: savedSale });
  } catch (error) {
    await session.abortTransaction(); // Rollback changes if any error occurs
    session.endSession();
    console.error("Transaction failed:", error);
    res.status(400).json({ message: error.message, success: false });
  }
};


export const getSalesByStaff = async(req,res)=>{
    try {
        const sales = await Sale.find({staff:req.user.id});
        if(!sales){
            return res.status(404).json({message:"No sales found for this staff",success:false});
        }
        res.json({data:sales,message:"Sales retrieved successfully",success:true})
    } catch (error) {
        res.status(400).json({message:error.message,success:false});
        console.log(error)
    }
}

 