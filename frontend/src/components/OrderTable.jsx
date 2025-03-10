import React from 'react';
const OrderTable = ({ selectedProducts }) => (
  <div className="overflow-x-auto">
   {selectedProducts.length === 0 ? <h1 className='m-2 p-2 bg-green-100 text-center rounded-lg'>No Products Added</h1> :( <table className="w-full text-center">
      <thead className="border-b-2">
        <tr>
          <th className="p-2">S.No</th>
          <th className="p-2">Name</th>
          <th className="p-2">Price</th>
          <th className="p-2">Quantity</th>
        </tr>
      </thead>
      <tbody>
        {selectedProducts.map((product, idx) => (
          <tr key={product._id} className="border-b">
            <td className="p-2">{idx + 1}.</td>
            <td className="p-2">{product.productName}</td>
            <td className="p-2">₹{product.productPrice}</td>
            <td className="p-2">{product.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>)}
  </div>
);
export default OrderTable;