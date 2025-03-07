import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAdmin } from "../context/AdminContext";
const AddProductModal = ({ isOpen, onClose }) => {
  const { addProduct } = useAdmin();
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: "",
    productImage: null,
    productDescription: "",
    productCategory: "",
    productURL: "",
    productQuantity: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData((prev) => ({ ...prev, productImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const {
      productName,
      productPrice,
      productDescription,
      productCategory,
      productURL,
      productQuantity,
      productImage,
    } = productData;
    console.log(productData);

    if (
      !productName ||
      !productPrice ||
      !productDescription ||
      !productCategory ||
      !productURL ||
      !productQuantity
    ) {
      setError("All fields are required.");
      return false;
    }

    if (!productImage) {
      setError("Please upload a product image.");
      return false;
    }

    if (isNaN(productPrice) || productPrice <= 0) {
      setError("Product price must be a positive number.");
      return false;
    }

    if (isNaN(productQuantity) || productQuantity <= 0) {
      setError("Product quantity must be a positive number.");
      return false;
    }
    setError(null);
    return true;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDescription", productData.productDescription);
    formData.append("productCategory", productData.productCategory);
    formData.append("productURL", productData.productURL);
    formData.append("productQuantity", productData.productQuantity);
    formData.append("productImage", productData.productImage);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/product/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        setSuccessMessage("Product added successfully!");
        addProduct(response.data.data);
        setTimeout(() => {
          setSuccessMessage(null);
          resetForm();
          onClose();
        }, 2000);
      }
    } catch (error) {
      setError(
        "There was an error adding the product: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error:", error.response);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setProductData({
      productName: "",
      productPrice: "",
      productImage: null,
      productDescription: "",
      productCategory: "",
      productURL: "",
      productQuantity: "",
    });
    setPreviewImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError("");
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 max-w-3xl mx-2 max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Add New Product
        </h2>

        {error && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 text-green-700 bg-green-100 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Row 1 - Name & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="productName"
                value={productData.productName}
                onChange={handleChange}
                placeholder="Product name"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                name="productPrice"
                value={productData.productPrice}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 2 - Image Upload & Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image *
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-2 border-dashed rounded-lg hover:border-gray-400 cursor-pointer">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="pt-1 text-sm text-gray-600">
                      {productData.productImage
                        ? productData.productImage.name
                        : "Click to upload image"}
                    </p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="opacity-0"
                  />
                </label>
              </div>
            </div>
            {previewImage && (
              <div className="flex justify-center items-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-32 w-auto rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Row 3 - Category & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <input
                type="text"
                name="productCategory"
                value={productData.productCategory}
                onChange={handleChange}
                placeholder="Product category"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="productQuantity"
                value={productData.productQuantity}
                onChange={handleChange}
                placeholder="Available quantity"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 4 - Product URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product URL *
            </label>
            <input
              type="text"
              name="productURL"
              value={productData.productURL}
              onChange={handleChange}
              placeholder="Unique ID"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="productDescription"
              value={productData.productDescription}
              onChange={handleChange}
              placeholder="Detailed product description"
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-gray-200 bg-gray-300 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700
            rounded-md transition-colors duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? <div className="flex gap-x-2 "><span className="animate-pulse">Adding...</span> <div className="h-6 w-6 rounded-full border-2 p-2 border-dashed border-white  animate-spin "></div> </div> : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
