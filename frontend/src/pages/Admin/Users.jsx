import React, { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import UsersTable from '../../components/Tables/UsersTable';
import AddUserModal from '../../components/Modals/AddUserModal';
import {useAdmin} from '../../context/AdminContext'

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const {allUsers,loading,setAllUsers} = useAdmin();
  const [showModal,setShowModal] = useState(false)
  

  // Filter users based on search term
  const filteredUsers = allUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });
 
  const handleDelete = async (id) => {
     try {
      const response = await fetch(`http://localhost:5000/api/auth/delete/${id}`, {
        method:'DELETE',
      });
      const data = await response.json();
      if(data.success){
        setAllUsers(allUsers.filter((item)=> item._id !== id))
        alert('Deleted successfully...')
      }
      console.log(data)
     } catch (error) {
      if(error.response && error.response.data){
        alert(error.response.data.message)
      } else{
        alert('Something went wrong , try again later')
      }
     }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
          <p className="text-gray-500">Manage system users and permissions</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button onClick={()=>setShowModal(true)} className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <FaPlus className="mr-2" />
            Add New User
          </button>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      {/* User Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-2xl font-semibold text-gray-800">{allUsers.length}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Admins</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {allUsers.filter(user => user.role === 'admin').length}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Staff</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {allUsers.filter(user => user.role === 'staff').length}
            </p>
          </div> 
        </div>
      </div>
      
      {/* Users Table */}
      {loading && <p>Loading ....</p>}
      <UsersTable 
        users={filteredUsers} 
        onDelete={handleDelete} 
      />
      <AddUserModal 
      isOpen={showModal}
      onClose = {()=>setShowModal(false)}
      />
    </div>
  );
};

export default Users;