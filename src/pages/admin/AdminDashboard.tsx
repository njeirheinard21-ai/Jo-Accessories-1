import { Activity, CreditCard, DollarSign, Users, Database, Package } from "lucide-react"
import { productService } from "../../services/productService"
import { useState, useEffect } from "react"
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore'
import { db } from "../../lib/firebase"
import { Order } from "../../services/orderService"
import { DataTable } from "../../features/admin/components/DataTable"

export function AdminDashboard() {
  const [seeding, setSeeding] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);

  useEffect(() => {
    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(10));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setRecentOrders(orders);
      
      let sales = 0;
      orders.forEach(o => {
        if (o.status !== 'cancelled') {
          sales += o.totalAmount;
        }
      });
      setTotalSales(sales);
      setOrderCount(orders.length);
    }, (error) => {
      console.warn("Live orders subscription failed (likely permissions):", error.message);
    });

    const qProducts = query(collection(db, 'products'), limit(100));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      setActiveProducts(snapshot.size);
    }, (error) => {
      console.warn("Live products subscription failed (likely permissions):", error.message);
    });

    return () => {
      unsubOrders();
      unsubProducts();
    };
  }, []);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await productService.seedDatabase();
      alert("Database seeded successfully!");
    } catch (err) {
      console.error(err);
      alert("Error seeding database");
    } finally {
      setSeeding(false);
    }
  };

  const columns = [
    { 
      header: 'Order ID', 
      accessor: (row: any) => <span className="font-sans font-medium uppercase tracking-widest text-[10px]">#{row.id.slice(0,8)}</span>,
    },
    { header: 'Customer', accessor: 'userId' },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`inline-flex items-center px-3 py-1 text-[9px] font-sans font-bold uppercase tracking-[0.2em] border ${
          row.status === 'paid' ? 'bg-green-50 border-green-200 text-green-900' : 
          row.status === 'processing' ? 'bg-yellow-50 border-yellow-200 text-yellow-900' :
          row.status === 'delivered' ? 'bg-ash border-ash text-white' :
          'bg-white border-ash-light text-ash'
        }`}>
          {(row.status || 'pending').replace('_', ' ')}
        </span>
      )
    },
    { 
      header: 'Total', 
      accessor: (row: any) => <span className="font-serif italic">${row.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>,
    }
  ]

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-ash-light">
        <h1 className="text-3xl font-serif tracking-tight uppercase">Overview</h1>
        <button 
          onClick={handleSeed}
          disabled={seeding}
          className="flex items-center gap-2 border border-ash text-ash px-6 py-3 text-[10px] font-sans font-bold uppercase tracking-[0.2em] hover:bg-ash hover:text-white disabled:opacity-50 transition-colors outline-none"
        >
          <Database className="w-3 h-3" />
          {seeding ? 'Syncing...' : 'Sync Database'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 border border-ash-light flex flex-col justify-between aspect-square">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-ash-muted">Total Revenue</h3>
            <DollarSign className="w-4 h-4 text-white/60" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-4xl font-serif tracking-tight mb-2">${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <p className="text-[10px] font-sans uppercase tracking-widest text-green-600">Live Sync</p>
          </div>
        </div>
        
        <div className="bg-white p-8 border border-ash-light flex flex-col justify-between aspect-square">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-ash-muted">Recent Sales</h3>
            <CreditCard className="w-4 h-4 text-white/60" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-4xl font-serif tracking-tight mb-2">+{orderCount}</p>
            <p className="text-[10px] font-sans uppercase tracking-widest text-ash-muted">Past 24H</p>
          </div>
        </div>
        
        <div className="bg-white p-8 border border-ash-light flex flex-col justify-between aspect-square">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-ash-muted">Active Products</h3>
            <Activity className="w-4 h-4 text-white/60" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-4xl font-serif tracking-tight mb-2">{activeProducts}</p>
            <p className="text-[10px] font-sans uppercase tracking-widest text-ash-muted">Inventory Status</p>
          </div>
        </div>
        
        <div className="bg-white p-8 border border-ash-light flex flex-col justify-between aspect-square">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-ash-muted">Active Clients</h3>
            <Users className="w-4 h-4 text-white/60" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-4xl font-serif tracking-tight mb-2">+1,234</p>
            <p className="text-[10px] font-sans uppercase tracking-widest text-green-600">+19% vs Last Month</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-6">
        <div className="col-span-2">
          <h3 className="text-[12px] font-sans font-bold uppercase tracking-[0.2em] mb-6">Recent Orders</h3>
          <div className="border border-ash-light p-1">
            <DataTable 
              data={recentOrders} 
              columns={columns} 
              searchPlaceholder="SEARCH ORDERS..."
            />
          </div>
        </div>
        <div>
          <h3 className="text-[12px] font-sans font-bold uppercase tracking-[0.2em] mb-6">Top Performing</h3>
          <div className="bg-[#FAFAFA] border border-ash-light p-8 min-h-[400px] flex items-center justify-center text-center">
            <div className="space-y-4">
              <Package className="w-8 h-8 text-white/60 mx-auto" strokeWidth={1} />
              <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-ash-muted">Awaiting Dataset</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
