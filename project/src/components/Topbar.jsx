import React from 'react';
import { FaBars, FaBell, FaUser, FaSearch } from 'react-icons/fa';

const Topbar = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-4">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <FaBars size={20} />
      </button>
      
      <div className="flex-1 ml-4">
        <div className="relative max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none relative">
          <FaBell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        <div className="flex items-center">
          <img
            src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
            alt="User"
            className="h-8 w-8 rounded-full"
          />
          <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;