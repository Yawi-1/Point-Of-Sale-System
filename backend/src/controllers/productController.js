import Product from "../models/productModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addProduct = async (req, res) => {
  try {
    const { productName, productPrice, productDescription, productCategory, productURL,productQuantity } = req.body;
    const file = req.file; // Accept only a single file

    // Check if product URL already exists
    const isProduct = await Product.findOne({ productURL });
    if (isProduct) {
      return res.status(400).json({ message: "Product URL already exists" });
    }

    if (!file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadOnCloudinary(file);

    if (!imageUrl) {
      return res.status(500).json({ message: "Failed to upload image" });
    }

    // Create a new product
    const product = await Product.create({
      productName,
      productPrice,
      productDescription,
      productCategory,
      productQuantity,
      productImage: imageUrl, // Store the single image URL
      productURL,
    });

    res.status(201).json({ data:product, message: "New Product Added Successfully", success: true });

  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};



export const getAllProducts = async(req,res)=>{
    try {
        const allProducts = await Product.find({});
        if(!allProducts){
            return res.status(404).json({message:'No Products Found',success:false});
        }
        res.status(200).json({data : allProducts, message : 'All Products Retrieved Successfully.......',success:true})
    } catch (error) {
        res.status(401).json({message:error.message,success:false})
    }
}

export const deleteProduct = async(req,res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message:'Product Not Found',success:false});
        }
        res.status(200).json({product,message:'Product Deleted Successfully.......',success:true})
    } catch (error) {
        res.status(401).json({message:error.message,success:false})
    }
}

export const updateProduct = async(req,res)=>{
    try {
        const {id} = req.params;
        const {productName,productPrice,productDescription,productCategory} = req.body;
        const product = await Product.findByIdAndUpdate(id, {productName,productPrice,productDescription,productCategory})
        if(!product){
            return res.status(404).json({message:'Product Not Found',success:false});
        }
        res.status(200).json({product,message:'Product Updated Successfully.......',success:true})
    } catch (error) {
        res.status(401).json({message:error.message,success:false})
    }
}

export const getProductById = async(req,res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message:'Product Not Found',success:false});
        }
        res.status(200).json({product,message:'Product Retrieved Successfully.......',success:true})
    } catch (error) {
        res.status(401).json({message:error.message,success:false})
    }
}