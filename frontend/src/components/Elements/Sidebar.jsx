import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaUsers,
  FaBoxes,
  FaSignOutAlt,
  FaTimes,
  FaBars
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: "/", name: "Dashboard", icon: <FaHome size={20} /> },
    { path: "/sales", name: "Sales", icon: <FaShoppingCart size={20} /> },
    { path: "/users", name: "Users", icon: <FaUsers size={20} /> },
    { path: "/inventory", name: "Inventory", icon: <FaBoxes size={20} /> },
  ];

  return (
    <>
    

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 ${
          isOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-20"
        } bg-dark text-white transition-all duration-300 ease-in-out h-screen`}
      >
        {/* Close Button for Mobile */}
        <button
          onClick={toggleSidebar}
          className="md:hidden absolute top-4 right-4 p-2 text-white hover:text-gray-300"
        >
          <FaTimes size={24} />
        </button>

        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          {isOpen ? (
            <h1 className="text-xl font-bold">POS Admin</h1>
          ) : (
            <h1 className="text-xl font-bold">POS</h1>
          )}
        </div>

        <div className="py-4 overflow-y-auto">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && toggleSidebar()}
                  className={`flex items-center px-4 py-3 ${
                    location.pathname === item.path
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  } transition-colors duration-200`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {isOpen && <span className="whitespace-nowrap">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute bottom-0 w-full border-t border-gray-700">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
          >
            <span className="mr-3">
              <FaSignOutAlt size={20} />
            </span>
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;