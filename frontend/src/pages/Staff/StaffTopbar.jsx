import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing icons for hamburger and close
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useAuth } from "../../context/AuthContext";
import { useStaff } from "../../context/StaffContext";
import UserInfoModal from "../../components/Modals/UserInfoModal";

const StaffTopbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control the menu visibility
  const [isModal, setModal] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
  };

  const { logout, user } = useAuth();
  const { selectedProducts } = useStaff();

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl">Staff Dashboard</div>

      {/* Hamburger icon for small screens */}
      <div className="lg:hidden flex items-center gap-x-4">
        <Link to="/cart" className="relative">
          <AiOutlineShoppingCart className="text-white" size={24} />
          <span className="absolute -top-4 left-2">
            {selectedProducts?.length || 0}
          </span>
        </Link>
        <button onClick={toggleMenu}>
          {isMenuOpen ? (
            <FaTimes className="text-white" size={24} /> 
          ) : (
            <FaBars className="text-white" size={24} />
          )}
        </button>
      </div>

      {/* Menu links for larger screens */}
      <div className="hidden lg:flex items-center space-x-4">
        <Link to="/" className="hover:text-gray-400">
          Dashboard
        </Link>

        <Link to="/sales" className="hover:text-gray-400">
          Sales
        </Link>
        <Link to="/inventory" className="hover:text-gray-400">
          Inventory
        </Link>
        <Link to="/cart" className="relative hover:text-gray-400">
          <span>
            <AiOutlineShoppingCart size={28} />
          </span>
          <span className="absolute -top-3 text-sm  left-3">
            {selectedProducts?.length || 0}
          </span>
        </Link>

        {/* User Avatar with hover effect */}
        <img
          onClick={() => setModal(true)}
          src="https://ui-avatars.com/api/?name=Staff+User&background=0D8ABC&color=fff"
          alt="User"
          className="h-8 w-8 rounded-full cursor-pointer"
        />

        {/* Modal shown only on hover of the image */}
        <UserInfoModal 
        isOpen={isModal}
        user={user} 
        logout={logout}
        onClose = {()=>setModal(false)}
         />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="z-20 lg:hidden absolute top-16 left-0 w-full bg-gray-800 p-4 flex flex-col space-y-4">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-white hover:text-gray-400"
          >
            Dashboard
          </Link>
          <Link
            to="/sales"
            onClick={() => setIsMenuOpen(false)}
            className="text-white hover:text-gray-400"
          >
            Sales
          </Link>
          <Link
            to="/inventory"
            onClick={() => setIsMenuOpen(false)}
            className="text-white hover:text-gray-400"
          >
            Inventory
          </Link>
          <button className="text-white hover:text-gray-400" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default StaffTopbar;
