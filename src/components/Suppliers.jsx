import React, { useState, useEffect } from 'react';
import { 
  Truck, Plus, Trash2, Phone, Building2, Search, 
  UserPlus, Edit3, Check, X, Mail
} from 'lucide-react';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(window.innerWidth > 768);
  const [formData, setFormData] = useState({ name: '', phone: '', company: '', email: '', category: 'General' });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('studioSuppliers')) || [];
    setSuppliers(saved);
    
    const handleResize = () => {
      if (window.innerWidth > 768) setIsFormOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveToLocal = (data) => {
    setSuppliers(data);
    localStorage.setItem('studioSuppliers', JSON.stringify(data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updated = suppliers.map(s => s.id === editingId ? { ...formData, id: editingId } : s);
      saveToLocal(updated);
      setEditingId(null);
    } else {
      const newList = [{ ...formData, id: Date.now() }, ...suppliers];
      saveToLocal(newList);
    }
    setFormData({ name: '', phone: '', company: '', email: '', category: 'General' });
    if (window.innerWidth <= 768) setIsFormOpen(false);
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Style Variables (Fixed) ---
  const containerStyle = { padding: '20px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' };
  const headerSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
  const mobileAddBtn = { background: '#2563eb', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)', cursor: 'pointer' };
  const contentGrid = { display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column', gap: '20px' };
  const formCard = { background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', width: window.innerWidth > 768 ? '350px' : '100%', height: 'fit-content', position: window.innerWidth > 768 ? 'sticky' : 'static', top: '20px' };
  const inputField = { width: '100%', padding: '12px 15px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', boxSizing: 'border-box' };
  const inputRow = { display: 'flex', gap: '10px', marginBottom: '15px' };
  const saveBtn = { flex: 1, padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' };
  const updateBtn = { ...saveBtn, background: '#f59e0b' };
  const cancelBtn = { padding: '12px 20px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' };
  const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' };
  const mobileItemCard = { background: 'white', padding: '18px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };

  return (
    <div style={containerStyle}>
      <div style={headerSection}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#eff6ff', p: '10px', borderRadius: '12px', display: 'flex', padding: 8 }}>
            <Truck size={24} color="#2563eb" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1e293b' }}>Suppliers</h2>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Manage your studio business vendors</p>
          </div>
        </div>
        <button onClick={() => setIsFormOpen(!isFormOpen)} style={mobileAddBtn}>
          {isFormOpen ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>

      <div style={contentGrid}>
        {isFormOpen && (
          <div style={formCard}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b' }}>
              {editingId ? <Edit3 size={20} color="#f59e0b" /> : <UserPlus size={20} color="#2563eb" />}
              {editingId ? "Edit Record" : "Add Supplier"}
            </h3>
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>Full Name</label>
              <input 
                placeholder="Ex: Sunimal Perera" required value={formData.name} style={inputField}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <label style={labelStyle}>Company / Brand</label>
              <input 
                placeholder="Ex: Fuji Printing" value={formData.company} style={inputField}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
              <div style={inputRow}>
                <div style={{flex:1}}>
                  <label style={labelStyle}>Phone</label>
                  <input 
                    placeholder="07XXXXXXXX" required value={formData.phone} style={{...inputField, marginBottom: 0}}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div style={{flex:1}}>
                  <label style={labelStyle}>Category</label>
                  <select 
                    style={{...inputField, marginBottom: 0}} value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="General">General</option>
                    <option value="Frames">Frames</option>
                    <option value="Printing">Printing</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={editingId ? updateBtn : saveBtn}>
                  {editingId ? "Update" : "Save Supplier"}
                </button>
                {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({ name: '', phone: '', company: '', email: '', category: 'General' });}} style={cancelBtn}>Cancel</button>}
              </div>
            </form>
          </div>
        )}

        <div style={{ flex: 1 }}>
          <div style={searchWrapper}>
            <Search size={20} color="#94a3b8" />
            <input 
              placeholder="Search by name or company..." 
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', marginLeft: '10px' }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={cardGrid}>
            {filteredSuppliers.map(s => (
              <div key={s.id} style={mobileItemCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: '#1e293b' }}>{s.name}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Building2 size={12}/> {s.company || 'Individual'} • <span style={{color:'#2563eb', fontWeight:'600'}}>{s.category}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => {setEditingId(s.id); setFormData(s); setIsFormOpen(true); window.scrollTo(0,0);}} style={iconBtn}><Edit3 size={16}/></button>
                    <button onClick={() => { if(window.confirm('Delete this supplier?')) saveToLocal(suppliers.filter(i => i.id !== s.id)) }} style={deleteBtn}><Trash2 size={16}/></button>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <a href={`tel:${s.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                    <Phone size={14}/> {s.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
          {filteredSuppliers.length === 0 && <div style={{textAlign:'center', padding:'50px', color:'#94a3b8'}}>No suppliers found.</div>}
        </div>
      </div>
    </div>
  );
};

// --- Missing Styles ---
const labelStyle = { fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '5px', display: 'block', textTransform: 'uppercase' };
const searchWrapper = { display: 'flex', alignItems: 'center', background: 'white', padding: '12px 18px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const iconBtn = { padding: '8px', background: '#fffbeb', color: '#d97706', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const deleteBtn = { padding: '8px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer' };

export default Suppliers;