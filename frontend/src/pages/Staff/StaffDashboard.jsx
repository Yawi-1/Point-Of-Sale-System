import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStaff } from '../../context/StaffContext';
import Order from './Order';
import ProductList from './ProductList';
const StaffDashboard = () => {
  const {allProducts} = useAdmin();
  const { selectedProducts,totalAmount, setSelectedProducts,handleCheckOut} = useStaff();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Products Grid */}
       <ProductList products={allProducts} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />
         {/* Order Summary  */}
         <Order total = {totalAmount} handleCheckOut={handleCheckOut} selectedProducts={selectedProducts}/>
         
    </div>
  );
};

export default StaffDashboard;
