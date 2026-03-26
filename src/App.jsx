import React, { useState, useEffect } from 'react'; 
// BrowserRouter වෙනුවට HashRouter ලෙස වෙනස් කරන්න
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import Inventory from './components/Inventory'; 
import Settings from './components/Settings';
import Orders from './components/Orders';
import AddItem from './components/AddItem';
import Customers from './components/Customers'; 
import Reports from './components/Reports'; 
import Suppliers from './components/Suppliers'; 
import Login from './components/Login'; 

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Login තත්ත්වය පරීක්ෂා කිරීම
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('studioUser'));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // පරිශීලකයා Login වී නැතිනම් පෙන්විය යුතු දේ
  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return (
    // මෙහි දැන් Router ලෙස ක්‍රියා කරන්නේ HashRouter ය
    <Router>
      <div className="app-container" style={{ 
        display: 'flex', 
        minHeight: '100vh', 
        backgroundColor: '#f1f5f9',
        overflow: 'hidden'
      }}>
        
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} user={user} />

        <main style={{ 
          flex: 1, 
          height: '100vh', 
          overflowY: 'auto',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
          marginLeft: isMobile ? '0' : (isSidebarOpen ? '260px' : '70px'), 
          width: isMobile ? '100%' : (isSidebarOpen ? 'calc(100% - 260px)' : 'calc(100% - 70px)'),
          padding: isMobile ? '10px' : '20px',
          boxSizing: 'border-box'
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/customers" element={<Customers />} /> 
            <Route path="/reports" element={<Reports />} /> 
            <Route path="/suppliers" element={<Suppliers />} /> 
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;