import React, { useState } from 'react';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import InventoryTable from '../../components/Tables/InventoryTable';
import AddProductModal from '../../components/Modals/AddProductModal';
import { useAdmin } from '../../context/AdminContext';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [showAddModal,setShowAddModal] = useState(false)
  const {allProducts,setAllProducts} = useAdmin();

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(allProducts.map(product => product.productCategory))];

  // Filter products based on search term and filters
  const filteredProducts = allProducts.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search filter
    if (
      !product.productName.toLowerCase().includes(searchLower) &&
      !product.productURL.toLowerCase().includes(searchLower) &&
      !product.productCategory.toLowerCase().includes(searchLower)
    ) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== 'all' && product.productCategory !== categoryFilter) {
      return false;
    }
    
    // Stock filter
    if (stockFilter === 'instock' && product.productQuantity <= 0) {
      return false;
    } else if (stockFilter === 'lowstock' && (product.productQuantity <= 0 || product.productQuantity > 10)) {
      return false;
    } else if (stockFilter === 'outofstock' && product.productQuantity > 0) {
      return false;
    }
    
    return true;
  });

  

  const handleDelete = async (id) => {
    console.log(`Delete product with ID: ${id}`);
    const response = await fetch(`http://localhost:5000/api/product/delete/${id}`,{
      method: 'DELETE'
    })
    const data = await response.json();
    if(data.success){
      alert('Product deleted successfully');
      setAllProducts((prev)=>([...prev, data.product]))
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Inventory Management</h1>
          <p className="text-gray-500">Manage your products and stock levels</p>
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
            <p className="text-2xl font-semibold text-gray-800">{allProducts.length}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Out of Stock</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {allProducts.filter(product => product.productQuantity <= 0).length}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Low Stock</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {allProducts.filter(product => product.productQuantity > 0 && product.productQuantity <= 10).length}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Categories</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {categories.length - 1} 
            </p>
       </div> 
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <FaFilter className="mr-2" />
            Filter
          </button>
          <button onClick={()=>setShowAddModal(true)} className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <FaPlus className="mr-2" />
            Add Product
          </button>
        </div>
      </div>
      
      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products by name, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      {/* Filter Panel */}
      {filterOpen && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Filter Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All</option>
                <option value="instock">In Stock</option>
                <option value="lowstock">Low Stock</option>
                <option value="outofstock">Out of Stock</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => {
                setCategoryFilter('all');
                setStockFilter('all');
              }}
              className="px-4 py-2 text-gray-700 mr-2"
            >
              Reset
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Inventory Table */}
      <InventoryTable 
        products={filteredProducts} 
        onDelete={handleDelete} 
      />
      <AddProductModal
      isOpen={showAddModal}
      onClose={()=>setShowAddModal(false)}
      />
    </div>
  );
};

export default Inventory;