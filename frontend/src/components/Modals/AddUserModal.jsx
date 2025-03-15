import React, { useState } from "react";
import axios from "axios";
import { useAdmin } from "../../context/AdminContext";
import toast from "react-hot-toast";
const AddUserModal = ({ isOpen, onClose }) => {
  const [isAdding,setIsAdding] = useState(false);
  const {setAllUsers} = useAdmin();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!userData.name || !userData.email || !userData.password || !userData.role){
      toast.info("Please fill all fields");
      return;
    }
    try {
      setIsAdding(true)
      const response = await axios.post('http://localhost:3000/api/auth/register', userData);
      if(response.data.success){
        const {user} = response.data;
        setAllUsers((prev) => [...prev, user]);
        toast.success(response?.data?.message);
        setUserData({
          name: "",
          email: "",
          password: "",
          role: "",
        })
        setTimeout(()=>{onClose()},2000)
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally{
      setIsAdding(false)
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Add User</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              disabled={isAdding}
              value={userData.name}
              onChange={handleChange}
              className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Name"
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              value={userData.role}
              onChange={handleChange}
              disabled={isAdding}
              name="role"
              id="role"
              className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option className="text-gray-600" value="" disabled>
                Select Role
              </option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              value={userData.email}
              disabled={isAdding}
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              placeholder=" Email"
              className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
             disabled={isAdding}
              value={userData.password}
              onChange={handleChange}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              disabled={isAdding}
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
            >
              Cancel
            </button>
            <button
              disabled={isAdding}
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              {isAdding ? <div className="flex gap-x-2 "><span className="animate-pulse">Adding...</span> <div className="h-6 w-6 rounded-full border-2 p-2 border-dashed border-white  animate-spin "></div> </div>:"Add User"} 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
