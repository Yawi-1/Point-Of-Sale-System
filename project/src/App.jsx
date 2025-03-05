import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Admin/Dashboard';
import Sales from './pages/Admin/Sales';
import Users from './pages/Admin/Users';
import Inventory from './pages/Admin/Inventory';
import Settings from './pages/Admin/Settings';
import History from './pages/Admin/History'
import Login from './pages/Login';
import StaffDashboard from './pages/Staff/StaffDashboard';
import StaffSales from './pages/Staff/StaffSales';
import StaffInventory from './pages/Staff/StaffInventory';
import StaffTopbar from './pages/Staff/StaffTopbar';
import StaffHistory from './pages/Staff/StaffHistory';

function App() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {user?.role === 'admin' && <Sidebar isOpen={isSidebarOpen} />}
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {user?.role  === 'admin' && <Topbar toggleSidebar={toggleSidebar} />}
        {user?.role === 'staff' && <StaffTopbar/>}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
            
            <Route element={<ProtectedRoute allowedRoles={['admin', 'staff']} />}>
              <Route path="/" element={user?.role === 'admin' ? <Dashboard /> : <StaffDashboard />} />
              <Route path="/sales" element={user?.role === 'admin' ? <Sales /> : <StaffSales />} />
              <Route path="/inventory" element={user?.role === 'admin' ? <Inventory /> : <StaffInventory />} />
              <Route path="/history" element={user?.role === 'admin' ? <History /> : <StaffHistory />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;