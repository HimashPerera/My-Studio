import React, { useState, useEffect } from 'react';
import { Store, User, Shield, Database, Save, Download, LogOut, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Store Profile');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // User සහ Store දත්ත ලබා ගැනීම
  const [user] = useState(() => JSON.parse(localStorage.getItem('studioUser')));
  const [storeConfig, setStoreConfig] = useState(() => {
    const saved = localStorage.getItem('studioSettings');
    return saved ? JSON.parse(saved) : { name: "Gifty Vibe Studio", address: "Maho, Sri Lanka", phone: "0712345678" };
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Store Profile සුරැකීම
  const handleSaveSettings = () => {
    localStorage.setItem('studioSettings', JSON.stringify(storeConfig));
    alert("සාර්ථකයි! ආයතනයේ තොරතුරු සුරැකුණා.");
    window.location.reload(); 
  };

  // 2. Backup බාගත කිරීම (Download All Data)
  const handleDownloadBackup = () => {
    const allData = {
      orders: JSON.parse(localStorage.getItem('studioOrders') || '[]'),
      inventory: JSON.parse(localStorage.getItem('studioInventory') || '[]'),
      customers: JSON.parse(localStorage.getItem('studioCustomers') || '[]'),
      settings: storeConfig,
      backupDate: new Date().toLocaleString()
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GiftyVibe_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 3. Reset System (පද්ධතිය මුල සිට ආරම්භ කිරීම)
  const handleResetSystem = () => {
    if (window.confirm("අවධානයයි! ඔබගේ සියලුම දත්ත (Orders/Inventory) මැකී යනු ඇත. මෙය ස්ථිරද?")) {
      const backupBeforeDelete = window.confirm("මකා දැමීමට පෙර Backup එකක් ලබා ගත්තාද?");
      if (backupBeforeDelete) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  return (
    <div style={{ padding: isMobile ? '10px' : '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '5px', fontSize: isMobile ? '24px' : '32px' }}>Settings</h1>
      
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', marginTop: '20px' }}>
        
        {/* Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '10px', overflowX: isMobile ? 'auto' : 'visible', minWidth: isMobile ? '100%' : '250px' }}>
          {[
            { id: 'Store Profile', icon: <Store size={18} /> },
            { id: 'User Management', icon: <User size={18} /> },
            { id: 'Security', icon: <Shield size={18} /> },
            { id: 'Backup & Reset', icon: <Database size={18} /> }
          ].map((item) => (
            <div key={item.id} onClick={() => setActiveTab(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px',
                background: activeTab === item.id ? '#3b82f6' : 'white', color: activeTab === item.id ? 'white' : '#1e293b',
                borderRadius: '12px', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', flex: isMobile ? '0 0 auto' : 'none'
              }}>
              {item.icon} <span style={{ fontWeight: '600', fontSize: '14px' }}>{item.id}</span>
            </div>
          ))}
        </div>

        {/* Content Section */}
        <div style={{ background: 'white', padding: isMobile ? '20px' : '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', flex: 1 }}>
          
          {/* Store Profile */}
          {activeTab === 'Store Profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ marginTop: 0 }}>Store Profile</h3>
              <label style={labelS}>Shop Name</label>
              <input style={inputS} value={storeConfig.name} onChange={(e) => setStoreConfig({...storeConfig, name: e.target.value})} />
              <label style={labelS}>Address</label>
              <input style={inputS} value={storeConfig.address} onChange={(e) => setStoreConfig({...storeConfig, address: e.target.value})} />
              <button onClick={handleSaveSettings} style={saveBtn}><Save size={18} /> Save Changes</button>
            </div>
          )}

          {/* User Management */}
          {activeTab === 'User Management' && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ textAlign: 'left', marginTop: 0 }}>My Account</h3>
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px', marginTop: '15px' }}>
                <img src={user?.photo || "https://ui-avatars.com/api/?name=Admin"} style={{ width: '80px', borderRadius: '50%', border: '3px solid #3b82f6' }} alt="user" />
                <h4 style={{ margin: '10px 0 0' }}>{user?.name || "Aakash Deva"}</h4>
                <p style={{ fontSize: '13px', color: '#64748b' }}>{user?.email || "No Email Linked"}</p>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'Security' && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ marginTop: 0 }}>Account Security</h3>
                <div style={{ padding: '15px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                   <p style={{ margin: 0, fontWeight: 'bold' }}>Google Login Active</p>
                   <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#64748b' }}>පද්ධතියට ආරක්ෂිතව පිවිසී ඇත.</p>
                </div>
                <button onClick={() => { localStorage.removeItem('studioUser'); window.location.reload(); }} style={{ ...saveBtn, background: '#fee2e2', color: '#ef4444' }}>
                   <LogOut size={18} /> Sign Out
                </button>
             </div>
          )}

          {/* Backup & Reset */}
          {activeTab === 'Backup & Reset' && (
            <div style={{ textAlign: 'center' }}>
              <Database size={50} color="#3b82f6" style={{ marginBottom: '15px' }} />
              <h3>Data Management</h3>
              <p style={{ color: '#64748b', fontSize: '13px' }}>ඔබේ පද්ධතියේ සියලුම දත්ත JSON ගොනුවක් ලෙස සුරැකීමට බාගත කරන්න.</p>
              <button onClick={handleDownloadBackup} style={{ ...saveBtn, background: '#10b981', marginTop: '10px' }}>
                <Download size={18} /> Download Full Backup
              </button>
              
              <div style={{ marginTop: '40px', padding: '20px', border: '1px dashed #ef4444', borderRadius: '15px' }}>
                <AlertTriangle color="#ef4444" size={30} style={{ marginBottom: '10px' }} />
                <p style={{ fontSize: '12px', color: '#ef4444' }}>අවවාදයයි: පද්ධතිය Reset කළහොත් සියලු දත්ත මැකී යනු ඇත.</p>
                <button onClick={handleResetSystem} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>Reset System Data</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const labelS = { fontSize: '13px', fontWeight: 'bold', color: '#475569' };
const inputS = { padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' };
const saveBtn = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', width: '100%' };

export default Settings;