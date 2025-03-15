import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStaff } from '../../context/StaffContext';
import Order from './Order';
import ProductList from './ProductList';
const StaffDashboard = () => {
  const {allProducts} = useAdmin();
  const { selectedProducts,setSelectedProducts} = useStaff();
  return (
    <div className="">
      {/* Products Grid */}
       <ProductList products={allProducts} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />
         
    </div>
  );
};

export default StaffDashboard;
