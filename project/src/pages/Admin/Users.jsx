import React, { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import UsersTable from '../../components/UsersTable';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data for users
  const allUsers = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'Admin', 
      active: true, 
      lastLogin: '2025-01-15 09:23',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      role: 'Cashier', 
      active: true, 
      lastLogin: '2025-01-14 14:45',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=4F46E5&color=fff'
    },
    { 
      id: 3, 
      name: 'Bob Johnson', 
      email: 'bob@example.com', 
      role: 'Manager', 
      active: true, 
      lastLogin: '2025-01-13 11:30',
      avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=10B981&color=fff'
    },
    { 
      id: 4, 
      name: 'Alice Brown', 
      email: 'alice@example.com', 
      role: 'Cashier', 
      active: false, 
      lastLogin: '2025-01-10 16:15',
      avatar: 'https://ui-avatars.com/api/?name=Alice+Brown&background=F59E0B&color=fff'
    },
    { 
      id: 5, 
      name: 'Charlie Wilson', 
      email: 'charlie@example.com', 
      role: 'Inventory', 
      active: true, 
      lastLogin: '2025-01-15 08:05',
      avatar: 'https://ui-avatars.com/api/?name=Charlie+Wilson&background=EF4444&color=fff'
    },
  ];

  // Filter users based on search term
  const filteredUsers = allUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  // Handler functions (these would connect to actual functionality in a real app)
  const handleEdit = (id) => {
    console.log(`Edit user with ID: ${id}`);
    // In a real app, this would open a modal or navigate to an edit page
  };

  const handleDelete = (id) => {
    console.log(`Delete user with ID: ${id}`);
    // In a real app, this would show a confirmation dialog and then delete the user
  };

  const handleToggleStatus = (id) => {
    console.log(`Toggle status for user with ID: ${id}`);
    // In a real app, this would update the user's active status
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
          <p className="text-gray-500">Manage system users and permissions</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-2xl font-semibold text-gray-800">{allUsers.length}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {allUsers.filter(user => user.active).length}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Admins</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {allUsers.filter(user => user.role === 'Admin').length}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Cashiers</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {allUsers.filter(user => user.role === 'Cashier').length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <UsersTable 
        users={filteredUsers} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onToggleStatus={handleToggleStatus} 
      />
    </div>
  );
};

export default Users;