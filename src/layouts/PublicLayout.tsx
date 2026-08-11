import { lazy, Suspense } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Header } from "../components/layout/Header"
import { Footer } from "../components/layout/Footer"
import { AnimatePresence, motion } from "motion/react"

const CartDrawer = lazy(() => import("../components/cart/CartDrawer").then(m => ({ default: m.CartDrawer })))

export function PublicLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 relative pt-[104px] md:pt-[136px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <CartDrawer />
      </Suspense>
    </div>
  )
}
