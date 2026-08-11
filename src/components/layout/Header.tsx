import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, User, ShoppingBag, ChevronDown, Menu, X } from "lucide-react"
import { useAuthStore } from "../../stores/authStore"
import { useCartStore } from "../../stores/cartStore"
import { SearchAutocomplete } from "../SearchAutocomplete"
import { AnimatePresence, motion } from "motion/react"
import { hasPermission } from "../../utils/rbac"

export function Header() {
  const { userRole, isLoading } = useAuthStore()
  const { getTotals } = useCartStore()
  const { count } = getTotals()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isStaff = userRole && ['admin', 'super_admin', 'store_owner', 'inventory_manager', 'order_manager', 'marketing_manager'].includes(userRole);

  const navLinks = [
    { label: "New In", id: "new-in", to: "/shop?sort=newest" },
    { label: "Hand Bags", id: "designers", to: "/shop?category=designers" },
    { label: "Casual Bags", id: "bags", to: "/shop?category=bags" },
    { label: "Premium Bags", id: "cosmetics", to: "/shop?category=cosmetics" },
    { label: "Sale", id: "sale", to: "/shop?category=sale", className: "text-red-600" }
  ]

  const megaMenus: Record<string, React.ReactNode> = {
    bags: (
      <div className="grid grid-cols-4 gap-8">
        <div>
          <h4 className="font-sans font-semibold uppercase tracking-[0.2em] text-[10px] mb-6 text-ash">By Style</h4>
          <ul className="space-y-4 text-sm text-ash-muted font-light">
            <li><Link to="/shop?category=bags&style=tote" className="hover:text-ash transition-colors">Tote Bags</Link></li>
            <li><Link to="/shop?category=bags&style=crossbody" className="hover:text-ash transition-colors">Crossbody Bags</Link></li>
            <li><Link to="/shop?category=bags&style=shoulder" className="hover:text-ash transition-colors">Shoulder Bags</Link></li>
            <li><Link to="/shop?category=bags&style=clutch" className="hover:text-ash transition-colors">Clutches</Link></li>
            <li><Link to="/shop?category=bags&style=mini" className="hover:text-ash transition-colors">Mini Bags</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans font-semibold uppercase tracking-[0.2em] text-[10px] mb-6 text-ash">Featured Brands</h4>
          <ul className="space-y-4 text-sm text-ash-muted font-light">
            <li><Link to="/shop?brand=prada" className="hover:text-ash transition-colors">Prada</Link></li>
            <li><Link to="/shop?brand=gucci" className="hover:text-ash transition-colors">Gucci</Link></li>
            <li><Link to="/shop?brand=ysl" className="hover:text-ash transition-colors">Saint Laurent</Link></li>
            <li><Link to="/shop?brand=bottega" className="hover:text-ash transition-colors">Bottega Veneta</Link></li>
          </ul>
        </div>
        <div className="col-span-2 relative h-64 bg-white group overflow-hidden">
          <img loading="eager" fetchPriority="high" src="https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop" alt="Bags Campaign" className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" />
          <div className="absolute inset-0 bg-ash/20 flex flex-col items-center justify-center text-white p-6">
            <h3 className="font-serif text-3xl mb-4 uppercase tracking-widest text-center text-balance">The Summer Tote</h3>
            <Link to="/shop?collection=summer-tote" className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] border-b border-white pb-1 hover:opacity-80 transition-opacity">Discover</Link>
          </div>
        </div>
      </div>
    ),
    designers: (
      <div className="grid grid-cols-4 gap-8">
        <div>
          <h4 className="font-sans font-semibold uppercase tracking-[0.2em] text-[10px] mb-6 text-ash">A-Z Designers</h4>
          <ul className="space-y-4 text-sm text-ash-muted font-light">
            <li><Link to="/shop" className="hover:text-ash border-b border-ash-light pb-1 transition-colors">Discover All Designers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans font-semibold uppercase tracking-[0.2em] text-[10px] mb-6 text-ash">Most Wanted</h4>
          <ul className="space-y-4 text-sm text-ash-muted font-light">
            <li><Link to="/shop?brand=loewe" className="hover:text-ash transition-colors">Loewe</Link></li>
            <li><Link to="/shop?brand=jacquemus" className="hover:text-ash transition-colors">Jacquemus</Link></li>
            <li><Link to="/shop?brand=the-row" className="hover:text-ash transition-colors">The Row</Link></li>
            <li><Link to="/shop?brand=khaite" className="hover:text-ash transition-colors">Khaite</Link></li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-white/90 backdrop-blur-lg border-b border-ash-light/50">
        {/* Top bar */}
        <div className="bg-ash text-white/60 text-[9px] font-sans font-medium tracking-[0.3em] uppercase text-center py-2.5 px-4">
          Free standard shipping on orders over $500
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 h-16 md:h-24 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 -ml-2" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" strokeWidth={1} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 outline-none">
            <img loading="eager" fetchPriority="high" 
              src="https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/ChatGPT%20Image%20Jul%2025%2C%202026%2C%2001_37_06%20AM.png?alt=media&token=66dd75fd-533e-4c7f-8fe0-0dc831843bb0"
              alt="Jo Accessories Logo" 
              className="h-16 md:h-24 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-12 text-[10px] font-sans font-semibold uppercase tracking-[0.2em]">
            {navLinks.map((link) => (
              <div 
                key={link.id} 
                className="h-24 flex items-center border-b-2 border-transparent hover:border-ash transition-all duration-300"
              >
                <Link 
                  to={link.to} 
                  className={`transition-colors ${link.className || 'text-ash hover:text-ash'}`}
                >
                  {link.label}
                </Link>
              </div>
            ))}
            
            {isStaff && (
              <Link to="/admin" className="text-ash-muted hover:text-ash transition-colors h-24 flex items-center">
                Admin
              </Link>
            )}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:opacity-70 transition-opacity outline-none" 
              aria-label="Search"
            >
              <Search className="w-5 h-5" strokeWidth={1.2} />
            </button>
            <Link to="/account" className="hidden md:block hover:opacity-70 transition-opacity outline-none" aria-label="Account">
              <User className="w-5 h-5" strokeWidth={1.2} />
            </Link>
            <button 
              onClick={() => useCartStore.getState().openCart()}
              className="hover:opacity-70 transition-opacity relative outline-none" 
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.2} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-ash text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ash/50 z-[60]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[80vw] max-w-sm bg-white z-[70] overflow-y-auto flex flex-col"
            >
              <div className="p-4 border-b border-ash-light flex items-center justify-between">
                <span className="font-serif uppercase tracking-widest text-lg">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 p-6 flex flex-col gap-6 text-[11px] font-sans font-medium uppercase tracking-[0.2em]">
                {navLinks.map((link) => (
                  <Link 
                    key={link.id} 
                    to={link.to} 
                    className={link.className || ''}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {isStaff && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-ash-muted mt-4 pt-4 border-t border-ash-light">
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="mt-auto pt-6 border-t border-ash-light flex items-center gap-3">
                  <User className="w-5 h-5" />
                  My Account
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && <SearchAutocomplete onClose={() => setIsSearchOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

