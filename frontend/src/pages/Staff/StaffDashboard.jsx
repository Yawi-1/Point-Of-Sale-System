import React from 'react';

const StaffDashboard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Products Grid */}
      <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Available Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 cursor-pointer">
              <div className="h-32 bg-gray-300 rounded mb-2"></div>
              <h3 className="font-semibold">Product {item}</h3>
              <p className="text-gray-600">$9.99</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Current Order</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            No items in cart
          </div>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Customer Name"
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>$0.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
