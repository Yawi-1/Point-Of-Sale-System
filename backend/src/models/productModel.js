import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    productImage: {
      type: String, 
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productCategory: {
      type: String,
    },
    productURL: {
      type: String,
      unique: true,
      required: true,
    },
    productQuantity:{
      type:Number,
      required:true,
      min:0
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
