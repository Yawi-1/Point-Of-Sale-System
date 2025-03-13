import React,{useState} from 'react';
import {FaTrash } from 'react-icons/fa';
import DeleteModal from '../Modals/DeleteModal'
import toast from 'react-hot-toast';
const InventoryTable = ({ products,setAllProducts }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [id,setId] = useState('');


  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/api/product/delete/${id}`,{
      method: 'DELETE'
    })
    const data = await response.json();
    if(data.success){
      toast('Product deleted successfully');
      setAllProducts((prev)=> prev.filter((item)=> item._id !== id))
    }
    setDeleteModalOpen(false);
    setId('')
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
      <div className="overflow-auto h-96">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={product.productImage} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                      <div className="text-sm text-gray-500">SKU: {product.productURL}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.productCategory}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{product.productPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.productQuantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.productQuantity > 10 
                      ? 'bg-green-100 text-green-800' 
                      : product.productQuantity > 0 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.productQuantity > 10 ? 'In Stock' : product.productQuantity > 0 ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => {setId(product._id),setDeleteModalOpen(true)}} 
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
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
        id={id}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        deleteButtonLabel="Confirm Delete"
      />
    </div>
  );
};

export default InventoryTable;