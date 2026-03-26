import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Phone, Trash2, Search, ArrowLeft, Edit2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const Customers = () => {
  const [customers, setCustomers] = useState(() => 
    JSON.parse(localStorage.getItem('studioCustomers')) || [
      { id: 1, name: "Walk-in Customer", phone: "0000000000" }
    ]
  );

  const [newCust, setNewCust] = useState({ name: '', phone: '' });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null); // Edit කරන පාරිභෝගිකයා හඳුනා ගැනීමට

  useEffect(() => {
    localStorage.setItem('studioCustomers', JSON.stringify(customers));
  }, [customers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // විස්තර Update කිරීම
      setCustomers(customers.map(c => 
        c.id === editingId ? { ...c, name: newCust.name, phone: newCust.phone } : c
      ));
      setEditingId(null);
    } else {
      // අලුතින් එක් කිරීම
      setCustomers([...customers, { id: Date.now(), ...newCust }]);
    }
    setNewCust({ name: '', phone: '' });
  };

  const startEdit = (cust) => {
    setEditingId(cust.id);
    setNewCust({ name: cust.name, phone: cust.phone });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Form එක වෙත ස්ක්‍රෝල් කිරීම
  };

  const deleteCustomer = (id) => {
    if (window.confirm("Are you sure?")) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const filteredCustomers = customers.filter(c => 
    (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.phone || "").includes(searchTerm)
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}><Users color="#2563eb" /> Customers</h1>
        <Link to="/orders" style={backBtn}><ArrowLeft size={18} /> Orders</Link>
      </div>

      {/* Form Section */}
      <div style={{...cardStyle, border: editingId ? '2px solid #2563eb' : 'none'}}>
        <h3 style={sectionTitle}>
          {editingId ? <><Edit2 size={18} /> Update Customer</> : <><UserPlus size={18} /> Add New Customer</>}
        </h3>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Full Name</label>
            <input 
              style={inputStyle} 
              value={newCust.name}
              onChange={e => setNewCust({...newCust, name: e.target.value})}
              required 
            />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Phone Number</label>
            <input 
              style={inputStyle} 
              value={newCust.phone}
              onChange={e => setNewCust({...newCust, phone: e.target.value})}
              required 
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{...addBtnStyle, flex: 2, background: editingId ? '#10b981' : '#2563eb'}}>
              {editingId ? 'Update Details' : 'Save Customer'}
            </button>
            {editingId && (
              <button type="button" onClick={() => {setEditingId(null); setNewCust({name:'', phone:''});}} style={cancelBtn}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <div style={searchWrapper}>
        <Search size={18} color="#94a3b8" />
        <input style={searchInput} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <div style={listContainer}>
        {filteredCustomers.map(cust => (
          <div key={cust.id} style={custCard}>
            <div style={custInfo}>
              <div style={avatar}>{cust.name.charAt(0)}</div>
              <div>
                <h4 style={custName}>{cust.name}</h4>
                <p style={custPhone}><Phone size={12} /> {cust.phone}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={() => startEdit(cust)} style={editBtn}><Edit2 size={16} /></button>
              {cust.id !== 1 && (
                <button onClick={() => deleteCustomer(cust.id)} style={delBtn}><Trash2 size={16} /></button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Styles (පෙර පරිදිම, නව Edit බොත්තම් සමග) ---
const containerStyle = { padding: '15px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const titleStyle = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', margin: 0, color: '#1e293b' };
const backBtn = { textDecoration: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', fontWeight: 'bold' };
const cardStyle = { background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '25px', transition: '0.3s' };
const sectionTitle = { display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 15px 0', fontSize: '16px', color: '#334155' };
const formStyle = { display: 'grid', gap: '15px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px' };
const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '15px', outlineColor: '#2563eb' };
const addBtnStyle = { color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontWeight: 'bold', cursor: 'pointer' };
const cancelBtn = { flex: 1, background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const searchWrapper = { display: 'flex', alignItems: 'center', background: 'white', padding: '0 15px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '15px' };
const searchInput = { border: 'none', padding: '12px', width: '100%', outline: 'none', fontSize: '14px' };
const listContainer = { display: 'grid', gap: '10px' };
const custCard = { background: 'white', padding: '12px 15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f1f5f9' };
const custInfo = { display: 'flex', alignItems: 'center', gap: '12px' };
const avatar = { width: '40px', height: '40px', background: '#eff6ff', color: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' };
const custName = { margin: 0, fontSize: '15px', color: '#1e293b' };
const custPhone = { margin: '2px 0 0 0', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' };
const editBtn = { background: '#f0f9ff', border: 'none', color: '#0ea5e9', cursor: 'pointer', padding: '8px', borderRadius: '8px' };
const delBtn = { background: '#fff1f2', border: 'none', color: '#fca5a5', cursor: 'pointer', padding: '8px', borderRadius: '8px' };

export default Customers;