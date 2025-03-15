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
        "http://localhost:3000/api/auth/login",
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
  <div className="w-full max-w-xs sm:max-w-md p-6 sm:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl">
    <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-3 sm:mb-4">
      Point of Sale System
    </h2>
    <p className="text-center text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
      Welcome back! Please log in to manage sales and inventory.
    </p>
    {error && (
      <div className="mb-3 sm:mb-4 text-red-500 text-sm sm:text-base text-center font-medium">
        {error}
      </div>
    )}
    <form onSubmit={handleSubmit}>
      <div className="mb-3 sm:mb-4">
        <label
          className="block text-gray-700 text-sm font-medium mb-1 sm:mb-2"
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          disabled={isLogin}
          type="email"
          id="email"
          className="w-full px-4 py-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4 sm:mb-5">
        <label
          className="block text-gray-700 text-sm font-medium mb-1 sm:mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          disabled={isLogin}
          type="password"
          id="password"
          className="w-full px-4 py-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        disabled={isLogin}
        type="submit"
        className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
      >
        {isLogin ? (
          <div className="flex items-center justify-center gap-x-2 sm:gap-x-3">
            <div className="border-2 border-t-2 border-dashed animate-spin h-5 w-5 sm:h-6 sm:w-6 rounded-full" />
            <span>Logging In</span>
          </div>
        ) : (
          'Login'
        )}
      </button>
    </form>

    <div className="mt-4 sm:mt-6 space-y-2">
      <button
        onClick={handleAdminLogin}
        className="w-full text-sm sm:text-base bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition duration-200"
      >
        Demo Admin Login
      </button>
      <button
        onClick={handleStaffLogin}
        className="w-full text-sm sm:text-base bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition duration-200"
      >
        Demo Staff Login
      </button>
    </div>
  </div>
</div>
  );
};

export default Login;
