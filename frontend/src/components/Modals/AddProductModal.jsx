import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAdmin } from "../../context/AdminContext";

const AddProductModal = ({ isOpen, onClose }) => {
  const { setAllProducts } = useAdmin();
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    if (isSubmitting) return; // Prevent changes when submitting
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (isSubmitting) return; // Prevent changes when submitting
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
    const { productName, productPrice, productDescription, productCategory, productURL, productQuantity, productImage } = productData;

    if (!productName || !productPrice || !productDescription || !productCategory || !productURL || !productQuantity) {
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
      const response = await axios.post("http://localhost:5000/api/product/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setSuccessMessage("Product added successfully!");
        const { data } = response.data;
        setAllProducts((prev) => [...prev, data]);

        setTimeout(() => {
          setSuccessMessage(null);
          resetForm();
          onClose();
        }, 2000);
      }
    } catch (error) {
      setError("There was an error adding the product: " + (error.response?.data?.message || error.message));
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
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Add New Product</h2>

        {error && <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg text-sm">{error}</div>}
        {successMessage && <div className="mb-4 p-3 text-green-700 bg-green-100 rounded-lg text-sm">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" name="productName" value={productData.productName} onChange={handleChange} placeholder="Product name"
              disabled={isSubmitting} className={`w-full p-2 border rounded-md ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`} />

            <input type="number" name="productPrice" value={productData.productPrice} onChange={handleChange} placeholder="0.00" step="0.01"
              disabled={isSubmitting} className={`w-full p-2 border rounded-md ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*"
              disabled={isSubmitting} className={`w-full p-2 border rounded-md ${isSubmitting ? "cursor-not-allowed" : ""}`} />
            
            {previewImage && <img src={previewImage} alt="Preview" className="h-32 w-auto rounded-lg border" />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" name="productCategory" value={productData.productCategory} onChange={handleChange} placeholder="Product category"
              disabled={isSubmitting} className={`w-full p-2 border rounded-md ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`} />

            <input type="number" name="productQuantity" value={productData.productQuantity} onChange={handleChange} placeholder="Available quantity"
              disabled={isSubmitting} className={`w-full p-2 border rounded-md ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`} />
          </div>

          <input type="text" name="productURL" value={productData.productURL} onChange={handleChange} placeholder="Unique ID"
            disabled={isSubmitting} className={`w-full p-2 border rounded-md mb-4 ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`} />

          <textarea name="productDescription" value={productData.productDescription} onChange={handleChange} placeholder="Detailed description" rows="3"
            disabled={isSubmitting} className={`w-full p-2 border rounded-md mb-6 ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`} />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2 bg-gray-300 rounded-md">Cancel</button>

            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
