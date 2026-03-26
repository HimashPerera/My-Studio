import React, { useState } from 'react';
import { 
  X, BarChart3, ChevronRight, Calendar, Users, Package, FileText 
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ComprehensiveBusinessManager = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [pdfPreview, setPdfPreview] = useState(null);

  // LocalStorage හරහා දත්ත ලබා ගැනීම
  const [data] = useState({
    inventory: JSON.parse(localStorage.getItem('studioInventory')) || [],
    orders: JSON.parse(localStorage.getItem('studioOrders')) || [],
  });

  const excludedIds = ['85207', '85015', '84167'];

  // --- Helper: ලාභය ගණනය කිරීම ---
  const calculateOrderProfit = (order, inventory) => {
    const revenue = Number(order.totalPrice || 0);
    const netRevenue = revenue - Number(order.discount || 0);
    const type = (order.priceType || 'Retail').trim();

    const item = inventory.find(i => 
      String(i.type || "").trim().toLowerCase() === String(order.frameType || "").trim().toLowerCase() && 
      String(i.size || "").trim().toLowerCase() === String(order.size || "").trim().toLowerCase()
    );

    let cost = order.actualCost ? Number(order.actualCost) : (item ? Number(item.costPrice || 0) : (revenue * 0.5));
    return { netRevenue, cost, profit: netRevenue - cost, type, customer: order.customerName || 'N/A' };
  };

  const runReport = {
    // 1. BUSINESS PROFIT REPORT
    profitAndLoss: () => {
      const monthlyOrders = data.orders.filter(o => 
        o.dueDate?.startsWith(selectedMonth) && 
        !excludedIds.some(id => o.id?.toString().includes(id))
      );
      
      let sum = { retail: { cost: 0, net: 0, profit: 0, count: 0 }, wholesale: { cost: 0, net: 0, profit: 0, count: 0 } };

      const tableRows = monthlyOrders.map(o => {
        const p = calculateOrderProfit(o, data.inventory);
        const key = p.type === 'Wholesale' ? 'wholesale' : 'retail';
        sum[key].cost += p.cost; sum[key].net += p.netRevenue; sum[key].profit += p.profit; sum[key].count += 1;
        return [o.dueDate, o.id?.toString().slice(-6), p.customer, p.type, `Rs.${p.cost.toLocaleString()}`, `Rs.${p.netRevenue.toLocaleString()}`, `Rs.${p.profit.toLocaleString()}`];
      });

      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFillColor(15, 23, 42); doc.rect(0, 0, 210, 35, 'F');
      doc.setTextColor(255, 255, 255); doc.setFontSize(18); doc.text("GIFTY VIBE - PROFIT ANALYSIS", 14, 15);
      doc.setFontSize(9); doc.text(`MONTH: ${selectedMonth} | GENERATED: ${new Date().toLocaleString()}`, 14, 22);

      autoTable(doc, {
        startY: 40,
        head: [["Category", "Orders", "Total Cost", "Total Revenue", "Net Profit"]],
        body: [
          ["Retail Sales", sum.retail.count, `Rs.${sum.retail.cost.toLocaleString()}`, `Rs.${sum.retail.net.toLocaleString()}`, `Rs.${sum.retail.profit.toLocaleString()}`],
          ["Wholesale Sales", sum.wholesale.count, `Rs.${sum.wholesale.cost.toLocaleString()}`, `Rs.${sum.wholesale.net.toLocaleString()}`, `Rs.${sum.wholesale.profit.toLocaleString()}`],
          ["GRAND TOTAL", sum.retail.count + sum.wholesale.count, `Rs.${(sum.retail.cost + sum.wholesale.cost).toLocaleString()}`, `Rs.${(sum.retail.net + sum.wholesale.net).toLocaleString()}`, `Rs.${(sum.retail.profit + sum.wholesale.profit).toLocaleString()}`]
        ],
        theme: 'grid', headStyles: { fillColor: [51, 65, 85] }
      });

      autoTable(doc, { startY: doc.lastAutoTable.finalY + 10, head: [["Date", "ID", "Customer", "Type", "Cost", "Revenue", "Profit"]], body: tableRows, theme: 'striped', styles: { fontSize: 8 } });
      setPdfPreview({ url: doc.output('bloburl'), name: `Profit_Report_${selectedMonth}.pdf` });
    },

    // 2. CUSTOMER INSIGHTS REPORT
    customerInsights: () => {
      const customerMap = {};
      let totalRev = 0;

      data.orders.forEach(o => {
        const name = o.customerName || 'Unknown';
        if (!customerMap[name]) customerMap[name] = { name, phone: o.phone || 'N/A', orderCount: 0, totalSpent: 0, lastOrder: o.dueDate };
        customerMap[name].orderCount += 1;
        const amt = Number(o.totalPrice || 0);
        customerMap[name].totalSpent += amt;
        totalRev += amt;
        if (new Date(o.dueDate) > new Date(customerMap[name].lastOrder)) customerMap[name].lastOrder = o.dueDate;
      });

      const sorted = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFillColor(67, 56, 202); doc.rect(0, 0, 210, 35, 'F');
      doc.setTextColor(255, 255, 255); doc.setFontSize(18); doc.text("GIFTY VIBE - CUSTOMER REPORT", 14, 15);
      
      autoTable(doc, {
        startY: 40,
        head: [["Metric", "Value"]],
        body: [
          ["Total Customers", sorted.length.toString()],
          ["Top Customer", `${sorted[0]?.name || 'N/A'} (Rs.${sorted[0]?.totalSpent.toLocaleString()})`],
          ["Average Revenue/Customer", `Rs.${(totalRev / (sorted.length || 1)).toLocaleString(undefined, {maximumFractionDigits: 0})}`]
        ],
        theme: 'grid', headStyles: { fillColor: [99, 102, 241] }
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Customer Name", "Phone", "Orders", "Total Spent", "Last Seen"]],
        body: sorted.map(c => [c.name, c.phone, c.orderCount, `Rs.${c.totalSpent.toLocaleString()}`, c.lastOrder]),
        theme: 'striped'
      });
      setPdfPreview({ url: doc.output('bloburl'), name: `Customer_Report.pdf` });
    },

    // 3. PRODUCT & INVENTORY REPORT
    productInventory: () => {
      const inventory = data.inventory;
      const totalStockVal = inventory.reduce((acc, i) => acc + (Number(i.costPrice || 0) * Number(i.stock || 0)), 0);

      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFillColor(20, 184, 166); doc.rect(0, 0, 210, 35, 'F');
      doc.setTextColor(255, 255, 255); doc.setFontSize(18); doc.text("GIFTY VIBE - INVENTORY REPORT", 14, 15);

      autoTable(doc, {
        startY: 40,
        head: [["Metric", "Value"]],
        body: [
          ["Total Unique Products", inventory.length.toString()],
          ["Total Inventory Value (Cost)", `Rs.${totalStockVal.toLocaleString()}`],
          ["Low Stock Alerts (<5)", inventory.filter(i => Number(i.stock || 0) < 5).length.toString()]
        ],
        theme: 'grid', headStyles: { fillColor: [13, 148, 136] }
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Item Type", "Size", "Cost Price", "Retail Price", "Wholesale", "Stock"]],
        body: inventory.map(i => [i.type, i.size, `Rs.${i.costPrice}`, `Rs.${i.retailPrice}`, `Rs.${i.wholesalePrice}`, i.stock]),
        theme: 'striped',
        didParseCell: (d) => { if (d.column.index === 5 && parseInt(d.cell.raw) < 5) d.cell.styles.textColor = [220, 38, 38]; }
      });
      setPdfPreview({ url: doc.output('bloburl'), name: `Inventory_Report.pdf` });
    },

    // 4. OUTSTANDING REPORT (New)
    outstandingPayments: () => {
      const pendingOrders = data.orders.filter(o => {
        const bal = Number(o.totalPrice || 0) - Number(o.advancePay || 0);
        return bal > 0;
      });

      let totalOut = 0;
      const rows = pendingOrders.map(o => {
        const bal = Number(o.totalPrice || 0) - Number(o.advancePay || 0);
        totalOut += bal;
        return [o.dueDate, o.id?.toString().slice(-6), o.customerName || 'N/A', o.phone || 'N/A', `Rs.${Number(o.totalPrice).toLocaleString()}`, `Rs.${Number(o.advancePay).toLocaleString()}`, `Rs.${bal.toLocaleString()}`];
      });

      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFillColor(220, 38, 38); doc.rect(0, 0, 210, 35, 'F');
      doc.setTextColor(255, 255, 255); doc.setFontSize(18); doc.text("GIFTY VIBE - OUTSTANDING REPORT", 14, 15);

      autoTable(doc, {
        startY: 40,
        head: [["Metric", "Value"]],
        body: [
          ["Total Pending Orders", pendingOrders.length.toString()],
          ["Total Outstanding Amount", `Rs.${totalOut.toLocaleString()}`]
        ],
        theme: 'grid', headStyles: { fillColor: [185, 28, 28] }
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Due Date", "ID", "Customer", "Phone", "Total", "Paid", "Balance"]],
        body: rows,
        theme: 'striped',
        columnStyles: { 6: { fontStyle: 'bold' } }
      });
      setPdfPreview({ url: doc.output('bloburl'), name: `Outstanding_Report.pdf` });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topNav}>
        <div><h1 style={styles.mainTitle}>Gifty Vibe Analytics</h1><p style={styles.subTitle}>Business Management Suite</p></div>
        <div style={styles.datePickerWrapper}>
          <Calendar size={18} color="#64748b" />
          <input type="month" style={styles.dateInput} value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)} />
        </div>
      </div>

      <div style={styles.actionGrid}>
        <ReportCard icon={<BarChart3 color="#10b981"/>} title="Monthly Profit" desc="Retail vs Wholesale analysis" onClick={runReport.profitAndLoss} bgColor="#f0fdf4" />
        <ReportCard icon={<Users color="#3b82f6"/>} title="Customer Insights" desc="Spending and contact history" onClick={runReport.customerInsights} bgColor="#eff6ff" />
        <ReportCard icon={<Package color="#14b8a6"/>} title="Product & Stock" desc="Current inventory levels" onClick={runReport.productInventory} bgColor="#f0fdfa" />
        <ReportCard icon={<FileText color="#dc2626"/>} title="Outstanding Report" desc="Pending payments and collections" onClick={runReport.outstandingPayments} bgColor="#fef2f2" />
      </div>

      {pdfPreview && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <div style={styles.modalHeader}><span>{pdfPreview.name}</span><button onClick={() => setPdfPreview(null)} style={styles.closeBtn}><X size={20}/></button></div>
            <iframe src={pdfPreview.url} style={styles.pdfFrame} title="Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

const ReportCard = ({ icon, title, desc, onClick, bgColor }) => (
  <div style={styles.card} onClick={onClick}>
    <div style={{...styles.iconBox, background: bgColor}}>{icon}</div>
    <div style={{flex:1}}><div style={styles.cardTitle}>{title}</div><div style={styles.cardDesc}>{desc}</div></div>
    <ChevronRight size={18} color="#cbd5e1" />
  </div>
);

const styles = {
  container: { padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' },
  topNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  mainTitle: { fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 },
  subTitle: { color: '#64748b', fontSize: '14px' },
  datePickerWrapper: { display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' },
  dateInput: { border: 'none', fontWeight: '700', outline: 'none' },
  actionGrid: { display: 'flex', flexDirection: 'column', gap: '15px' },
  card: { background: 'white', padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  iconBox: { padding: '12px', borderRadius: '14px' },
  cardTitle: { fontWeight: '700', fontSize: '18px', color: '#1e293b' },
  cardDesc: { fontSize: '13px', color: '#64748b' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  modalContainer: { background: 'white', width: '90%', height: '90vh', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  modalHeader: { padding: '15px 25px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  pdfFrame: { width: '100%', flex: 1, border: 'none' },
  closeBtn: { background: '#fee2e2', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default ComprehensiveBusinessManager;