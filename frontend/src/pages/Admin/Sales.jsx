import React, { useState } from 'react';
import RecentSalesTable from '../../components/Tables/RecentSalesTable';
import {useAdmin} from '../../context/AdminContext'

const Sales = () => {
  const {allSales,totalSales} = useAdmin();

  // Calculate total sales
 

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
            <p className="text-2xl font-semibold text-gray-800">₹{totalSales.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Transactions</h3>
            <p className="text-2xl font-semibold text-gray-800">{allSales.length}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Average Sale</h3>
            <p className="text-2xl font-semibold text-gray-800">
            ₹{(totalSales / (allSales.length || 1)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Sales Table */}
      <RecentSalesTable allSales={allSales} />
    </div>
  );
};

export default Sales;