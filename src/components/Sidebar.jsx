import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, 
  Settings, LogOut, Menu, X, PlusCircle, ClipboardList, 
  Users, BarChart3, Truck 
} from 'lucide-react';

// 1. Your Logo Image Import
import logoImg from '../assets/gifty.png'; 

const Sidebar = ({ isOpen, setIsOpen, user }) => {
  const location = useLocation();
  const [storeName, setStoreName] = useState("GiftyVibe");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    const savedSettings = localStorage.getItem('studioSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.name) setStoreName(parsed.name);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 1024;

  const handleLogout = () => {
    if (window.confirm("ඔබට පද්ධතියෙන් ඉවත් වීමට අවශ්‍යද?")) {
      localStorage.removeItem('studioUser');
      window.location.reload();
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/orders', icon: <ClipboardList size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <Package size={20} /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { name: 'Suppliers', path: '/suppliers', icon: <Truck size={20} /> }, 
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
    { name: 'New Item', path: '/add-item', icon: <PlusCircle size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      <style>{`
        .sidebar-nav::-webkit-scrollbar { width: 0px; }
        .nav-item:hover { background: rgba(59, 130, 246, 0.1) !important; color: #3b82f6 !important; }
        .active-item { box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
      `}</style>

      {isMobile && !isOpen && (
        <button className="no-print" onClick={() => setIsOpen(true)} style={mobileMenuBtn}>
          <Menu size={24} />
        </button>
      )}

      <aside className="no-print" style={{
          ...sidebarStyle,
          width: isOpen ? '260px' : (isMobile ? '0px' : '80px'),
          left: (isMobile && !isOpen) ? '-260px' : '0',
          zIndex: 2100,
        }}>
        
        {/* LOGO SECTION - Updated to show Image Logo */}
        <div style={toggleSection}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
            <img 
              src={logoImg} 
              alt="Logo" 
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '8px', 
                objectFit: 'contain',
                background: '#fff',
                padding: '2px'
              }} 
            />
            {isOpen && <span style={logoText}>{storeName}</span>}
          </div>
          {!isMobile && (
            <button onClick={() => setIsOpen(!isOpen)} style={toggleBtn}>
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
          {isMobile && isOpen && (
             <button onClick={() => setIsOpen(false)} style={toggleBtn}><X size={20}/></button>
          )}
        </div>

        {/* MENU ITEMS */}
        <nav className="sidebar-nav" style={navStyle}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={isActive ? "active-item" : "nav-item"}
                onClick={() => isMobile && setIsOpen(false)}
                style={{ 
                  ...navLinkStyle,
                  background: isActive ? '#3b82f6' : 'transparent',
                  color: isActive ? 'white' : '#94a3b8',
                  padding: (isOpen || isMobile) ? '12px 15px' : '12px 0',
                  justifyContent: (isOpen || isMobile) ? 'flex-start' : 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: (isOpen || isMobile) ? '30px' : '100%' }}>
                    {item.icon}
                </div>
                {(isOpen || isMobile) && <span style={{ marginLeft: '10px', fontSize: '14px', fontWeight: '500' }}>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* PROFILE & LOGOUT */}
        <div style={{ marginTop: 'auto' }}>
            <div style={{
                ...profileSection,
                padding: (isOpen || isMobile) ? '15px 20px' : '15px 10px',
                justifyContent: (isOpen || isMobile) ? 'flex-start' : 'center'
            }}>
            <img 
                src={user?.photo || "https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff"} 
                alt="User" 
                style={avatarStyle} 
            />
            {(isOpen || isMobile) && (
                <div style={{ marginLeft: '12px', overflow: 'hidden' }}>
                <p style={userName}>{user?.name || "Admin User"}</p>
                <p style={userRole}>{user?.role || "Manager"}</p>
                </div>
            )}
            </div>

            <div style={logoutSection}>
            <button 
                onClick={handleLogout}
                style={{...logoutBtn, justifyContent: (isOpen || isMobile) ? 'flex-start' : 'center'}}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: (isOpen || isMobile) ? '30px' : '100%' }}>
                <LogOut size={18} />
                </div>
                {(isOpen || isMobile) && <span style={{ marginLeft: '10px', fontSize: '14px' }}>Logout</span>}
            </button>
            </div>
        </div>
      </aside>

      {isMobile && isOpen && (
        <div onClick={() => setIsOpen(false)} style={overlayStyle} className="no-print" />
      )}
    </>
  );
};

// --- STYLES ---
const sidebarStyle = { height: '100vh', background: '#0f172a', color: 'white', position: 'fixed', top: 0, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1e293b' };
const mobileMenuBtn = { position: 'fixed', top: '15px', left: '15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 999, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' };
const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 2000 };
const toggleSection = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #1e293b', minHeight: '80px' };
const logoText = { fontWeight: '700', fontSize: '18px', color: 'white', letterSpacing: '0.5px' };
const toggleBtn = { background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex' };
const navStyle = { flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' };
const navLinkStyle = { display: 'flex', alignItems: 'center', textDecoration: 'none', borderRadius: '12px', transition: '0.3s all' };
const profileSection = { display: 'flex', alignItems: 'center', borderTop: '1px solid #1e293b', background: 'rgba(30, 41, 59, 0.5)' };
const avatarStyle = { width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #3b82f6' };
const userName = { fontSize: '14px', fontWeight: '600', color: 'white', margin: 0 };
const userRole = { fontSize: '11px', color: '#64748b', margin: 0 };
const logoutSection = { padding: '15px 12px', borderTop: '1px solid #1e293b' };
const logoutBtn = { width: '100%', background: 'transparent', border: 'none', color: '#f87171', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '12px 15px', borderRadius: '12px', transition: '0.2s' };

export default Sidebar;