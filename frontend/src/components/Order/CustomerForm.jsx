import React from 'react';
const CustomerForm = ({ customer, handleChange }) => (
  <div className="space-y-2">
    <input
      type="text"
      placeholder="Customer Name"
      className="w-full p-2 border rounded-lg"
      name="name"
      value={customer.name}
      onChange={handleChange}
      required
    />
    <input
      type="email"
      placeholder="Email Address"
      className="w-full p-2 border rounded-lg"
      name="email"
      value={customer.email}
      onChange={handleChange}
      required
    />
    <input
      type="tel"
      placeholder="Phone Number"
      className="w-full p-2 border rounded-lg"
      name="phone"
      value={customer.phone}
      onChange={handleChange}
      required
    />
  </div>
);

export default CustomerForm;