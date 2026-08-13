import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { mockProducts } from '../../data/mockProducts';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotals } = useCartStore();
  const { total, count } = getTotals();
  
  const FREE_SHIPPING_THRESHOLD = 5000;
  const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - total, 0);

  // Recommendations logic
  const recommendations = mockProducts
    .filter(p => !items.find(i => i.id === p.id))
    .slice(0, 2);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={closeCart}
            className="fixed inset-0 bg-ash/40 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 border-l border-ash-light flex flex-col"
          >
            <div className="flex flex-col p-6 md:p-8 border-b border-ash-light">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl uppercase tracking-[0.15em] flex items-center gap-3">
                  Your Bag <span className="text-ash-muted text-sm normal-case tracking-normal font-sans">({count})</span>
                </h2>
                <button onClick={closeCart} className="hover:rotate-90 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2">
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              
              {items.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between typography-caption uppercase tracking-[0.1em]">
                    {remaining > 0 
                      ? <span>You are <span className="font-semibold text-ash">${remaining.toLocaleString()}</span> away from free shipping</span> 
                      : <span className="text-ash font-semibold">You have unlocked free shipping</span>
                    }
                  </div>
                  <div className="w-full h-1 bg-ash-light overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-ash"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-ash-muted space-y-6">
                  <ShoppingBag className="w-12 h-12 text-ash-light" strokeWidth={1} />
                  <p className="uppercase tracking-[0.2em] text-[10px] font-sans text-ash font-medium">Your Bag Is Empty</p>
                  <p className="text-center font-light text-sm max-w-[250px]">Explore our latest arrivals and timeless classics.</p>
                  <Link 
                    to="/shop"
                    onClick={closeCart}
                    className="border border-ash px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-ash hover:bg-ash hover:text-white luxury-transition outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2"
                  >
                    Discover the Collection
                  </Link>
                </div>
              ) : (
                <div className="p-6 md:p-8 space-y-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 md:gap-6 group">
                      <Link to={`/product/${item.id}`} onClick={closeCart} className="w-24 h-32 bg-[#FAFAFA] flex-shrink-0 relative overflow-hidden block">
                        <img loading="lazy" decoding="async" src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      </Link>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-2">
                          <Link to={`/product/${item.id}`} onClick={closeCart}>
                            {item.brand && <p className="typography-caption uppercase tracking-wider text-ash-muted mb-1">{item.brand}</p>}
                            <h3 className="text-[10px] uppercase tracking-[0.15em] font-sans font-medium text-ash leading-relaxed mb-1">{item.name}</h3>
                            {item.colors && item.colors.length > 0 && (
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-3 h-3 rounded-full border border-ash/10" style={{ backgroundColor: item.colors[0] }} />
                                <span className="text-[9px] uppercase tracking-widest text-ash-muted">Standard</span>
                              </div>
                            )}
                          </Link>
                          <p className="text-sm font-serif italic text-ash shrink-0">${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        </div>
                        
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <div className="flex items-center border border-ash-light">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="p-3 md:p-2.5 hover:bg-[#FAFAFA] text-ash-muted hover:text-ash transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" strokeWidth={1.5} />
                            </button>
                            <span className="w-8 text-center text-[10px] font-sans font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-3 md:p-2.5 hover:bg-[#FAFAFA] text-ash-muted hover:text-ash transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" strokeWidth={1.5} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-[10px] text-ash-muted hover:text-ash uppercase tracking-[0.15em] font-semibold flex items-center gap-1.5 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2 border-b border-transparent hover:border-ash pb-0.5"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Recommendations */}
                  <div className="pt-8 border-t border-ash-light mt-8">
                    <h3 className="typography-caption uppercase tracking-[0.2em] mb-4 text-ash">You May Also Like</h3>
                    <div className="flex flex-col gap-4">
                      {recommendations.map(rec => (
                        <div key={rec.id} className="flex gap-4 items-center bg-[#FAFAFA] p-3">
                          <img loading="lazy" decoding="async" src={rec.image} alt={rec.name} className="w-16 h-20 object-cover bg-white" />
                          <div className="flex-1">
                            <h4 className="text-[9px] uppercase tracking-widest font-semibold mb-1 truncate">{rec.name}</h4>
                            <p className="text-xs font-serif italic text-ash-muted mb-2">${rec.price.toLocaleString()}</p>
                            <Link to={`/product/${rec.id}`} onClick={closeCart} className="text-[9px] uppercase tracking-widest border-b border-ash text-ash inline-flex items-center gap-1">
                              View <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 md:p-8 border-t border-ash-light bg-white">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between typography-caption text-ash-muted">
                    <span>Subtotal</span>
                    <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center justify-between typography-caption text-ash-muted">
                    <span>Estimated Shipping</span>
                    <span>{remaining <= 0 ? 'Complimentary' : 'Calculated at checkout'}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg md:text-xl pt-3 border-t border-ash-light mt-3">
                    <span className="font-serif uppercase tracking-widest">Total</span>
                    <span className="font-serif italic">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <Link 
                  to="/checkout" 
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 bg-ash text-white py-5 uppercase tracking-[0.2em] text-[10px] font-sans font-medium hover:bg-ash/90 luxury-transition"
                >
                  <ShieldCheck className="w-4 h-4" /> Secure Checkout
                </Link>
                
                <div className="mt-4 flex items-center justify-center gap-6 text-[9px] uppercase tracking-widest text-ash-muted font-sans font-medium">
                  <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Fast Delivery</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Authentic</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
