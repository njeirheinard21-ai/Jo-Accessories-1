import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotals } = useCartStore();
  const { total, count } = getTotals();

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
            <div className="flex items-center justify-between p-8 border-b border-ash-light">
              <h2 className="font-serif text-2xl uppercase tracking-[0.15em] flex items-center gap-3">
                Your Bag <span className="text-ash-muted text-sm normal-case tracking-normal font-sans">({count})</span>
              </h2>
              <button onClick={closeCart} className="hover:rotate-90 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-ash-muted space-y-6">
                  <ShoppingBag className="w-12 h-12 text-white/40" strokeWidth={1} />
                  <p className="uppercase tracking-[0.2em] text-[10px] font-sans text-ash-muted font-medium">Your Bag Is Empty</p>
                  <button 
                    onClick={closeCart}
                    className="border border-ash px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-ash hover:bg-ash hover:text-white luxury-transition outline-none"
                  >
                    Discover the Collection
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-24 h-32 bg-[#FAFAFA] flex-shrink-0 relative overflow-hidden">
                      <img loading="lazy" decoding="async" src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-[10px] uppercase tracking-[0.15em] font-sans font-medium text-ash leading-relaxed">{item.name}</h3>
                          <p className="text-ash-muted text-[10px] mt-1 tracking-widest uppercase">One Size</p>
                        </div>
                        <p className="text-sm font-serif italic text-ash shrink-0">${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-ash-light">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-3 md:p-2.5 hover:bg-white text-ash-muted hover:text-ash transition-colors outline-none"
                          >
                            <Minus className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                          <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-3 md:p-2.5 hover:bg-white text-ash-muted hover:text-ash transition-colors outline-none"
                          >
                            <Plus className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-[10px] text-ash-muted hover:text-ash uppercase tracking-[0.15em] font-semibold flex items-center gap-1.5 transition-colors outline-none"
                        >
                          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 border-t border-ash-light bg-white">
                <div className="flex items-center justify-between mb-6 text-xl">
                  <span className="font-serif uppercase tracking-widest">Subtotal</span>
                  <span className="font-serif italic">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-[10px] font-light text-ash-muted mb-6 text-center uppercase tracking-[0.1em]">Shipping and taxes calculated at checkout.</p>
                <Link 
                  to="/checkout" 
                  onClick={closeCart}
                  className="w-full flex items-center justify-center bg-ash text-white py-5 uppercase tracking-[0.2em] text-[10px] font-sans font-medium hover:bg-ash/90 luxury-transition"
                >
                  Secure Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
