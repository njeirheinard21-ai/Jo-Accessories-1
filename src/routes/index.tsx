import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider, useRouteError } from "react-router-dom"
import { PublicLayout } from "../layouts/PublicLayout"
import { NotFound } from "../pages/NotFound"
import { AdminLayout } from "../layouts/AdminLayout"
import { ScrollToTop } from "../components/ScrollToTop"

// Route Error Boundary
function RouteErrorBoundary() {
  const error = useRouteError() as any;
  console.error("Route Error:", error);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
      <h2 className="text-2xl font-serif mb-4 uppercase tracking-widest text-ash">Oops! Something went wrong</h2>
      <p className="text-ash-muted mb-6 max-w-md text-sm">
        {error?.message || "An unexpected error occurred while loading this page."}
      </p>
      <button
        className="bg-ash text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-ash/90 transition-colors"
        onClick={() => window.location.href = '/'}
      >
        Return to Home
      </button>
    </div>
  );
}

// Lazy loaded pages for performance (Bundle splitting)
const Home = lazy(() => import("../pages/public/Home").then(m => ({ default: m.Home })))
const Shop = lazy(() => import("../pages/public/Shop").then(m => ({ default: m.Shop })))
const ProductDetails = lazy(() => import("../pages/public/ProductDetails").then(m => ({ default: m.ProductDetails })))
const Login = lazy(() => import("../pages/public/Login").then(m => ({ default: m.Login })))
const Checkout = lazy(() => import("../pages/public/Checkout").then(m => ({ default: m.Checkout })))
const OrderSuccess = lazy(() => import("../pages/public/OrderSuccess").then(m => ({ default: m.OrderSuccess })))

// Admin Pages
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })))
const AdminProducts = lazy(() => import("../pages/admin/AdminProducts").then(m => ({ default: m.AdminProducts })))
const AdminOrders = lazy(() => import("../pages/admin/AdminOrders").then(m => ({ default: m.AdminOrders })))
const AdminAnalytics = lazy(() => import("../pages/admin/AdminAnalytics").then(m => ({ default: m.AdminAnalytics })))
const AdminInventory = lazy(() => import("../pages/admin/AdminInventory").then(m => ({ default: m.AdminInventory })))
const AdminCategories = lazy(() => import("../pages/admin/AdminCategories").then(m => ({ default: m.AdminCategories })))
const AdminCollections = lazy(() => import("../pages/admin/AdminCollections").then(m => ({ default: m.AdminCollections })))
const AdminCustomers = lazy(() => import("../pages/admin/AdminCustomers").then(m => ({ default: m.AdminCustomers })))
const AdminMarketing = lazy(() => import("../pages/admin/AdminMarketing").then(m => ({ default: m.AdminMarketing })))
const AdminCMS = lazy(() => import("../pages/admin/AdminCMS").then(m => ({ default: m.AdminCMS })))
const AdminStaff = lazy(() => import("../pages/admin/AdminStaff").then(m => ({ default: m.AdminStaff })))
const AdminSecurity = lazy(() => import("../pages/admin/AdminSecurity").then(m => ({ default: m.AdminSecurity })))
// A placeholder for settings if we don't have it yet
const AdminSettings = () => <div className="p-6">Settings are coming soon.</div>

const SetupWizard = lazy(() => import("../pages/setup/SetupWizard").then(m => ({ default: m.SetupWizard })))

// Skeleton loader
const PageLoader = () => (
  <div className="w-full h-screen flex items-center justify-center bg-white/50">
    <div className="w-8 h-8 border-4 border-ash-light border-t-black rounded-full animate-spin"></div>
  </div>
)

const router = createBrowserRouter([
  {
    path: "/",
    element: <><ScrollToTop /><PublicLayout /></>,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },
      { path: "shop", element: <Suspense fallback={<PageLoader />}><Shop /></Suspense> },
      { path: "just-landed", element: <Suspense fallback={<PageLoader />}><Shop /></Suspense> },
      { path: "best-sellers", element: <Suspense fallback={<PageLoader />}><Shop /></Suspense> },
      { path: "product/:id", element: <Suspense fallback={<PageLoader />}><ProductDetails /></Suspense> },
      { path: "account", element: <Suspense fallback={<PageLoader />}><Login /></Suspense> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/setup",
    element: <Suspense fallback={<PageLoader />}><ScrollToTop /><SetupWizard /></Suspense>
  },
  {
    path: "/checkout",
    element: <Suspense fallback={<PageLoader />}><ScrollToTop /><Checkout /></Suspense>
  },
  {
    path: "/order-success",
    element: <Suspense fallback={<PageLoader />}><ScrollToTop /><OrderSuccess /></Suspense>
  },
  {
    path: "/admin",
    element: <><ScrollToTop /><AdminLayout /></>,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense> },
      { path: "products", element: <Suspense fallback={<PageLoader />}><AdminProducts /></Suspense> },
      { path: "orders", element: <Suspense fallback={<PageLoader />}><AdminOrders /></Suspense> },
      { path: "analytics", element: <Suspense fallback={<PageLoader />}><AdminAnalytics /></Suspense> },
      { path: "inventory", element: <Suspense fallback={<PageLoader />}><AdminInventory /></Suspense> },
      { path: "categories", element: <Suspense fallback={<PageLoader />}><AdminCategories /></Suspense> },
      { path: "collections", element: <Suspense fallback={<PageLoader />}><AdminCollections /></Suspense> },
      { path: "customers", element: <Suspense fallback={<PageLoader />}><AdminCustomers /></Suspense> },
      { path: "marketing", element: <Suspense fallback={<PageLoader />}><AdminMarketing /></Suspense> },
      { path: "cms", element: <Suspense fallback={<PageLoader />}><AdminCMS /></Suspense> },
      { path: "staff", element: <Suspense fallback={<PageLoader />}><AdminStaff /></Suspense> },
      { path: "security", element: <Suspense fallback={<PageLoader />}><AdminSecurity /></Suspense> },
      { path: "settings", element: <AdminSettings /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />
  }
])

export function AppRouter() {
  return <RouterProvider router={router} />
}



