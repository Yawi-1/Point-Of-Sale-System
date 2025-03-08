import Sale from "../models/salesModel.js";
import dotenv from 'dotenv';
import stripe from 'stripe'
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
    const sales = await Sale.find({});
    res.json({
      sales,
      message: "All sales retrieved successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
};

export const addSales = async (req, res) => {
  try {
    const { customerName, customerPhone, totalAmount, products, paymentId } = req.body;
    const staffId = req?.user?.id; 

    if (!customerName || !customerPhone || !totalAmount || !products) {
      return res
        .status(400)
        .json({ message: "Missing required fields..", success: false });
    }
    if(!paymentId){
      return res.status(400).json({ message: "Payment ID is required", success: false});
    }

    // Create a new sale document
    const newSale = new Sale({
      customerName,
      customerPhone,
      totalAmount,
      products,
      staff: staffId,
      paymentId
    });

    // Save the sale to the database
    const savedSale = await newSale.save();

    // Respond with success message
    res.status(200).json({ message: "New Sale Added..", success: true, data: savedSale });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message, success: false });
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

 