import Sale from "../models/salesModel.js";

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
    const { customerName, customerPhone, totalAmount, products } = req.body;
    const staffId = req?.user?.id; // Assuming staffId comes from the authenticated user
    console.log(products)

    // Ensure all required fields are provided
    if (!customerName || !customerPhone || !totalAmount || !products) {
      return res
        .status(400)
        .json({ message: "Missing required fields..", success: false });
    }

    // Create a new sale document
    const newSale = new Sale({
      customerName,
      customerPhone,
      totalAmount,
      products,
      staff: staffId,
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