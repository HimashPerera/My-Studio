import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Trash2, Package, Printer, X } from 'lucide-react';

const ProfessionalPOS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [cashReceived, setCashReceived] = useState("");
  const [isPayModal, setIsPayModal] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('studioInventory')) || [];
    setProducts(data);

    // Dropdown එකෙන් පිටත ක්ලික් කළ විට එය වැසීමට
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addToCart = (product) => {
    const inCart = cart.find(item => item.id === product.id);
    if (inCart) {
      setCart(cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...product, price: parseFloat(product.retailPrice), qty: 1 }]);
    }
    setSearchTerm("");
    setShowDropdown(false);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((a, b) => a + (b.price * b.qty), 0);
  const balance = parseFloat(cashReceived || 0) - total;

  const handlePrint = useCallback(() => {
    if (cart.length === 0 || parseFloat(cashReceived) < total) {
      alert("Please enter valid cash amount");
      return;
    }
    
    window.print();
    
    // මුද්‍රණයෙන් පසු දත්ත Reset කිරීම
    setCart([]);
    setCashReceived("");
    setIsPayModal(false);
  }, [cart, cashReceived, total]);

  return (
    <div style={styles.appWrapper}>
      <style>{`
        @media screen { .receipt-box { display: none; } }
        @media print {
          .no-print { display: none !important; }
          .receipt-box { 
            display: block !important; 
            width: 72mm; 
            font-family: 'Courier New', Courier, monospace; 
            font-size: 12px; 
            padding: 4mm;
            background: white;
            color: #000;
          }
          @page { size: 80mm auto; margin: 0; }
          .flex-sb { display: flex; justify-content: space-between; }
          .line { border-top: 1px dashed #000; margin: 5px 0; }
        }
      `}</style>

      {/* --- Screen Interface --- */}
      <div className="no-print" style={styles.mainGrid}>
        
        {/* Left Side: Cart & Payment */}
        <div style={styles.salePanel}>
          <div style={styles.panelHeader}>
            <h2 style={{margin:0, fontSize:'20px'}}>Gifty Vibe POS</h2>
          </div>
          
          <div style={styles.cartArea}>
            {cart.length === 0 ? <p style={{textAlign:'center', color:'#888'}}>Cart is empty</p> : 
              cart.map(item => (
                <div key={item.id} style={styles.cartItem}>
                  <div>
                    <div style={{fontWeight:'bold'}}>{item.type}</div>
                    <small>{item.qty} x Rs.{item.price}</small>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <b>Rs.{item.price * item.qty}</b>
                    <Trash2 size={16} color="red" cursor="pointer" onClick={() => removeFromCart(item.id)} />
                  </div>
                </div>
              ))
            }
          </div>

          <div style={styles.footer}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
              <span style={{fontSize:'18px'}}>Total:</span>
              <b style={{fontSize:'22px'}}>Rs.{total.toFixed(2)}</b>
            </div>
            <button 
              style={{...styles.payBtn, opacity: cart.length > 0 ? 1 : 0.5}} 
              disabled={cart.length === 0}
              onClick={() => setIsPayModal(true)}
            >
              PAY NOW
            </button>
          </div>
        </div>

        {/* Right Side: Searchable Dropdown & Inventory */}
        <div style={styles.inventory}>
          <div style={{position:'relative'}} ref={dropdownRef}>
            <div style={styles.searchBox}>
              <Search size={20} color="#666" />
              <input 
                style={styles.input} 
                placeholder="Search products..." 
                value={searchTerm} 
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {setSearchTerm(e.target.value); setShowDropdown(true);}} 
              />
            </div>

            {/* --- Search Results Dropdown --- */}
            {showDropdown && searchTerm && (
              <div style={styles.dropdown}>
                {products.filter(p => p.type.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? (
                  products.filter(p => p.type.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                    <div key={p.id} style={styles.dropdownItem} onClick={() => addToCart(p)}>
                      <span>{p.type}</span>
                      <small>Rs.{p.retailPrice} (Stock: {p.stock})</small>
                    </div>
                  ))
                ) : (
                  <div style={{padding:'10px', color:'#888'}}>No products found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Payment Modal --- */}
      {isPayModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <h3>Payment Confirmation</h3>
              <X cursor="pointer" onClick={() => setIsPayModal(false)} />
            </div>
            <div style={{fontSize:'24px', margin:'20px 0', fontWeight:'bold'}}>Total: Rs.{total.toFixed(2)}</div>
            
            <label style={{display:'block', marginBottom:'5px', textAlign:'left'}}>Customer Cash (Rs):</label>
            <input 
              style={styles.modalInput} 
              type="number" 
              value={cashReceived} 
              onChange={(e) => setCashReceived(e.target.value)} 
              placeholder="0.00" 
              autoFocus 
            />
            
            <div style={{fontSize:'20px', margin:'15px 0', color: balance >= 0 ? 'green' : 'red'}}>
              Change: Rs.{balance >= 0 ? balance.toFixed(2) : "0.00"}
            </div>

            <button 
              style={{...styles.printBtn, background: balance >= 0 ? '#22c55e' : '#ccc'}} 
              disabled={balance < 0}
              onClick={handlePrint}
            >
              PRINT RECEIPT
            </button>
          </div>
        </div>
      )}

      {/* --- 80MM THERMAL RECEIPT --- */}
      <div className="receipt-box">
        <div style={{textAlign:'center'}}>
          <h2 style={{margin:0}}>GIFTY VIBE STUDIO</h2>
          <p style={{fontSize:'10px', margin:0}}>Your City, Sri Lanka | 07X-XXXXXXX</p>
        </div>
        <div className="line" style={{marginTop:'10px'}}></div>
        <div className="flex-sb" style={{fontSize:'10px'}}>
          <span>Date: {new Date().toLocaleDateString()}</span>
          <span>Time: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="line"></div>
        <div style={{minHeight:'50px'}}>
          {cart.map(item => (
            <div key={item.id} style={{marginBottom:'5px'}}>
              <div className="flex-sb">
                <span>{item.type}</span>
                <span>{(item.price * item.qty).toFixed(2)}</span>
              </div>
              <div style={{fontSize:'10px'}}>{item.qty} x {item.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="line" style={{borderTopStyle:'double', borderWidth:'3px'}}></div>
        <div className="flex-sb" style={{fontWeight:'bold', fontSize:'14px'}}>
          <span>TOTAL:</span>
          <span>Rs.{total.toFixed(2)}</span>
        </div>
        <div className="flex-sb">
          <span>CASH:</span>
          <span>Rs.{parseFloat(cashReceived || 0).toFixed(2)}</span>
        </div>
        <div className="flex-sb" style={{fontWeight:'bold'}}>
          <span>CHANGE:</span>
          <span>Rs.{balance.toFixed(2)}</span>
        </div>
        <div className="line"></div>
        <p style={{textAlign:'center', fontSize:'10px'}}>Thank You! Come Again.</p>
        <div style={{textAlign:'center', fontSize:'24px', letterSpacing:'-2px'}}>|||||||||||||||||||||</div>
      </div>
    </div>
  );
};

const styles = {
  appWrapper: { height:'100vh', background:'#f8fafc', fontFamily:'sans-serif' },
  mainGrid: { display:'flex', height:'100%' },
  salePanel: { width:'400px', background:'#fff', borderRight:'1px solid #e2e8f0', display:'flex', flexDirection:'column', boxShadow:'2px 0 5px rgba(0,0,0,0.05)' },
  panelHeader: { padding:'20px', background:'#0f172a', color:'#fff' },
  cartArea: { flex:1, padding:'20px', overflowY:'auto' },
  cartItem: { display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #f1f5f9' },
  footer: { padding:'20px', background:'#f8fafc', borderTop:'1px solid #e2e8f0' },
  payBtn: { width:'100%', padding:'15px', background:'#22c55e', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'16px' },
  inventory: { flex:1, padding:'30px' },
  searchBox: { display:'flex', alignItems:'center', background:'#fff', padding:'15px', borderRadius:'10px', border:'2px solid #e2e8f0' },
  input: { border:'none', marginLeft:'12px', outline:'none', width:'100%', fontSize:'16px' },
  dropdown: { position:'absolute', top:'65px', left:0, right:0, background:'#fff', border:'1px solid #e2e8f0', borderRadius:'10px', boxShadow:'0 10px 15px rgba(0,0,0,0.1)', zIndex:100, maxHeight:'300px', overflowY:'auto' },
  dropdownItem: { padding:'12px 20px', borderBottom:'1px solid #f1f5f9', cursor:'pointer', display:'flex', flexDirection:'column', hover: {background:'#f8fafc'} },
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 },
  modal: { background:'#fff', padding:'30px', borderRadius:'20px', width:'350px', textAlign:'center' },
  modalInput: { width:'100%', padding:'12px', fontSize:'20px', textAlign:'center', borderRadius:'8px', border:'1px solid #cbd5e1', marginBottom:'10px' },
  printBtn: { width:'100%', padding:'15px', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', marginTop:'10px' }
};

export default ProfessionalPOS;