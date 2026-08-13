import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Search, User, ShoppingBag, Menu, X, Heart } from "lucide-react"
import { useAuthStore } from "../../stores/authStore"
import { useCartStore } from "../../stores/cartStore"
import { SearchAutocomplete } from "../SearchAutocomplete"
import { AnimatePresence, motion } from "motion/react"

export function Header() {
  const { userRole } = useAuthStore()
  const { getTotals } = useCartStore()
  const { count } = getTotals()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  
  const isHome = location.pathname === "/"
  const isTransparent = isHome && !isScrolled
  const isStaff = userRole && ['admin', 'super_admin', 'store_owner', 'inventory_manager', 'order_manager', 'marketing_manager'].includes(userRole);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: "New In", id: "new-in", to: "/shop?sort=newest" },
    { label: "Women", id: "women", to: "/shop?category=women" },
    { label: "Bags", id: "bags", to: "/shop?category=bags" },
    { label: "Accessories", id: "accessories", to: "/shop?category=accessories" },
    { label: "Designers", id: "designers", to: "/shop?category=designers" },
    { label: "Collections", id: "collections", to: "/shop?collection=all" },
    { label: "Sale", id: "sale", to: "/shop?category=sale", className: "text-red-700 dark:text-red-500" }
  ]

  return (
    <>
      <header 
        className={`fixed top-0 left-0 z-50 w-full luxury-transition ${
          isTransparent 
            ? "bg-transparent text-white border-transparent" 
            : "bg-white text-ash border-b border-ash-light"
        }`}
      >

        <div className="container mx-auto px-6 lg:px-12">
          {/* Top section: Mobile menu + Logo + Desktop Icons */}
          <div className="h-20 flex items-center justify-between">
            {/* Mobile Menu Toggle (Left) */}
            <div className="flex-1 md:hidden">
              <button className="p-3 -ml-3 outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2" onClick={() => setMobileMenuOpen(true)} aria-label="Menu">
                <Menu className="w-6 h-6" strokeWidth={1} />
              </button>
            </div>

            {/* Empty space for desktop alignment to match icons */}
            <div className="hidden md:flex flex-1" />

            {/* Logo (Center) */}
            <Link to="/" className="flex-1 flex justify-center outline-none">
              {/* Replace with SVGs or text if transparent logo is needed, using text for cleaner luxury feel if image lacks contrast */}
              <h1 className="font-serif text-2xl md:text-3xl tracking-widest uppercase whitespace-nowrap">
                JO Accessories
              </h1>
            </Link>

            {/* Icons (Right) */}
            <div className="flex-1 flex items-center justify-end gap-2 md:gap-3 -mr-2 md:-mr-3">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 md:p-3 hover:opacity-70 transition-opacity outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2" 
                aria-label="Search"
              >
                <Search className="w-5 h-5" strokeWidth={1} />
              </button>
              <Link to="/account" className="p-2 md:p-3 hidden md:block hover:opacity-70 transition-opacity outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2" aria-label="Account">
                <User className="w-5 h-5" strokeWidth={1} />
              </Link>
              <Link to="/account?tab=wishlist" className="p-2 md:p-3 hidden md:block hover:opacity-70 transition-opacity outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2" aria-label="Wishlist">
                <Heart className="w-5 h-5" strokeWidth={1} />
              </Link>
              <button 
                onClick={() => useCartStore.getState().openCart()}
                className="p-2 md:p-3 hover:opacity-70 transition-opacity relative outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2" 
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1} />
                {count > 0 && (
                  <span className={`absolute top-0.5 right-0.5 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${
                    isTransparent ? "bg-white text-black" : "bg-ash text-white"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation (Bottom) */}
          <nav className="hidden md:flex items-center justify-center gap-10 pb-4 typography-nav">
            {navLinks.map((link) => (
              <Link 
                key={link.id} 
                to={link.to} 
                className={`relative py-1 group overflow-hidden ${link.className || ''}`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-[1px] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ${
                  isTransparent ? "bg-white" : "bg-ash"
                }`} />
              </Link>
            ))}
            
            {isStaff && (
              <Link to="/admin" className="relative py-1 group overflow-hidden opacity-60">
                Admin
                <span className={`absolute bottom-0 left-0 w-full h-[1px] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ${
                  isTransparent ? "bg-white" : "bg-ash"
                }`} />
              </Link>
            )}
          </nav>
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
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="fixed inset-y-0 left-0 w-[85vw] max-w-md bg-white text-ash z-[70] flex flex-col"
            >
              <div className="p-6 border-b border-ash-light flex items-center justify-between">
                <span className="font-serif uppercase tracking-widest text-xl">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 outline-none hover:rotate-90 transition-transform duration-300 focus-visible:ring-1 focus-visible:ring-ash">
                  <X className="w-6 h-6" strokeWidth={1} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-8 typography-nav text-sm">
                {navLinks.map((link) => (
                  <Link 
                    key={link.id} 
                    to={link.to} 
                    className={`block ${link.className || ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="mt-8 pt-8 border-t border-ash-light flex flex-col gap-6">
                  <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4">
                    <User className="w-5 h-5" strokeWidth={1} />
                    My Account
                  </Link>
                  <Link to="/account?tab=wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4">
                    <Heart className="w-5 h-5" strokeWidth={1} />
                    Wishlist
                  </Link>
                  {isStaff && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-ash-muted">
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </div>
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

