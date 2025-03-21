import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { IoMdInformationCircleOutline } from "react-icons/io";
import ProductModal from "../../components/Modals/ProductModal";

const ProductList = ({ products, selectedProducts, setSelectedProducts }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal,setShowModal] = useState(false)

  const categories = [ "all",   ...new Set(products.map((product) => product.productCategory)), ];

  // Use useMemo to optimize filtering by memoizing the result and avoiding unnecessary re-calculations
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearchQuery =
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.productCategory
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.productCategory === categoryFilter;

      return matchesSearchQuery && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  // Handle Add to Cart button click
  const handleAddToCart = (product) => {
    if (product.productQuantity == 0) {
      toast("Product is out of stock");
      return;
    }
    console.log(product)

    // Create a copy of the selectedProducts array
    const updatedProducts = [...selectedProducts];

    const existingProductIndex = updatedProducts.findIndex(
      (p) => p._id === product._id
    );

    if (existingProductIndex !== -1) {
      // If product exists, increase its quantity
      if (
        updatedProducts[existingProductIndex].quantity ==
        product.productQuantity
      ) {
        toast(`Only ${product.productQuantity} quantity available`);
        return;
      }
      toast.success("Item's quantity increased by 1");
      updatedProducts[existingProductIndex].quantity += 1;
    } else {
      // If product does not exist, add it to the array
      updatedProducts.push({ ...product, quantity: 1 });
      toast.success("Item added to cart");
    }

    // Update the selected products state with the new array
    setSelectedProducts(updatedProducts);
    localStorage.setItem("cartItems", JSON.stringify(updatedProducts));
  };

  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-100 pb-2">
          Available Products
        </h2>
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
          <svg
            className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="relative  w-full md:max-w-xs">
          <div className="flex gap-x-4 md:flex-row flex-col">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
            {categoryFilter !== "all" && (
              <button
                className="bg-gray-400 px-4 py-2 rounded-lg md:my-0 my-2 text-white hover:bg-gray-300"
                onClick={() => setCategoryFilter("all")}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-auto">
        {filteredProducts.map((item) => (
          <div
            key={item._id}
            className="bg-white group relative p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out border border-gray-50 hover:border-blue-100"
          >
            {/* Hover overlay effect */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all rounded-xl pointer-events-none" />

            <div className="aspect-square relative mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 z-10">
              <img
                src={item.productImage}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                alt={item.productName}
              />
            <span className="absolute top-2 right-2 cursor-pointer hover:text-gray-400 text-gray-500" onClick={()=>setShowModal(item)}><IoMdInformationCircleOutline size={36}/></span>
            </div>
            <ProductModal
              product={showModal}
              showModal={showModal}
              setShowModal={setShowModal}
            />
            <div className="flex flex-col space-y-2 relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 truncate">
                  {item.productName}
                </h3>
                <button
                  title={`Add ${item.productName} to cart..`}
                  onClick={() => handleAddToCart(item)}
                  className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 z-20"
                >
                  <svg
                    className="w-5 h-5 text-white pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-blue-600">
                  ₹{item.productPrice}
                </p>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                  {item.productCategory}
                </span>
              </div>

              <p
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  item.productQuantity > 10
                    ? "bg-green-100 text-green-800"
                    : item.productQuantity > 0
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.productQuantity}{" "}
                {item.productQuantity > 10
                  ? "In Stock"
                  : item.productQuantity > 0
                  ? "Low Stock"
                  : "Out of Stock"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
