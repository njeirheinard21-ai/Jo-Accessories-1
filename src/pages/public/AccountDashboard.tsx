import { useState, useEffect } from 'react';
import { orderService, Order } from '../../services/orderService';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { authService } from '../../services/authService';
import { Package, Heart, Clock, Settings, LogOut, FileText, HelpCircle, Shield, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductCard } from '../../components/ProductCard';

export function AccountDashboard() {
  const user = useAuthStore((state: any) => state.user);
  const userRole = useAuthStore((state: any) => state.userRole);
  const isStaff = userRole && ['admin', 'super_admin', 'store_owner', 'inventory_manager', 'order_manager', 'marketing_manager', 'customer_support'].includes(userRole);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const wishlistItems = useWishlistStore(state => state.items);
  
  useEffect(() => {
    if (user && activeTab === 'orders') {
      orderService.getUserOrders(user.uid).then(data => {
        setOrders(data);
        setLoadingOrders(false);
      }).catch(err => {
        console.error(err);
        setLoadingOrders(false);
      });
    }
  }, [user, activeTab]);

  const tabs = [
    { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-4 h-4" /> },
    { id: 'recently_viewed', label: 'Recently Viewed', icon: <Clock className="w-4 h-4" /> },
    { id: 'warranty', label: 'Warranty & Repairs', icon: <Shield className="w-4 h-4" /> },
    { id: 'rewards', label: 'Jo Rewards', icon: <Award className="w-4 h-4" /> },
    { id: 'support', label: 'Support', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row gap-12">
      <div className="w-full md:w-64 shrink-0">
        <h1 className="text-2xl font-serif mb-8 uppercase tracking-widest text-ash">My Account</h1>
        <div className="mb-8">
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-ash-muted mb-1">Welcome</p>
          <p className="text-sm font-sans font-medium text-ash">{user.displayName || user.email}</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 text-left px-4 py-3 text-xs uppercase tracking-widest transition-colors ${activeTab === tab.id ? 'bg-ash text-white font-semibold' : 'text-ash-muted hover:text-ash hover:bg-white'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          {isStaff && (
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-3 text-left px-4 py-3 text-xs uppercase tracking-widest text-ash-muted hover:text-ash hover:bg-white transition-colors mt-4 border-t border-ash-light"
            >
              <FileText className="w-4 h-4" />
              Admin Portal
            </button>
          )}
          <button 
            onClick={() => authService.logout()}
            className="flex items-center gap-3 text-left px-4 py-3 text-xs uppercase tracking-widest text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </nav>
      </div>
      
      <div className="flex-1 bg-white border border-ash-light p-8 md:p-12 min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-serif uppercase tracking-widest mb-8 border-b border-ash-light pb-4">{tabs.find(t => t.id === activeTab)?.label}</h2>
            

            {activeTab === 'orders' && (
              loadingOrders ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-2 border-ash border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="w-12 h-12 text-ash/20 mx-auto mb-6" strokeWidth={1} />
                  <p className="text-2xl font-serif uppercase tracking-widest text-ash mb-4">No Purchase History</p>
                  <p className="text-ash-muted font-sans font-light text-sm max-w-sm mx-auto mb-10 leading-[1.8]">
                    You haven't made any purchases yet. Your future orders will be tracked here.
                  </p>
                  <button onClick={() => navigate('/shop')} className="border border-ash px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-ash hover:text-white luxury-transition outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2">Start Shopping</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="border border-ash-light p-6 flex flex-col md:flex-row justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-ash">Order #{order.id.slice(-6).toUpperCase()}</span>
                          <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 bg-white text-ash-muted">{order.status.replace(/_/g, ' ')}</span>
                        </div>
                        <p className="text-sm text-ash-muted mb-1">{new Date(order.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</p>
                        <p className="text-sm font-serif italic">${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="flex -space-x-4">
                          {order.items.slice(0, 3).map((item, i) => (
                            <img loading="lazy" decoding="async" key={i} src={item.image} alt="" className="w-12 h-12 rounded-full border-2 border-white object-cover bg-white" />
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-12 h-12 rounded-full border-2 border-white bg-white flex items-center justify-center text-xs text-ash-muted font-semibold z-10">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <button className="text-[10px] uppercase tracking-[0.2em] font-semibold underline underline-offset-4 hover:text-ash-muted transition-colors ml-4">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            
            {activeTab === 'wishlist' && (
              wishlistItems.length === 0 ? (
                <div className="text-center py-20">
                  <Heart className="w-12 h-12 text-ash/20 mx-auto mb-6" strokeWidth={1} />
                  <p className="text-2xl font-serif uppercase tracking-widest text-ash mb-4">No Saved Items</p>
                  <p className="text-ash-muted font-sans font-light text-sm max-w-sm mx-auto mb-10 leading-[1.8]">
                    You haven't saved any pieces yet. Curate your personal collection by adding items to your wishlist.
                  </p>
                  <button onClick={() => navigate('/shop')} className="border border-ash px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-ash hover:text-white luxury-transition outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2">Discover Pieces</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {wishlistItems.map(item => (
                    <ProductCard key={item.id} {...item} />
                  ))}
                </div>
              )
            )}
            
            {activeTab === 'warranty' && (
              <div className="max-w-2xl">
                <p className="text-sm text-ash-muted mb-6 font-light leading-relaxed">
                  All Jo Accessories pieces are crafted to the highest standards. We offer a complimentary 2-year warranty on all handbags and small leather goods covering manufacturing defects.
                </p>
                <button className="bg-ash text-white px-8 py-3 text-[10px] uppercase tracking-[0.2em] font-sans font-semibold hover:bg-ash/90 transition-colors">Register a Product</button>
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="text-center py-12 px-6 border border-ash-light bg-white">
                <Award className="w-12 h-12 text-ash mx-auto mb-4" strokeWidth={1} />
                <h3 className="text-xl font-serif uppercase tracking-widest mb-2">Inner Circle Status</h3>
                <p className="text-[10px] font-sans font-medium text-ash-muted uppercase tracking-[0.2em] mb-6">0 Points Balance</p>
                <p className="text-sm font-light text-ash-muted mb-8 max-w-md mx-auto">Earn points on every purchase and unlock exclusive access to private events, early collections, and complimentary services.</p>
                <button onClick={() => navigate('/shop')} className="bg-ash text-white px-8 py-3 text-[10px] uppercase tracking-[0.2em] font-sans font-semibold hover:bg-ash/90 transition-colors">Earn Points</button>
              </div>
            )}
            
            {['recently_viewed', 'support', 'settings'].includes(activeTab) && (
              <div className="text-center py-20">
                <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-ash-muted">Coming Soon</p>
              </div>
            )}
            
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
