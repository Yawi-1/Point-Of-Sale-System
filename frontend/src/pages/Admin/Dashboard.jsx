import React from 'react';
import { 
  FaShoppingCart, 
  FaUsers, 
  FaBoxes, 
  FaDollarSign 
} from 'react-icons/fa';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import StatCard from '../../components/StatCard';
import RecentSalesTable from '../../components/RecentSalesTable';

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
  // Sample data for stats
  const stats = [
    { title: 'Total Sales', value: '$12,345', icon: <FaDollarSign size={24} />, color: 'bg-primary' },
    { title: 'Total Orders', value: '156', icon: <FaShoppingCart size={24} />, color: 'bg-secondary' },
    { title: 'Total Customers', value: '86', icon: <FaUsers size={24} />, color: 'bg-accent' },
    { title: 'Products', value: '120', icon: <FaBoxes size={24} />, color: 'bg-danger' },
  ];

  // Sample data for recent sales
  const recentSales = [
    { id: '1001', customer: 'John Doe', date: '2025-01-15', amount: 125.99, status: 'Completed' },
    { id: '1002', customer: 'Jane Smith', date: '2025-01-14', amount: 89.50, status: 'Completed' },
    { id: '1003', customer: 'Bob Johnson', date: '2025-01-14', amount: 45.25, status: 'Pending' },
    { id: '1004', customer: 'Alice Brown', date: '2025-01-13', amount: 210.75, status: 'Completed' },
    { id: '1005', customer: 'Charlie Wilson', date: '2025-01-12', amount: 65.00, status: 'Cancelled' },
  ];

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

  // Sample data for top products chart
  const topProductsData = {
    labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Toys'],
    datasets: [
      {
        label: 'Sales by Category',
        data: [35, 25, 20, 15, 5],
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <RecentSalesTable sales={recentSales} />
        </div>
        
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