import React, { useState } from 'react';
import {  FaTrash,  } from 'react-icons/fa';
import DeleteModal from '../Modals/DeleteModal';
import toast from 'react-hot-toast';
const UsersTable = ({ users,setAllUsers }) => {

   const [isDelete,setIsDelete] = useState(false);
   const [id,setId] = useState('')
   const handleDelete = async () => {
    try {
      const response = await fetch(`https://pos11.netlify.app/api/auth/delete/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
  
      const data = await response.json();
      if (data.success) {
        setAllUsers(users.filter((item) => item._id !== id));
        toast('Deleted successfully...');
      }
      setIsDelete(false);
      setId('');
    } catch (error) {
      toast(error.message || 'Something went wrong, try again later');
    }
  };

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
                    onClick={() => {setId(user._id),setIsDelete(true)}} 
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
      <DeleteModal
        isOpen={isDelete}
        onClose={() => setIsDelete(false)}
        onDelete={handleDelete}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        deleteButtonLabel="Confirm Delete"
      />
    </div>
  );
};

export default UsersTable;