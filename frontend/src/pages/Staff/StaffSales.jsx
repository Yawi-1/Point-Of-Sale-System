import React from 'react'
import { useAdmin } from '../../context/AdminContext'
import RecentSalesTable from '../../components/RecentSalesTable';
const StaffSales = () => {
  const {staffSales} = useAdmin();
 const totalSales = staffSales.reduce((sum,item)=> sum + item.totalAmount,0)
  return (
    <div className="space-y-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Sales Management</h1>
        <p className="text-gray-500">Manage and track all sales transactions</p>
      </div>
    </div>
     
    {/* Sales Summary */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="text-2xl font-semibold text-gray-800">${totalSales.toFixed(2)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Transactions</h3>
          <p className="text-2xl font-semibold text-gray-800">{staffSales.length}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Average Sale</h3>
          <p className="text-2xl font-semibold text-gray-800">
            ${(totalSales / (staffSales.length || 1)).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
    
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
            {staffSales && staffSales?.map((sale) => (
              <tr key={sale._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {sale.paymentId.startsWith('pi') ? sale.paymentId.slice(3):paymentId}
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