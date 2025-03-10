import React from 'react';

const PaymentSuccess = ({ customer, products, totalAmount, onClose }) => {
  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="w-full h-screen fixed top-0 left-0 z-10 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">Receipt</h2>
          <p className="text-lg text-gray-600">Thank you for your purchase!</p>
        </div>

        {/* Customer Info */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Customer:</span>
            <span>{customer.name}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Email:</span>
            <span>{customer.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Phone:</span>
            <span>{customer.phone}</span>
          </div>
        </div>

        {/* Products Table */}
        <div className="mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left text-sm font-semibold py-2 px-4">Product</th>
                <th className="text-left text-sm font-semibold py-2 px-4">Price</th>
                <th className="text-left text-sm font-semibold py-2 px-4">Quantity</th>
                <th className="text-left text-sm font-semibold py-2 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 px-4">{product.productName}</td>
                  <td className="py-2 px-4">{`₹${product.productPrice}`}</td>
                  <td className="py-2 px-4">{product.quantity}</td>
                  <td className="py-2 px-4">{`₹${(product.productPrice * product.quantity).toFixed(2)}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between text-lg font-semibold mb-4">
          <span>Total Amount:</span>
          <span>{`₹${totalAmount.toFixed(2)}`}</span>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-green-500 px-6 py-2 rounded-full text-white hover:bg-green-600"
          >
            Continue Shopping
          </button>
          <button
            onClick={handlePrintReceipt}
            className="bg-blue-500 px-6 py-2 rounded-full text-white hover:bg-blue-600"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};


export default PaymentSuccess;
