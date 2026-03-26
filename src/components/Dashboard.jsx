import React, { useState, useMemo, useEffect } from 'react';
import { 
  Trash2, MessageCircle, DollarSign, Search, ClipboardList, 
  TrendingUp, Wallet, Crown, ShoppingBag, Briefcase, Package, Activity, Target,
  BarChart3, ArrowUpRight, Users, Star, Clock, ChevronRight, QrCode
} from 'lucide-react';

const GiftyVibeProSystem = () => {
  // --- Data States ---
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('studioOrders')) || [];
    } catch (e) { return []; }
  });

  const [inventory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('studioInventory')) || [];
    } catch(e) { return []; }
  });

  // --- UI & Filter States ---
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [showPinModal, setShowPinModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [modalAction, setModalAction] = useState(""); 
  const [pinInput, setPinInput] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [pendingStatus, setPendingStatus] = useState("");

  const SYSTEM_PIN = "1234";

  // Sync Data to LocalStorage
  useEffect(() => {
    localStorage.setItem('studioOrders', JSON.stringify(orders));
  }, [orders]);

  // --- Filtered Data Logic ---
  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o?.dueDate?.startsWith(selectedMonth) && 
      (o?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || o.id?.toString().includes(searchTerm))
    );
  }, [orders, selectedMonth, searchTerm]);

  // --- Advanced Analytics Engine ---
  const analytics = useMemo(() => {
    const stats = {
      total: { rev: 0, profit: 0, orders: filteredOrders.length, unpaid: 0 },
      wholesale: { rev: 0, profit: 0, orders: 0 },
      retail: { rev: 0, profit: 0, orders: 0 },
      custData: {}
    };

    filteredOrders.forEach(o => {
      const rev = Number(o.totalPrice) || 0;
      const bal = Number(o.balance) || 0;
      
      const item = inventory?.find(i => 
        String(i.type).trim().toLowerCase() === String(o.frameType).trim().toLowerCase() && 
        String(i.size).trim().toLowerCase() === String(o.size).trim().toLowerCase()
      );
      const cost = item ? (Number(item.costPrice || item.wholesalePrice) || 0) : 0;
      const prof = rev - cost;

      stats.total.rev += rev;
      stats.total.profit += prof;
      stats.total.unpaid += bal;

      if (o.priceType === 'Wholesale') {
        stats.wholesale.rev += rev;
        stats.wholesale.profit += prof;
        stats.wholesale.orders += 1;
      } else {
        stats.retail.rev += rev;
        stats.retail.profit += prof;
        stats.retail.orders += 1;
      }

      if (o.customerName) {
        if (!stats.custData[o.customerName]) {
          stats.custData[o.customerName] = { name: o.customerName, total: 0, count: 0 };
        }
        stats.custData[o.customerName].total += rev;
        stats.custData[o.customerName].count += 1;
      }
    });

    stats.topCustomers = Object.values(stats.custData)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return stats;
  }, [filteredOrders, inventory]);

  const handlePinAction = () => {
    if (pinInput !== SYSTEM_PIN) return alert("Invalid PIN!");
    let updatedOrders = [...orders];
    
    if (modalAction === "STATUS") {
      updatedOrders = orders.map(o => o.id === activeOrder.id ? { ...o, status: pendingStatus } : o);
    } else if (modalAction === "PAY") {
      updatedOrders = orders.map(o => o.id === activeOrder.id ? { 
        ...o, 
        advance: Number(o.advance) + Number(payAmount), 
        balance: Math.max(0, Number(o.balance) - Number(payAmount)) 
      } : o);
    } else if (modalAction === "DELETE") {
      updatedOrders = orders.filter(o => o.id !== activeOrder.id);
    }
    
    setOrders(updatedOrders);
    setShowPinModal(false); setPinInput(""); setPayAmount("");
  };

  return (
    <div style={styles.container}>
      {/* 1. Header / Navbar */}
      <nav style={styles.navbar}>
        <div>
          <h1 style={styles.navLogo}>GiftyVibe <span style={{color: '#6366f1'}}>Intelligence</span></h1>
          <div style={styles.breadcrumb}><Clock size={12}/> Last Analysis: Just now</div>
        </div>
        
        <div style={styles.navControls}>
          <div style={styles.searchContainer}>
            <Search size={18} color="#94a3b8" />
            <input 
              style={styles.searchBar} 
              placeholder="Search customers or IDs..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <input 
            type="month" 
            style={styles.monthPicker} 
            value={selectedMonth} 
            onChange={e => setSelectedMonth(e.target.value)} 
          />
          
          {/* NEW: Photo QR Button */}
          <a 
            href="https://cakehouse.free.nf/admin/login.php" 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.qrButton}
          >
            <QrCode size={18} />
            <span>Photo QR</span>
          </a>
        </div>
      </nav>

      <div style={styles.dashboardBody}>
        
        {/* 2. Global Performance KPIs */}
        <div style={styles.sectionTitle}>
          <BarChart3 size={18} color="#6366f1"/> <span>Monthly Performance Overview</span>
        </div>
        <div style={styles.mainGrid}>
          <StatCard label="Total Revenue" val={analytics.total.rev} icon={<DollarSign/>} col="#0ea5e9" trend="Gross Sales" />
          <StatCard label="Net Profit" val={analytics.total.profit} icon={<Target/>} col="#10b981" trend="After Costs" glow />
          <StatCard label="Outstanding" val={analytics.total.unpaid} icon={<Wallet/>} col="#f43f5e" trend="To Collect" />
          <StatCard label="Total Orders" val={analytics.total.orders} icon={<Package/>} col="#6366f1" isRaw trend="Order Count" />
        </div>

        {/* 3. Top Customer Rankings */}
        <div style={styles.sectionTitle}>
          <Star size={18} color="#f59e0b"/> <span>Top 5 High-Value Customers</span>
        </div>
        <div style={styles.customerGrid}>
          {analytics.topCustomers.map((c, i) => (
            <div key={i} style={styles.customerCard}>
              <div style={styles.rankBadge}>#{i+1}</div>
              <div style={styles.custAvatar}>{c.name[0]}</div>
              <div style={{flex: 1}}>
                <div style={styles.custName}>{c.name}</div>
                <div style={styles.custSubText}>{c.count} Orders this month</div>
              </div>
              <div style={styles.custValue}>Rs. {c.total.toLocaleString()}</div>
            </div>
          ))}
          {analytics.topCustomers.length === 0 && <p style={styles.emptyText}>No customer data for this period.</p>}
        </div>

        {/* 4. Segment Breakdown */}
        <div style={styles.splitRow}>
          <div style={styles.segmentBox}>
            <div style={{...styles.segmentHeader, borderLeft: '4px solid #f59e0b'}}>
              <Briefcase size={18} color="#f59e0b"/> <h3>Wholesale Division</h3>
            </div>
            <div style={styles.segmentStats}>
              <div style={styles.miniStat}><span>Sales</span> <strong>Rs. {analytics.wholesale.rev.toLocaleString()}</strong></div>
              <div style={styles.miniStat}><span>Profit</span> <strong style={{color: '#d97706'}}>Rs. {analytics.wholesale.profit.toLocaleString()}</strong></div>
              <div style={styles.miniStat}><span>Orders</span> <strong>{analytics.wholesale.orders}</strong></div>
            </div>
          </div>

          <div style={styles.segmentBox}>
            <div style={{...styles.segmentHeader, borderLeft: '4px solid #ec4899'}}>
              <ShoppingBag size={18} color="#ec4899"/> <h3>Retail Division</h3>
            </div>
            <div style={styles.segmentStats}>
              <div style={styles.miniStat}><span>Sales</span> <strong>Rs. {analytics.retail.rev.toLocaleString()}</strong></div>
              <div style={styles.miniStat}><span>Profit</span> <strong style={{color: '#be185d'}}>Rs. {analytics.retail.profit.toLocaleString()}</strong></div>
              <div style={styles.miniStat}><span>Orders</span> <strong>{analytics.retail.orders}</strong></div>
            </div>
          </div>
        </div>

        {/* 5. Transactions Table */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={{margin:0}}>Recent Activity Log</h3>
            <div style={styles.filterBadge}>{filteredOrders.length} Transactions Found</div>
          </div>
          <div style={{overflowX: 'auto'}}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Item/Size</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Due Balance</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Operations</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(o => (
                  <tr key={o.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.tableCust}>
                        <div style={styles.smallAvatar}>{o.customerName[0]}</div>
                        <div>
                          <strong>{o.customerName}</strong>
                          <div style={{fontSize: '10px', color: '#94a3b8'}}>Order ID: {o.id.toString().slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>{o.frameType} <br/> <small>{o.size}</small></td>
                    <td style={styles.td}>
                      <span style={{...styles.typeLabel, background: o.priceType === 'Wholesale' ? '#fef3c7' : '#fce7f3', color: o.priceType === 'Wholesale' ? '#92400e' : '#9d174d'}}>
                        {o.priceType}
                      </span>
                    </td>
                    <td style={{...styles.td, fontWeight: 'bold', color: o.balance > 0 ? '#ef4444' : '#10b981'}}>
                      Rs. {o.balance.toLocaleString()}
                    </td>
                    <td style={styles.td}>
                      <select 
                        style={{...styles.statusDropdown, color: o.status === 'Delivered' ? '#059669' : '#d97706'}}
                        value={o.status} 
                        onChange={(e) => { setActiveOrder(o); setPendingStatus(e.target.value); setModalAction("STATUS"); setShowPinModal(true); }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Ready</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.btnGroup}>
                        <button style={styles.iconBtn} onClick={() => window.open(`https://wa.me/94${o.phone}`)} title="WhatsApp"><MessageCircle size={14}/></button>
                        <button style={styles.iconBtn} onClick={() => { setActiveOrder(o); setModalAction("PAY"); setPayAmount(o.balance); setShowPinModal(true); }} title="Add Payment"><DollarSign size={14}/></button>
                        <button style={{...styles.iconBtn, color: '#f43f5e'}} onClick={() => { setActiveOrder(o); setModalAction("DELETE"); setShowPinModal(true); }} title="Remove"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Security PIN Modal */}
      {showPinModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalIcon}><Activity/></div>
            <h3>Verify Identity</h3>
            <p style={{fontSize: '13px', color: '#64748b'}}>Action: <b>{modalAction}</b></p>
            {modalAction === "PAY" && (
              <input type="number" placeholder="Payment Amount (Rs.)" style={styles.modalInput} value={payAmount} onChange={e => setPayAmount(e.target.value)} />
            )}
            <input type="password" placeholder="Enter System PIN" style={styles.modalInput} value={pinInput} onChange={e => setPinInput(e.target.value)} />
            <div style={styles.modalBtns}>
              <button onClick={() => setShowPinModal(false)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handlePinAction} style={styles.confirmBtn}>Execute</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, val, icon, col, glow, isRaw, trend }) => (
  <div style={{...styles.statCard, boxShadow: glow ? `0 10px 25px ${col}30` : '0 1px 3px rgba(0,0,0,0.1)'}}>
    <div style={styles.statTop}>
      <div style={{...styles.iconBox, background: `${col}15`, color: col}}>{icon}</div>
      <div style={styles.trendText}><ArrowUpRight size={10}/> {trend}</div>
    </div>
    <div style={styles.statLabel}>{label}</div>
    <div style={styles.statValue}>{isRaw ? val : `Rs. ${val.toLocaleString()}`}</div>
  </div>
);

const styles = {
  container: { background: '#f8fafc', minHeight: '100vh', fontFamily: '"Inter", sans-serif' },
  navbar: { 
    background: '#fff', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', 
    alignItems: 'center', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 
  },
  navLogo: { fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: 0 },
  breadcrumb: { fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' },
  navControls: { display: 'flex', gap: '15px', alignItems: 'center' },
  qrButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600',
    transition: '0.3s',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
  },
  searchContainer: { display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '0 12px', borderRadius: '10px', width: '220px' },
  searchBar: { border: 'none', background: 'transparent', padding: '10px', outline: 'none', width: '100%', fontSize: '13px' },
  monthPicker: { border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px', fontSize: '13px', outline: 'none', cursor: 'pointer' },
  dashboardBody: { maxWidth: '1200px', margin: '30px auto', padding: '0 20px' },
  sectionTitle: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '600', color: '#475569', margin: '25px 0 15px 0' },
  mainGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
  statCard: { background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9', transition: '0.3s' },
  statTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  iconBox: { padding: '8px', borderRadius: '10px' },
  trendText: { fontSize: '10px', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px' },
  statLabel: { fontSize: '12px', color: '#64748b', marginBottom: '4px' },
  statValue: { fontSize: '22px', fontWeight: '800', color: '#1e293b' },
  customerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' },
  customerCard: { 
    background: '#fff', padding: '15px', borderRadius: '16px', border: '1px solid #f1f5f9', 
    display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' 
  },
  rankBadge: { 
    position: 'absolute', top: '-8px', right: '10px', background: '#6366f1', color: '#fff', 
    fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '6px' 
  },
  custAvatar: { width: '38px', height: '38px', borderRadius: '12px', background: '#f1f5f9', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  custName: { fontSize: '13px', fontWeight: '700', color: '#1e293b' },
  custSubText: { fontSize: '11px', color: '#94a3b8' },
  custValue: { fontSize: '13px', fontWeight: '800', color: '#10b981' },
  splitRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '30px 0' },
  segmentBox: { background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' },
  segmentHeader: { padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '10px', background: '#fafafa' },
  segmentStats: { padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' },
  miniStat: { display: 'flex', flexDirection: 'column', fontSize: '12px' },
  tableCard: { background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', marginBottom: '50px' },
  tableHeader: { padding: '20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' },
  filterBadge: { padding: '4px 12px', background: '#f1f5f9', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '15px 20px', background: '#f8fafc', textAlign: 'left', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '15px 20px', fontSize: '13px', borderBottom: '1px solid #f1f5f9' },
  tableCust: { display: 'flex', alignItems: 'center', gap: '10px' },
  smallAvatar: { width: '28px', height: '28px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' },
  typeLabel: { padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' },
  statusDropdown: { border: 'none', background: 'transparent', fontWeight: '700', fontSize: '12px', cursor: 'pointer', outline: 'none' },
  btnGroup: { display: 'flex', gap: '5px' },
  iconBtn: { padding: '6px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', transition: '0.2s' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200 },
  modal: { background: '#fff', padding: '30px', borderRadius: '24px', width: '320px', textAlign: 'center' },
  modalIcon: { color: '#ef4444', marginBottom: '15px' },
  modalInput: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '15px', textAlign: 'center', boxSizing: 'border-box', outline: 'none' },
  modalBtns: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  cancelBtn: { padding: '12px', border: 'none', borderRadius: '12px', background: '#f1f5f9', fontWeight: '600', cursor: 'pointer' },
  confirmBtn: { padding: '12px', border: 'none', borderRadius: '12px', background: '#1e293b', color: '#fff', fontWeight: '600', cursor: 'pointer' },
  emptyText: { color: '#94a3b8', padding: '20px', fontSize: '13px', textAlign: 'center' }
};

export default GiftyVibeProSystem;