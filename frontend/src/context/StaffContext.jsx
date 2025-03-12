import React, { createContext, useState, useContext } from "react";

const staffContext = createContext(null);

export const StaffProvider = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState(JSON.parse(localStorage.getItem('cartItems')) || []);
  
  const totalAmount = selectedProducts?.reduce(
    (acc, it) => acc + parseFloat(it.productPrice) * it.quantity,
    0
  );


  return (
    <staffContext.Provider
      value={{
        selectedProducts,
        setSelectedProducts,
        totalAmount,
      }}
    >
      {children}
    </staffContext.Provider>
  );
};

export const useStaff = () => useContext(staffContext);
