import React from 'react';
import {  FaTrash,  } from 'react-icons/fa';

const UsersTable = ({ users, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-auto h-64">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className='hover:bg-gray-100'>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 uppercase">{user.name}</div>
                  </div>
                </td>
                <td className={`${user.role === 'admin' ? 'text-green-500 capitalize font-bold' : 'text-yellow-400 capitalize font-bold'} px-6 py-4 whitespace-nowrap text-sm `}>
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  <button 
                    onClick={() => onDelete(user._id)} 
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))} 
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;