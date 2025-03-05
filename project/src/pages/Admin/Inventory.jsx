import React, { useState } from 'react';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import InventoryTable from '../../components/InventoryTable';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  
  // Sample data for products
  const allProducts = [
    { 
      id: 1, 
      name: 'Smartphone X', 
      sku: 'SM-X001', 
      category: 'Electronics', 
      price: 799.99, 
      stock: 25,
      image: 'https://ui-avatars.com/api/?name=SM&background=0D8ABC&color=fff'
    },
    { 
      id: 2, 
      name: 'Laptop Pro', 
      sku: 'LP-P002', 
      category: 'Electronics', 
      price: 1299.99, 
      stock: 12,
      image: 'https://ui-avatars.com/api/?name=LP&background=4F46E5&color=fff'
    },
    { 
      id: 3, 
      name: 'Wireless Headphones', 
      sku: 'WH-003', 
      category: 'Electronics', 
      price: 149.99, 
      stock: 30,
      image: 'https://ui-avatars.com/api/?name=WH&background=10B981&color=fff'
    },
    { 
      id: 4, 
      name: 'Cotton T-Shirt', 
      sku: 'CTS-004', 
      category: 'Clothing', 
      price: 19.99, 
      stock: 100,
      image: 'https://ui-avatars.com/api/?name=CT&background=F59E0B&color=fff'
    },
    { 
      id: 5, 
      name: 'Denim Jeans', 
      sku: 'DJ-005', 
      category: 'Clothing', 
      price: 49.99, 
      stock: 45,
      image: 'https://ui-avatars.com/api/?name=DJ&background=EF4444&color=fff'
    },
    { 
      id: 6, 
      name: 'Coffee Maker', 
      sku: 'CM-006', 
      category: 'Appliances', 
      price: 89.99, 
      stock: 8,
      image: 'https://ui-avatars.com/api/?name=CM&background=8B5CF6&color=fff'
    },
    { 
      id: 7, 
      name: 'Blender', 
      sku: 'BL-007', 
      category: 'Appliances', 
      price: 59.99, 
      stock: 15,
      image: 'https://ui-avatars.com/api/?name=BL&background=EC4899&color=fff'
    },
    { 
      id: 8, 
      name: 'Fitness Tracker', 
      sku: 'FT-008', 
      category: 'Electronics', 
      price: 79.99, 
      stock: 0,
      image: 'https://ui-avatars.com/api/?name=FT&background=14B8A6&color=fff'
    },
  ];

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(allProducts.map(product => product.category))];

  // Filter products based on search term and filters
  const filteredProducts = allProducts.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search filter
    if (
      !product.name.toLowerCase().includes(searchLower) &&
      !product.sku.toLowerCase().includes(searchLower) &&
      !product.category.toLowerCase().includes(searchLower)
    ) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== 'all' && product.category !== categoryFilter) {
      return false;
    }
    
    // Stock filter
    if (stockFilter === 'instock' && product.stock <= 0) {
      return false;
    } else if (stockFilter === 'lowstock' && (product.stock <= 0 || product.stock > 10)) {
      return false;
    } else if (stockFilter === 'outofstock' && product.stock > 0) {
      return false;
    }
    
    return true;
  });

  // Handler functions (these would connect to actual functionality in a real app)
  const handleEdit = (id) => {
    console.log(`Edit product with ID: ${id}`);
    // In a real app, this would open a modal or navigate to an edit page
  };

  const handleDelete = (id) => {
    console.log(`Delete product with ID: ${id}`);
    // In a real app, this would show a confirmation dialog and then delete the product
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Inventory Management</h1>
          <p className="text-gray-500">Manage your products and stock levels</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <FaFilter className="mr-2" />
            Filter
          </button>
          <button className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors">
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
      
      {/* Inventory Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
            <p className="text-2xl font-semibold text-gray-800">{allProducts.length}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Out of Stock</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {allProducts.filter(product => product.stock <= 0).length}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Low Stock</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {allProducts.filter(product => product.stock > 0 && product.stock <= 10).length}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Categories</h3>
            <p className="text-2xl font-semibold text-gray-800">
              {categories.length - 1} {/* Subtract 1 for the 'all' option */}
            </p>
          </div>
        </div>
      </div>
      
      {/* Inventory Table */}
      <InventoryTable 
        products={filteredProducts} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default Inventory;