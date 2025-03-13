import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin,setLogin] = useState(false)
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email.trim()){
      return toast.error('Please enter an email');
    }
    if(!password.trim()){
      return toast.error('Please enter a password');
    }
    setLogin(true);
    try {
      const response = await axios.post(
        "https://point-of-sale-srz7.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        login(response.data.token, response.data.user);
        navigate("/");

        toast.success(response.data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed, try again later."
      );
    } finally{
      setLogin(false)
    }
  };

  const handleAdminLogin = () => {
    setEmail("admin@gmail.com");
    setPassword("123456");
  };
  const handleStaffLogin = () => {
    setEmail("staff@gmail.com");
    setPassword("123456");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Point of Sale System
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Welcome back! Please log in to manage sales and inventory.
        </p>
        {error && (
          <div className="mb-4 text-red-500 text-center font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
             disabled={isLogin}
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
            disabled={isLogin}
              type="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
          disabled={isLogin}
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition duration-200 shadow-lg"
          >
           {isLogin ? <div className="flex items-center justify-center gap-x-4"><div className="border-2 border-dashed animate-spin h-6 w-6 rounded-full"></div>Logging In </div> : 'Login'}
          </button>
        </form>
        <p
          onClick={handleAdminLogin}
          className="text-blue-600 cursor-pointer underline"
        >
          Demo Login as Admin
        </p>
        <p
          onClick={handleStaffLogin}
          className="text-blue-600 cursor-pointer underline"
        >
          Demo Login as Staff
        </p>
      </div>
    </div>
  );
};

export default Login;
