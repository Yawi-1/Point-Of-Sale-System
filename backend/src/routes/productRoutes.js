import express from "express";
import { addProduct, getAllProducts, deleteProduct, updateProduct, getProductById } from "../controllers/productController.js";
import { uploadSingleImage } from "../middlewares/upload.js";

const router = express.Router();

router.post("/add", uploadSingleImage, addProduct);
router.get("/all", getAllProducts);
router.delete("/delete/:id", deleteProduct);
router.put("/update/:id", updateProduct);
router.get("/:id", getProductById);

export default router;
