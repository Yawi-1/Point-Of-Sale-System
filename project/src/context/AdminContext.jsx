import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState([]);
  const fetchAllusers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/auth/allUsers",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const data = response.data.data;
      setAllUsers(data);
    } catch (error) {
      console.error("Error at fetching all users : ", error);
    }
  };
  useEffect(() => {
    fetchAllusers();
  }, []);
  return (
    <AdminContext.Provider
      value={{
        allUsers,
        fetchAllusers,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
