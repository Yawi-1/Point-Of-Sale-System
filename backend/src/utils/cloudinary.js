import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (file) => {
  try {
    if (!file || !file.path) {
      console.error("File is missing.");
      return null;
    }

    // Upload to Cloudinary
    const response = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
    });

    // Delete the temporary file
    fs.unlinkSync(file.path);

    return response.secure_url; // Ensure only the URL is returned
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Ensure the temporary file is deleted even in case of an error
    if (file?.path) {
      try {
        fs.unlinkSync(file.path);
      } catch (unlinkError) {
        console.error("Error removing local file:", unlinkError);
      }
    }

    return null;
  }
};

export default uploadOnCloudinary;
