import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerEmail:{
      type: String,
      required: true,
    },
    staff: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    products: {
      type: Array,
      required: true,
    },
    totalAmount:{
        type:Number,
        required:true
    },
    paymentId:String
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model("Sale", salesSchema);

export default Sale;
