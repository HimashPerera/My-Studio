import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, List, Plus, Trash2, Layers, Package, Hash, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AddItem = () => {
  const navigate = useNavigate();
  
  // --- දත්ත ලැයිස්තු ---
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('studioCategories')) || ["Frames", "Albums"]);
  const [sizes, setSizes] = useState(() => JSON.parse(localStorage.getItem('studioSizes')) || ["4x6", "8x12"]);
  const [names, setNames] = useState(() => JSON.parse(localStorage.getItem('studioNames')) || ["Teak Frame"]);

  const [activeManage, setActiveManage] = useState(null); 
  const [newVal, setNewVal] = useState("");

  // Input States
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [size, setSize] = useState('');
  const [cost, setCost] = useState('');
  const [retail, setRetail] = useState('');
  const [wholesale, setWholesale] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    localStorage.setItem('studioCategories', JSON.stringify(categories));
    localStorage.setItem('studioSizes', JSON.stringify(sizes));
    localStorage.setItem('studioNames', JSON.stringify(names));
  }, [categories, sizes, names]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!category || !type || !size) return alert("කරුණාකර සියලු විස්තර තෝරන්න.");

    const currentInv = JSON.parse(localStorage.getItem('studioInventory')) || [];
    const newItem = {
      id: Date.now(),
      category, type, size,
      costPrice: parseFloat(cost) || 0,
      retailPrice: parseFloat(retail) || 0,
      wholesalePrice: parseFloat(wholesale) || 0,
      stockCount: parseInt(stock) || 0,
      addedDate: new Date().toLocaleDateString()
    };

    localStorage.setItem('studioInventory', JSON.stringify([...currentInv, newItem]));
    alert("සාර්ථකයි!");
    navigate('/inventory');
  };

  // Manager එකේදී අලුත් එකක් ඇතුළත් කළ විට එය ස්වයංක්‍රීයව Dropdown එකට Select වේ
  const addItemToList = (list, setList, val, setSelect) => {
    if (val.trim()) {
      const updatedList = [...list, val.trim()];
      setList(updatedList);
      setSelect(val.trim()); // අලුත් අගය වහාම Select වේ
      setNewVal("");
      setActiveManage(null); // Manager එක වැසී යයි
    }
  };

  const Manager = ({ title, list, setList, setSelect }) => (
    <div style={manageBox}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Manage {title}</span>
        <X size={14} onClick={() => setActiveManage(null)} style={{ cursor: 'pointer' }} />
      </div>
      <div style={miniForm}>
        <input 
          style={miniInput} 
          placeholder={`Add ${title}...`} 
          value={newVal} 
          onChange={e => setNewVal(e.target.value)}
          autoFocus 
        />
        <button type="button" onClick={() => addItemToList(list, setList, newVal, setSelect)} style={miniAdd}>
          <Plus size={16}/>
        </button>
      </div>
      <div style={listArea}>
        {list.map((val, i) => (
          <div key={i} style={listItem}>
            <span onClick={() => { setSelect(val); setActiveManage(null); }} style={{ cursor: 'pointer', flex: 1 }}>{val}</span>
            <Trash2 size={13} color="#f43f5e" onClick={() => setList(list.filter(x => x !== val))} style={{cursor: 'pointer'}}/>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={containerS}>
      <div style={headerS}>
        <h1 style={titleS}><PlusCircle color="#2563eb" size={28} /> Add Item</h1>
        <Link to="/inventory" style={backBtnS}>← Inventory</Link>
      </div>

      <div style={cardS}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={gridS}>
            {/* Category */}
            <div style={inputGroup}>
              <div style={labelRow}>
                <label style={labelStyle}><List size={14}/> Category</label>
                <button type="button" onClick={() => setActiveManage(activeManage === 'cat' ? null : 'cat')} style={editBtn}>+ New</button>
              </div>
              {activeManage === 'cat' ? 
                <Manager title="Category" list={categories} setList={setCategories} setSelect={setCategory} /> : 
                <select style={inputS} value={category} onChange={e => setCategory(e.target.value)} required>
                  <option value="">Select Category</option>
                  {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
              }
            </div>

            {/* Name */}
            <div style={inputGroup}>
              <div style={labelRow}>
                <label style={labelStyle}><Package size={14}/> Name</label>
                <button type="button" onClick={() => setActiveManage(activeManage === 'name' ? null : 'name')} style={editBtn}>+ New</button>
              </div>
              {activeManage === 'name' ? 
                <Manager title="Name" list={names} setList={setNames} setSelect={setType} /> : 
                <select style={inputS} value={type} onChange={e => setType(e.target.value)} required>
                  <option value="">Select Name</option>
                  {names.map((n, i) => <option key={i} value={n}>{n}</option>)}
                </select>
              }
            </div>
          </div>

          <div style={gridS}>
            {/* Size */}
            <div style={inputGroup}>
              <div style={labelRow}>
                <label style={labelStyle}><Layers size={14}/> Size</label>
                <button type="button" onClick={() => setActiveManage(activeManage === 'size' ? null : 'size')} style={editBtn}>+ New</button>
              </div>
              {activeManage === 'size' ? 
                <Manager title="Size" list={sizes} setList={setSizes} setSelect={setSize} /> : 
                <select style={inputS} value={size} onChange={e => setSize(e.target.value)} required>
                  <option value="">Select Size</option>
                  {sizes.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
              }
            </div>
            
            <div style={inputGroup}>
              <label style={labelStyle}><Hash size={14}/> Stock</label>
              <input type="number" style={inputS} value={stock} onChange={e => setStock(e.target.value)} required placeholder="0" />
            </div>
          </div>

          <div style={priceContainer}>
              <div style={priceGridS}>
                <div style={inputGroup}><label style={miniLabel}>Cost (Rs.)</label>
                <input type="number" style={inputS} value={cost} onChange={e => setCost(e.target.value)} required /></div>
                
                <div style={inputGroup}><label style={miniLabel}>Wholesale</label>
                <input type="number" style={inputS} value={wholesale} onChange={e => setWholesale(e.target.value)} required /></div>

                <div style={inputGroup}><label style={miniLabel}>Retail</label>
                <input type="number" style={inputS} value={retail} onChange={e => setRetail(e.target.value)} required /></div>
              </div>
          </div>

          <button type="submit" style={saveBtnS}>
            <Save size={20} /> Add to Inventory
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Styles (පෙර පරිදිම වේ) ---
const containerS = { padding: '20px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' };
const headerS = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const titleS = { fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' };
const backBtnS = { textDecoration: 'none', color: '#64748b', background: '#f1f5f9', padding: '8px 15px', borderRadius: '10px', fontSize: '13px' };
const cardS = { background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' };
const gridS = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px' };
const labelRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#475569' };
const inputS = { padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' };
const editBtn = { background: '#3b82f615', border: 'none', color: '#2563eb', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', padding: '4px 8px', borderRadius: '5px' };
const priceContainer = { padding: '15px', background: '#f8fafc', borderRadius: '15px', border: '1px solid #e2e8f0' };
const priceGridS = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' };
const miniLabel = { fontSize: '11px', color: '#64748b', marginBottom: '3px' };
const saveBtnS = { background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', padding: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' };
const manageBox = { padding: '12px', background: '#f1f5f9', borderRadius: '12px', border: '1px solid #e2e8f0' };
const miniForm = { display: 'flex', gap: '5px', marginBottom: '8px' };
const miniInput = { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' };
const miniAdd = { background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', width: '40px', cursor: 'pointer' };
const listArea = { maxHeight: '100px', overflowY: 'auto', background: 'white', borderRadius: '8px' };
const listItem = { display: 'flex', justifyContent: 'space-between', padding: '8px 10px', fontSize: '13px', borderBottom: '1px solid #f1f5f9' };

export default AddItem;