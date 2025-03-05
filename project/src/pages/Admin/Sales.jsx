import React, { useState } from 'react';
import { FaPlus, FaFilter, FaFileExport } from 'react-icons/fa';
import RecentSalesTable from '../../components/RecentSalesTable';

const Sales = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample data for sales
  const allSales = [
    { id: '1001', customer: 'John Doe', date: '2025-01-15', amount: 125.99, status: 'Completed' },
    { id: '1002', customer: 'Jane Smith', date: '2025-01-14', amount: 89.50, status: 'Completed' },
    { id: '1003', customer: 'Bob Johnson', date: '2025-01-14', amount: 45.25, status: 'Pending' },
    { id: '1004', customer: 'Alice Brown', date: '2025-01-13', amount: 210.75, status: 'Completed' },
    { id: '1005', customer: 'Charlie Wilson', date: '2025-01-12', amount: 65.00, status: 'Cancelled' },
    { id: '1006', customer: 'Eva Davis', date: '2025-01-11', amount: 175.50, status: 'Completed' },
    { id: '1007', customer: 'Frank Miller', date: '2025-01-10', amount: 32.99, status: 'Pending' },
    { id: '1008', customer: 'Grace Taylor', date: '2025-01-09', amount: 149.99, status: 'Completed' },
    { id: '1009', customer: 'Henry Clark', date: '2025-01-08', amount: 55.25, status: 'Cancelled' },
    { id: '1010', customer: 'Ivy Robinson', date: '2025-01-07', amount: 88.75, status: 'Completed' },
  ];

  // Filter sales based on status
  const filteredSales = allSales.filter(sale => {
    if (statusFilter !== 'all' && sale.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Calculate total sales
  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Sales Management</h1>
          <p className="text-gray-500">Manage and track all sales transactions</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <FaFilter className="mr-2" />
            Filter
          </button>
          <button className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            <FaFileExport className="mr-2" />
            Export
          </button>
          <button className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <FaPlus className="mr-2" />
            New Sale
          </button>
        </div>
      </div>
      
      {/* Filter Panel */}
      {filterOpen && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Filter Sales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => {
                setDateRange({ start: '', end: '' });
                setStatusFilter('all');
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
      
      {/* Sales Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
            <p className="text-2xl font-semibold text-gray-800">${totalSales.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Transactions</h3>
            <p className="text-2xl font-semibold text-gray-800">{filteredSales.length}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Average Sale</h3>
            <p className="text-2xl font-semibold text-gray-800">
              ${(totalSales / (filteredSales.length || 1)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Sales Table */}
      <RecentSalesTable sales={filteredSales} />
    </div>
  );
};

export default Sales;