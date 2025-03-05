import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'My POS Store',
    storeEmail: 'contact@myposstore.com',
    storePhone: '(555) 123-4567',
    storeAddress: '123 Main St, Anytown, USA',
    currency: 'USD',
    taxRate: 8.5,
  });

  const [receiptSettings, setReceiptSettings] = useState({
    showLogo: true,
    showTaxDetails: true,
    footerText: 'Thank you for your purchase!',
    printAutomatically: false,
    emailReceipt: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlert: true,
    lowStockThreshold: 10,
    salesSummary: true,
    newOrderNotification: true,
  });

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    });
  };

  const handleReceiptChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReceiptSettings({
      ...receiptSettings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNotificationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save the settings to a database or API
    console.log('Settings saved:', {
      generalSettings,
      receiptSettings,
      notificationSettings,
    });
    // Show a success message
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
        <p className="text-gray-500">Configure your POS system settings</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* General Settings */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">General Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={generalSettings.storeName}
                    onChange={handleGeneralChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Email
                  </label>
                  <input
                    type="email"
                    name="storeEmail"
                    value={generalSettings.storeEmail}
                    onChange={handleGeneralChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Phone
                  </label>
                  <input
                    type="text"
                    name="storePhone"
                    value={generalSettings.storePhone}
                    onChange={handleGeneralChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Address
                  </label>
                  <input
                    type="text"
                    name="storeAddress"
                    value={generalSettings.storeAddress}
                    onChange={handleGeneralChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={generalSettings.currency}
                    onChange={handleGeneralChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    name="taxRate"
                    value={generalSettings.taxRate}
                    onChange={handleGeneralChange}
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
            
            {/* Receipt Settings */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Receipt Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showLogo"
                    name="showLogo"
                    checked={receiptSettings.showLogo}
                    onChange={handleReceiptChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="showLogo" className="ml-2 block text-sm text-gray-700">
                    Show Logo on Receipt
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showTaxDetails"
                    name="showTaxDetails"
                    checked={receiptSettings.showTaxDetails}
                    onChange={handleReceiptChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="showTaxDetails" className="ml-2 block text-sm text-gray-700">
                    Show Tax Details
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="printAutomatically"
                    name="printAutomatically"
                    checked={receiptSettings.printAutomatically}
                    onChange={handleReceiptChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="printAutomatically" className="ml-2 block text-sm text-gray-700">
                    Print Automatically
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailReceipt"
                    name="emailReceipt"
                    checked={receiptSettings.emailReceipt}
                    onChange={handleReceiptChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="emailReceipt" className="ml-2 block text-sm text-gray-700">
                    Email Receipt to Customer
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receipt Footer Text
                  </label>
                  <textarea
                    name="footerText"
                    value={receiptSettings.footerText}
                    onChange={handleReceiptChange}
                    rows="2"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Notification Settings */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Notification Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lowStockAlert"
                    name="lowStockAlert"
                    checked={notificationSettings.lowStockAlert}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="lowStockAlert" className="ml-2 block text-sm text-gray-700">
                    Low Stock Alerts
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    value={notificationSettings.lowStockThreshold}
                    onChange={handleNotificationChange}
                    min="1"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="salesSummary"
                    name="salesSummary"
                    checked={notificationSettings.salesSummary}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="salesSummary" className="ml-2 block text-sm text-gray-700">
                    Daily Sales Summary
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newOrderNotification"
                    name="newOrderNotification"
                    checked={notificationSettings.newOrderNotification}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="newOrderNotification" className="ml-2 block text-sm text-gray-700">
                    New Order Notifications
                  </label>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaSave className="mr-2" />
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;