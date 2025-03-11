import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';  // Importing icons for hamburger and close
import { useAuth } from '../../context/AuthContext';
const StaffTopbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);  // State to control the menu visibility

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);  // Toggle the menu visibility
  };

  const {logout} = useAuth();

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl">Staff Dashboard</div>

      {/* Hamburger icon for small screens */}
      <div className="lg:hidden">
        <button onClick={toggleMenu}>
          {isMenuOpen ? (
            <FaTimes className="text-white" size={24} />  // Show close icon when menu is open
          ) : (
            <FaBars className="text-white" size={24} />  // Show hamburger icon when menu is closed
          )}
        </button>
      </div>

      {/* Menu links for larger screens */}
      <div className="hidden lg:flex space-x-4">
        <Link to="/" className="hover:text-gray-400">Dashboard</Link>
        <Link to="/sales" className="hover:text-gray-400">Sales</Link>
        <Link to="/inventory" className="hover:text-gray-400">Inventory</Link>
        <button className="hover:text-gray-400" onClick={logout}>Log out</button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="z-20 lg:hidden absolute top-16 left-0 w-full bg-gray-800 p-4 flex flex-col space-y-4">
          <Link to="/" onClick={()=>setIsMenuOpen(false)} className="text-white hover:text-gray-400">Dashboard</Link>
          <Link to="/sales" onClick={()=>setIsMenuOpen(false)} className="text-white hover:text-gray-400">Sales</Link>
          <Link to="/inventory" onClick={()=>setIsMenuOpen(false)} className="text-white hover:text-gray-400">Inventory</Link>
          <button className="text-white hover:text-gray-400">Log out</button>
        </div>
      )}
    </div>
  );
};

export default StaffTopbar;
