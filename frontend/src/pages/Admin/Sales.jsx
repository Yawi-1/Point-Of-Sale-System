import React, { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import RecentSalesTable from '../../components/Tables/RecentSalesTable';
import { useAdmin } from '../../context/AdminContext';

const Sales = () => {
  const { allSales, totalSales } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [amountFilter, setAmountFilter] = useState('all');

  const filteredSales = allSales.filter(sale => {
    // Customer name filter
    const customerMatch = sale.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    if (!customerMatch) return false;

    // Date filter
    const saleDate = new Date(sale.date);
    const startDate = dateFilter.start ? new Date(dateFilter.start) : null;
    const endDate = dateFilter.end ? new Date(dateFilter.end + 'T23:59:59') : null;
    
    if (startDate && saleDate < startDate) return false;
    if (endDate && saleDate > endDate) return false;

    // Amount filter
    const amount = sale.totalAmount;
    switch(amountFilter) {
      case 'high':
        if (amount < 1000) return false;
        break;
      case 'medium':
        if (amount < 500 || amount >= 1000) return false;
        break;
      case 'low':
        if (amount >= 500) return false;
        break;
      default:
        // all amounts
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Sales Management</h1>
          <p className="text-gray-500">Manage and track all sales transactions</p>
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
            <p className="text-2xl font-semibold text-gray-800">₹{totalSales.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Transactions</h3>
            <p className="text-2xl font-semibold text-gray-800">{filteredSales.length}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Average Sale</h3>
            <p className="text-2xl font-semibold text-gray-800">
              ₹{(totalSales / (allSales.length || 1)).toFixed(2)}
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
            placeholder="Search by customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Filter Sales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateFilter.start}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="date"
                  value={dateFilter.end}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
              <select
                value={amountFilter}
                onChange={(e) => setAmountFilter(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Amounts</option>
                <option value="high">High (≥₹1000)</option>
                <option value="medium">Medium (₹500 - ₹999)</option>
                <option value="low">Low (&lt;₹500)</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => {
                setDateFilter({ start: '', end: '' });
                setAmountFilter('all');
              }}
              className="px-4 py-2 text-gray-700 mr-2"
            >
              Reset
            </button>
            <button 
              onClick={() => setFilterOpen(false)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      {/* Sales Table */}
      <RecentSalesTable allSales={filteredSales} />
    </div>
  );
};

export default Sales;