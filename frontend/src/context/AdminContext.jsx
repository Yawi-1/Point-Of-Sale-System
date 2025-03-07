import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import useFetch from "../hooks/useFetch";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const token = localStorage.getItem('token');
  const [allUsers, setAllUsers] = useState([]);
  const [allProducts,setAllProducts] = useState([])
  // Memoize options to prevent infinite re-fetch
  const options = useMemo(() => ({}), []);

  const { data:users, error, loading } = useFetch("http://localhost:3000/api/auth/allUsers", options, token);
  const {data:products} = useFetch('http://localhost:3000/api/product/all',options)
  const addProduct = (product)=>{
    setAllProducts((prev)=>([...allProducts,product]))
  }
  useEffect(() => {
    if (users) {
      setAllUsers(users);
    }
    if(products){
      setAllProducts(products)
    }
  }, [users,products]); // Update allUsers when data changes

  return (
    <AdminContext.Provider value={{ allUsers,allProducts, error, loading,addProduct }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);