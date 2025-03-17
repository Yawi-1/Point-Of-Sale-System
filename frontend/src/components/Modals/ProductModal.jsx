import React from "react";

const ProductModal = ({ product, showModal, setShowModal }) => {
  const closeModal = () => setShowModal(false);

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 relative">
            <button
              onClick={closeModal}
              className="absolute -top-4 -right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
              <span className="text-gray-600 text-xl leading-none">&times;</span>
            </button>

            <div className="flex flex-col md:flex-row gap-6 p-6">
              {/* Product Image Section */}
              <div className="md:w-1/3 flex-shrink-0">
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="w-full h-48 md:h-64 object-cover rounded-lg border border-gray-200"
                />
              </div>

              {/* Product Details Section */}
              <div className="md:w-2/3 space-y-4 overflow-auto max-h-[70vh]">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {product.productName}
                  </h2>
                  <p className="text-xl font-semibold text-blue-600">
                    ₹{product.productPrice}
                  </p>
                  <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {product.productCategory}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>
                      <label className="font-medium text-gray-600">Quantity:</label>
                      <p className="text-gray-800">{product.productQuantity}</p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-600">Created:</label>
                      <p className="text-gray-800">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="font-medium text-gray-600">Updated:</label>
                      <p className="text-gray-800">
                        {new Date(product.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="font-medium text-gray-600">SKU:</label>
                      <p className="text-blue-500 break-words hover:underline">
                          {product.productURL}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="font-medium text-gray-600">Description:</label>
                  <p className="text-gray-800 text-sm md:text-base leading-relaxed">
                    {product.productDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductModal;