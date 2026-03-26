import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, Search, Edit2, Trash2, Plus, Save, X, 
  TrendingUp, Hash, DollarSign, AlertCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// 1. ප්‍රථමයෙන් Styles Define කරන්න (Hoisting Error මගහැරීමට)
const styles = {
  container: { padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  headerTitle: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', margin: 0, color: '#1e293b' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#2563eb', color: 'white', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '25px' },
  statCard: { display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  iconContainer: { padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '10px' },
  statLabel: { fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' },
  statValue: { fontSize: '20px', color: '#1e293b', fontWeight: 'bold' },
  alertBar: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', marginBottom: '20px', color: '#9a3412' },
  viewLowBtn: { background: '#ea580c', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' },
  searchBar: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', padding: '12px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' },
  searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '15px' },
  tableContainer: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' },
  tableStyle: { width: '100%', borderCollapse: 'collapse' },
  thRow: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  th: { textAlign: 'left', padding: '15px 20px', fontSize: '13px', color: '#64748b', fontWeight: 'bold' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '15px 20px', fontSize: '14px' },
  stockBadge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px' },
  editBtn: { color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', padding: '5px' },
  delBtn: { color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', padding: '5px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zBy: 1000 },
  modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '450px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  labelStyle: { fontSize: '13px', fontWeight: 'bold', color: '#475569' },
  inputStyle: { padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' },
  saveBtnStyle: { width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '8px' }
};

// 2. Reusable StatCard Component
const StatCard = ({ icon, label, value, borderColor = '#e2e8f0' }) => (
  <div style={{...styles.statCard, borderLeft: `4px solid ${borderColor}`}}>
    <div style={styles.iconContainer}>{icon}</div>
    <div>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  </div>
);

// 3. Main Inventory Component
const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ 
    category: '', type: '', size: '', 
    cost: '', retail: '', wholesale: '', stock: ''
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('studioInventory')) || [];
    setInventory(data);
  }, []);

  const deleteItem = (id) => {
    if (window.confirm("මෙම භාණ්ඩය ඉවත් කිරීමට ඔබට සහතිකද?")) {
      const updated = inventory.filter(item => item.id !== id);
      setInventory(updated);
      localStorage.setItem('studioInventory', JSON.stringify(updated));
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData({
      category: item.category || '',
      type: item.type || '',
      size: item.size || '',
      cost: item.costPrice || 0,
      retail: item.retailPrice || 0,
      wholesale: item.wholesalePrice || 0, 
      stock: item.stock || 0
    });
  };

  const handleUpdate = () => {
    const updatedInv = inventory.map(item => {
      if (item.id === editingId) {
        return {
          ...item,
          costPrice: parseFloat(editData.cost) || 0,
          retailPrice: parseFloat(editData.retail) || 0,
          wholesalePrice: parseFloat(editData.wholesale) || 0, 
          stock: editData.stock.toString()
        };
      }
      return item;
    });

    setInventory(updatedInv);
    localStorage.setItem('studioInventory', JSON.stringify(updatedInv));
    setEditingId(null);
    alert("තොග විස්තර සාර්ථකව යාවත්කාලීන කරන ලදී!");
  };

  const filtered = useMemo(() => {
    return inventory.filter(i => 
      (i.type || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      (i.category || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

  const stats = useMemo(() => {
    return filtered.reduce((acc, curr) => {
      const stock = parseInt(curr.stock) || 0;
      const cost = Number(curr.costPrice) || 0;
      const retail = Number(curr.retailPrice) || 0;
      const wholesale = Number(curr.wholesalePrice) || 0;

      acc.totalStock += stock;
      acc.retailProfit += (retail - cost) * stock;
      acc.wholesaleProfit += (wholesale - cost) * stock;
      if (stock <= 5) acc.lowStockCount += 1;
      
      return acc;
    }, { totalStock: 0, retailProfit: 0, wholesaleProfit: 0, lowStockCount: 0 });
  }, [filtered]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>
          <Package color="#2563eb" size={28}/> Studio Inventory
        </h2>
        <Link to="/add-item" style={styles.addBtn}><Plus size={18}/> Add Item</Link>
      </div>

      <div style={styles.statsGrid}>
        <StatCard icon={<Hash color="#64748b"/>} label="TOTAL STOCK" value={stats.totalStock} />
        <StatCard icon={<TrendingUp color="#16a34a"/>} label="EST. RETAIL PROFIT" value={`Rs.${stats.retailProfit.toLocaleString()}`} borderColor="#22c55e" />
        <StatCard icon={<DollarSign color="#2563eb"/>} label="EST. WHOLESALE PROFIT" value={`Rs.${stats.wholesaleProfit.toLocaleString()}`} borderColor="#3b82f6" />
      </div>

      {stats.lowStockCount > 0 && (
        <div style={styles.alertBar}>
          <AlertCircle size={20} color="#ea580c" />
          <span style={{flex: 1}}><b>අවධානය:</b> භාණ්ඩ {stats.lowStockCount} ක තොග අවසන් වෙමින් පවතී.</span>
          <button style={styles.viewLowBtn}>View List</button>
        </div>
      )}

      <div style={styles.searchBar}>
        <Search size={18} color="#94a3b8" />
        <input style={styles.searchInput} placeholder="සොයන්න..." onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.tableStyle}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>Product Details</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Cost</th>
              <th style={styles.th}>Retail Profit</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const stockNum = parseInt(item.stock) || 0;
              const cost = Number(item.costPrice) || 0;
              const rProfit = (Number(item.retailPrice) || 0) - cost;
              return (
                <tr key={item.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={{fontWeight: 'bold', color: '#1e293b'}}>{item.type}</div>
                    <div style={{fontSize: '11px', color: '#64748b'}}>{item.category} | {item.size}</div>
                  </td>
                  <td style={styles.td}>
                    <div style={{...styles.stockBadge, background: stockNum <= 5 ? '#fef2f2' : '#f0f9ff', color: stockNum <= 5 ? '#ef4444' : '#0369a1', border: stockNum <= 5 ? '1px solid #fee2e2' : '1px solid #e0f2fe'}}>
                      {stockNum}
                    </div>
                  </td>
                  <td style={styles.td}>Rs.{cost.toLocaleString()}</td>
                  <td style={{...styles.td, color: '#16a34a', fontWeight: 'bold'}}>Rs.{rProfit.toLocaleString()}</td>
                  <td style={styles.td}>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button onClick={() => startEdit(item)} style={styles.editBtn}><Edit2 size={16}/></button>
                      <button onClick={() => deleteItem(item.id)} style={styles.delBtn}><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editingId && (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
               <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                 <h3 style={{margin:0}}>Update Stock & Price</h3>
                 <button onClick={() => setEditingId(null)} style={{border:'none', background:'none', cursor:'pointer'}}><X/></button>
               </div>
               <div style={styles.formGrid}>
                 <div style={styles.inputGroup}>
                   <label style={styles.labelStyle}>Buying Cost (Rs.)</label>
                   <input style={styles.inputStyle} type="number" value={editData.cost} onChange={e => setEditData({...editData, cost: e.target.value})} />
                 </div>
                 <div style={styles.inputGroup}>
                   <label style={styles.labelStyle}>Retail Price (Rs.)</label>
                   <input style={styles.inputStyle} type="number" value={editData.retail} onChange={e => setEditData({...editData, retail: e.target.value})} />
                 </div>
                 <div style={styles.inputGroup}>
                   <label style={styles.labelStyle}>Stock Count</label>
                   <input style={styles.inputStyle} type="number" value={editData.stock} onChange={e => setEditData({...editData, stock: e.target.value})} />
                 </div>
               </div>
               <button onClick={handleUpdate} style={styles.saveBtnStyle}><Save size={18}/> Update Inventory</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;