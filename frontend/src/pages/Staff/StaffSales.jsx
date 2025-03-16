import React, { useState } from 'react'
import { FaSearch, FaFilter } from 'react-icons/fa'
import { useAdmin } from '../../context/AdminContext'

const StaffSales = () => {
  const { staffSales } = useAdmin()
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    customerName: '',
    startDate: '',
    endDate: '',
  })

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const filteredSales = staffSales.filter((sale) => {
    const { minPrice, maxPrice, customerName, startDate, endDate } = filters
    const saleDate = new Date(sale.createdAt).getTime()
    const saleAmount = sale.totalAmount

    // Ensure proper comparison for numbers and dates
    return (
      (minPrice === '' || saleAmount >= parseFloat(minPrice)) &&
      (maxPrice === '' || saleAmount <= parseFloat(maxPrice)) &&
      (customerName === '' || sale.customerName.toLowerCase().includes(customerName.toLowerCase())) &&
      (startDate === '' || saleDate >= new Date(startDate).getTime()) &&
      (endDate === '' || saleDate <= new Date(endDate).getTime())
    )
  })

  const totalSales = filteredSales.reduce((sum, item) => sum + item.totalAmount, 0)

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
              ₹{(totalSales / (filteredSales.length || 1)).toFixed(2)}
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
            value={filters.customerName}
            onChange={(e) => setFilters(prev => ({ ...prev, customerName: e.target.value }))}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Max"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => setFilters({
                minPrice: '',
                maxPrice: '',
                customerName: '',
                startDate: '',
                endDate: '',
              })}
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Recent Sales</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.paymentId?.slice(4) || sale._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{sale.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StaffSales
