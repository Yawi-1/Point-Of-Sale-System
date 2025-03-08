import React from "react";
const ProductList = ({ products, selectedProducts, setSelectedProducts }) => {
    const handleAddToCart = (product) => {
        // Create a copy of the selectedProducts array
        const updatedProducts = [...selectedProducts];
        
        const existingProductIndex = updatedProducts.findIndex(
          (p) => p._id === product._id
        );
    
        if (existingProductIndex !== -1) {
          // If product exists, increase its quantity
          updatedProducts[existingProductIndex].quantity += 1;
        } else {
          // If product does not exist, add it to the array
          updatedProducts.push({ ...product, quantity: 1 });
        }
    
        // Update the selected products state with the new array
        setSelectedProducts(updatedProducts);
      };
  return (
    <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Available Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto h-[36rem]">
        {products &&
          products.map((item) => (
            <div
              key={item._id}
              className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              <div className="h-32 bg-gray-300 rounded mb-2">
                <img
                  src={item.productImage}
                  className="h-32 object-cover"
                  alt=""
                />
              </div>
              <button
                onClick={() => handleAddToCart(item)}
                className="float-right bg-blue-400 px-2 py-1 rounded-md text-white"
              >
                Add
              </button>
              <h3 className="font-semibold"> {item.productName}</h3>
              <p className="text-gray-600">₹{item.productPrice}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductList;
