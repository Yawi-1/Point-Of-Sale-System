import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import useFetch from "../hooks/useFetch";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const token = localStorage.getItem('token');
  const [allUsers, setAllUsers] = useState([]);
  const [allProducts,setAllProducts] = useState([])
  // Memoize options to prevent infinite re-fetch
  const options = useMemo(() => ({}), []);

  const { data:users, error, loading } = useFetch("http://localhost:5000/api/auth/allUsers", options, token);
  const {data:products} = useFetch('http://localhost:5000/api/product/all',options);
  const {data:allSales} = useFetch('http://localhost:5000/api/sale/all',options);
  const {data:staffSales} = useFetch('http://localhost:5000/api/sale/each',options,token);



  const addProduct = (product)=>{
    setAllProducts((prev)=>([...prev,product]))
  }




  useEffect(() => {
    if (users) {
      setAllUsers(users);
    }
    if(products){
      setAllProducts(products)
    }
  }, [users,products]); 

  return (
    <AdminContext.Provider value={{ allUsers,allProducts, error,staffSales, loading,addProduct,allSales }}>
      {children}
    </AdminContext.Provider>
  );
}; 

export const useAdmin = () => useContext(AdminContext);