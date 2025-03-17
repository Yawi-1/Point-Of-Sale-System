import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { FaShoppingCart, FaUsers, FaBoxes, FaRupeeSign } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import StatCard from '../../components/Elements/StatCard';
import { useAdmin } from '../../context/AdminContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { allSales, totalSales, allProducts } = useAdmin();
  const [categoryData, setCategoryData] = useState({ labels: [], data: [] });

  // Data for stats
  const stats = [
    { title: 'Total Sales', value: `${totalSales ? `₹${totalSales.toFixed(2)}` : 'Loading...'}`, icon: <FaRupeeSign size={24} />, color: 'bg-primary' },
    { title: 'Total Orders', value: `${allSales ? allSales.length : 'Loading...'}`, icon: <FaShoppingCart size={24} />, color: 'bg-secondary' },
    { title: 'Products', value: `${allProducts ? allProducts.length : 'Loading...'}`, icon: <FaBoxes size={24} />, color: 'bg-danger' },
  ];

  // Extract and group sales by category
  useEffect(() => {
    if (allSales && allSales.length > 0) {
      const categorySales = {};

      allSales.forEach(sale => {
        sale.products.forEach(product => {
          const category = product.productCategory;  // Extract the product category
          const amount = sale.totalAmount;  // Extract the total amount for the sale

          // Aggregate the sales by category
          if (categorySales[category]) {
            categorySales[category] += amount;
          } else {
            categorySales[category] = amount;
          }
        });
      });

      // Prepare the data for the pie chart
      const labels = Object.keys(categorySales);
      const data = Object.values(categorySales);

      setCategoryData({
        labels,
        data,
      });
    }
  }, [allSales]);

  // Data for the Pie chart (Sales by Category)
  const topProductsData = {
    labels: categoryData.labels,
    datasets: [
      {
        label: 'Sales by Category',
        data: categoryData.data,
        backgroundColor: [
          '#4F46E5',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Sample data for sales chart
  const salesChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Sales',
        data: [3500, 4200, 3800, 5100, 4800, 5500, 6000],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Sample data for monthly orders chart
  const monthlyOrdersData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Orders',
        data: [65, 78, 52, 91, 83, 106],
        backgroundColor: '#10B981',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome to your POS admin dashboard</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Sales Overview</h2>
          <Line 
            data={salesChartData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }} 
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Orders</h2>
          <Bar 
            data={monthlyOrdersData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }} 
          />
        </div>
      </div>
      
      {/* Sales by Category Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Sales by Category</h2>
          <div className="flex justify-center">
            <div style={{ width: '100%', maxWidth: '250px' }}>
              <Pie
                data={topProductsData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
