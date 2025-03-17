import React from "react";

const UserInfoModal = ({ isOpen,user, logout,onClose }) => {
    if (!isOpen) return null ;
  return (
    <div className="absolute top-0 right-0 z-50 w-56 bg-white p-4 rounded-lg shadow-md   transition-opacity duration-200">
      <div className="flex relative flex-col items-start">
        {/* Username and Role */}
        <span className="font-semibold text-sm text-gray-800">
         Name  : {user?.name || "Staff"}
        </span>
        <span className="font-semibold text-sm text-gray-800">
         Email  : {user?.email || "Email Not Found"}
        </span>
        <span className="text-sm font-medium  text-gray-600">
          Role : {user?.role || "User Role"}
        </span>
        <span onClick={onClose} className="absolute text-black -top-2 cursor-pointer hover:scale-105 right-2 z-50">X</span>
        {/* Logout Button */}
        <button
          className="mt-3 w-full text-center py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={logout}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default UserInfoModal;
