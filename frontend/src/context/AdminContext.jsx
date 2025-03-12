import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import useFetch from "../hooks/useFetch";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const token = localStorage.getItem('token');
  const [allUsers, setAllUsers] = useState([]);
  const [allProducts,setAllProducts] = useState([]);
  const [allSales,setAllSales] = useState([])

  
  // Memoize options to prevent infinite re-fetch
  const options = useMemo(() => ({}), []);

  const { data:users } = useFetch("http://localhost:5000/api/auth/allUsers", options, token);
  const {data:products} = useFetch('http://localhost:5000/api/product/all',options);
  const {data:Sales} = useFetch('http://localhost:5000/api/sale/all',options);
  const {data:staffSales} = useFetch('http://localhost:5000/api/sale/each',options,token);

  const totalSales = allSales?.reduce((sum, sale) => sum + sale.totalAmount, 0);


  useEffect(() => {
    if (users) {
      setAllUsers(users);
    }
    if(products){
      setAllProducts(products)
    }
    if(Sales){
      setAllSales(Sales)
    }
  }, [users,products,Sales]); 

  return (
    <AdminContext.Provider value={{ allUsers,allProducts,setAllProducts,setAllUsers,staffSales,allSales,totalSales,setAllSales }}>
      {children}
    </AdminContext.Provider>
  );
}; 

export const useAdmin = () => useContext(AdminContext);