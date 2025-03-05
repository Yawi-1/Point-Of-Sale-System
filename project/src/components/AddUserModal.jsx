import React from "react";

const AddUserModal = ({isOpen,onClose}) => {
    if(!isOpen) return null;
  return (
    <div className="fixed w-full h-screen flex items-center justify-center">
      <div>
        <h2 className="text-2xl font-bold mb-4">Add User</h2>
        <form action="">
          <div>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" />
          </div>
          <select name="" id="">
            <option value="" disabled>Select Role</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
