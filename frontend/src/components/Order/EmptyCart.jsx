import React from "react";
import { CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-y-8 p-6 md:p-12">
      <div className="text-white cart text-6xl sm:text-8xl md:text-9xl bg-gray-400 p-4 rounded-full">
        <CiShoppingCart />
      </div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold text-gray-800">
        Your cart is empty
      </h2>
      <p className="text- md:w-1/3 text-center text-gray-700 font-semibold text-sm sm:text-base md:text-lg">
        Looks like you have not added anything to your cart. Go 
        ahead & explore top categories.
      </p>
      <Link to="/">
        <button className="bg-blue-600 px-6 py-2 text-white rounded-md text-sm sm:text-base md:text-lg">
          Shop Our Products
        </button>
      </Link>
    </div>
  );
};

export default EmptyCart;
