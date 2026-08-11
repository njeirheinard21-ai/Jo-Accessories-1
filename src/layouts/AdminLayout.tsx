import { Outlet, Navigate, Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../lib/firebase"
import { 
  LayoutDashboard, ShoppingCart, Users, Package, Tags, 
  Settings, Box, BarChart3, Megaphone, FileText, Shield, UserCog, Layers
} from "lucide-react"
import { useAuthStore } from "../stores/authStore"
import { hasPermission } from "../utils/rbac"

export function AdminLayout() {
  const { user, userRole, isLoading } = useAuthStore()
  const location = useLocation()
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null)
  
  useEffect(() => {
    const checkSetup = async () => {
      try {
        const docRef = doc(db, 'settings', 'system')
        const snap = await getDoc(docRef)
        setIsSetupComplete(snap.exists() ? snap.data().isSetupComplete : false)
      } catch (err) {
        setIsSetupComplete(false)
      }
    }
    checkSetup()
  }, [])

  if (isLoading || isSetupComplete === null) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  if (isSetupComplete === false) {
    return <Navigate to="/setup" replace />
  }

  const isStaff = userRole && ['admin', 'super_admin', 'store_owner', 'inventory_manager', 'order_manager', 'marketing_manager', 'customer_support'].includes(userRole);
  
  if (!user || !isStaff) {
    return <Navigate to="/account" state={{ from: location }} replace />
  }

  const NavItem = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => {
    const isActive = location.pathname === to || (location.pathname.startsWith(to) && to !== '/admin');
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-4 px-4 py-3 text-[10px] font-sans font-semibold uppercase tracking-[0.2em] transition-colors outline-none ${isActive ? 'bg-[#FAFAFA] text-ash border-l-2 border-ash' : 'text-ash-muted hover:text-ash hover:bg-[#FAFAFA] border-l-2 border-transparent'}`}
      >
        <Icon className={`w-4 h-4 ${isActive ? 'text-ash' : 'text-ash-muted'}`} strokeWidth={isActive ? 2 : 1.5} />
        {children}
      </Link>
    )
  }

  const NavGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-8">
      <h3 className="px-4 text-[9px] font-sans font-bold text-ash uppercase tracking-[0.3em] mb-4">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#FAFAFA] text-ash">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-ash-light hidden md:flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-ash-light">
          <span className="font-serif text-2xl tracking-widest uppercase text-ash">JO Admin</span>
        </div>
        <nav className="flex-1 py-8 px-4 overflow-y-auto scrollbar-hide">
          
          <NavGroup title="Core">
            <NavItem to="/admin" icon={LayoutDashboard}>Overview</NavItem>
            {hasPermission(userRole, 'manage_orders') && (
              <NavItem to="/admin/orders" icon={ShoppingCart}>Orders</NavItem>
            )}
            <NavItem to="/admin/analytics" icon={BarChart3}>Analytics</NavItem>
          </NavGroup>

          <NavGroup title="Catalog">
            {hasPermission(userRole, 'manage_products') && (
              <NavItem to="/admin/products" icon={Package}>Products</NavItem>
            )}
            {hasPermission(userRole, 'manage_categories') && (
              <NavItem to="/admin/categories" icon={Tags}>Categories</NavItem>
            )}
            {hasPermission(userRole, 'manage_products') && (
              <NavItem to="/admin/collections" icon={Layers}>Collections</NavItem>
            )}
          </NavGroup>

          <NavGroup title="Inventory">
            <NavItem to="/admin/inventory" icon={Box}>Stock</NavItem>
          </NavGroup>

          <NavGroup title="Users">
            {hasPermission(userRole, 'manage_customers') && (
              <NavItem to="/admin/customers" icon={Users}>Clients</NavItem>
            )}
            {hasPermission(userRole, 'manage_settings') && (
              <NavItem to="/admin/staff" icon={UserCog}>Staff</NavItem>
            )}
          </NavGroup>

          <NavGroup title="System">
            {hasPermission(userRole, 'manage_settings') && (
              <NavItem to="/admin/settings" icon={Settings}>Settings</NavItem>
            )}
            {hasPermission(userRole, 'manage_settings') && (
              <NavItem to="/admin/security" icon={Shield}>Security</NavItem>
            )}
          </NavGroup>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#FAFAFA]">
        <header className="h-20 bg-white border-b border-ash-light flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-ash hidden sm:block">Business Manager</h1>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/" className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-ash-muted hover:text-ash transition-colors outline-none">Storefront</Link>
            <div className="w-8 h-8 bg-ash text-white flex items-center justify-center font-sans font-medium text-xs cursor-pointer">
              {user.email?.[0].toUpperCase() || 'A'}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 md:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
