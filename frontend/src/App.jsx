import React, { useState,useEffect } from 'react';
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
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
  const stripePromise = loadStripe("pk_test_51QOighF2m1LCsEM5wmfGo2q4TRiJrlgi5gnCJLh5OCQLo2wOmXNQ0xNqwRWvIOnWh0772BDo8BPz8xxmTFEZ3uk400x6mAKNcP");
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(()=>{
    if(user?.role === 'admin'){
      document.title = 'POS Admin Dashboard'
    } else if(user?.role === 'staff'){
      document.title = 'POS Staff Dashboard'
    }else{
      document.title = 'POS Login'
    }
  },[user?.role])

  return (
    <Elements stripe={stripePromise}>
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
              <Route path="/inventory" element={ <Inventory /> } />
              <Route path="/users" element={user?.role === 'admin' && <Users />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
    </Elements>
  );
}

export default App;