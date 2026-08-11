import { useEffect, useState, lazy, Suspense } from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { productService } from "../../services/productService"
import { Heart, Share2, Truck, RefreshCcw, ChevronDown, Check, Ruler } from "lucide-react"
import { useCartStore } from "../../stores/cartStore"
import { useWishlistStore } from "../../stores/wishlistStore"
import { useRecentlyViewedStore } from "../../stores/recentlyViewedStore"
import { SEO } from "../../components/SEO"
import { mockProducts } from "../../data/mockProducts"
import { motion, AnimatePresence } from "motion/react"
import { X, ArrowRight, ArrowLeft } from "lucide-react"

const ProductCarousel = lazy(() => import("../../features/catalog/components/home/ProductCarousel").then(m => ({ default: m.ProductCarousel })))

export function ProductDetails() {
  const { id } = useParams()
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlistStore()
  const { addProduct: addRecentlyViewed, items: recentlyViewed } = useRecentlyViewedStore()
  const [activeImage, setActiveImage] = useState(0)
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details')
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showStickyPanel, setShowStickyPanel] = useState(false)
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id!),
    enabled: !!id
  })


  useEffect(() => {
    const handleScroll = () => {
      setShowStickyPanel(window.scrollY > 800)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product)
      setActiveImage(0) // reset on product change
    }
  }, [product, addRecentlyViewed])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center h-[60vh]">
        <div className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-ash-muted animate-pulse">Loading</div>
      </div>
    )
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-20 text-center font-serif text-2xl uppercase tracking-widest">Product not found</div>
  }

  const isWished = isInWishlist(product.id)
  
  // Mock related products based on category
  const relatedProducts = mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6)
  
  // Generate mock images for gallery
  const images = [product.image, ...Array(3).fill(product.image)]

  const toggleAccordion = (id: string) => {
    setActiveAccordion(prev => prev === id ? null : id)
  }

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [product.image],
    "description": `Shop the ${product.name}. Crafted from the finest materials, defining modern luxury.`,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Jo Accessories"
    },
    "offers": {
      "@type": "Offer",
      "url": `${import.meta.env.VITE_APP_URL || 'https://jo-accessories.com'}/product/${product.id}`,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <div className="bg-white">
      <SEO 
        title={`${product.name} | Jo Accessories`}
        description={`Shop the ${product.name}. Crafted from the finest materials, defining modern luxury.`}
        image={product.image}
        structuredData={productSchema}
      />

      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 py-6 text-xs text-ash-muted uppercase tracking-widest">
        <Link to="/" className="hover:text-ash transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-ash transition-colors">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-ash">{product.name}</span>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24">
          
          {/* Images Section */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 lg:gap-6 lg:h-[min(850px,calc(100vh-160px))]">
            {/* Desktop Thumbnails */}
            <div className="hidden md:flex flex-col gap-4 w-20 lg:w-24 shrink-0 overflow-y-auto scrollbar-hide pr-2">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`aspect-[4/5] bg-[#FAFAFA] relative overflow-hidden luxury-transition ${activeImage === i ? 'ring-1 ring-ash ring-offset-4' : 'opacity-50 hover:opacity-100'}`}
                >
                  <img loading="lazy" decoding="async" src={img} alt={`${product.name} view ${i+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image with Zoom */}
            <div className="flex-1 aspect-[4/5] md:aspect-auto bg-[#FAFAFA] relative overflow-hidden group cursor-zoom-in" onClick={() => setIsFullScreen(true)}>
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  src={images[activeImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-150 transform-origin-center"
                  style={{ transformOrigin: 'center center' }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = ((e.clientX - rect.left) / rect.width) * 100
                    const y = ((e.clientY - rect.top) / rect.height) * 100
                    e.currentTarget.style.transformOrigin = `${x}% ${y}%`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transformOrigin = 'center center'
                  }}
                />
              </AnimatePresence>
            </div>
            
            {/* Mobile Thumbnails */}
            <div className="flex md:hidden gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`w-24 shrink-0 snap-start aspect-[4/5] bg-[#FAFAFA] relative overflow-hidden luxury-transition ${activeImage === i ? 'ring-1 ring-ash ring-offset-4' : 'opacity-50'}`}
                >
                  <img loading="lazy" decoding="async" src={img} alt={`${product.name} view ${i+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-32 lg:max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide lg:pl-6 pb-12">
            <div className="mb-10">
              <div className="flex items-center justify-between mb-8">
                <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-ash-muted">
                  {product.brand || 'Jo Accessories'}
                </p>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-3 h-3 text-ash fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                  <span className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-ash-muted underline ml-2 cursor-pointer hover:text-ash transition-colors">(124 Reviews)</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif uppercase tracking-tight text-ash mb-6 leading-none text-balance">{product.name}</h1>
              <p className="text-xl md:text-2xl font-serif italic tracking-tight text-ash">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</p>
            </div>

            {/* Color Selection */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase">Color</h3>
                <span className="text-[10px] font-sans font-medium text-ash-muted uppercase tracking-[0.2em]">Black Noir</span>
              </div>
              <div className="flex gap-4">
                {['bg-ash', 'bg-[#f4f4f4] border border-ash-light', 'bg-stone-500', 'bg-[#6d4c41]'].map((color, i) => (
                  <button key={i} aria-label={`Color option ${i}`} className={`w-10 h-10 rounded-full ${color} ring-1 ring-offset-4 transition-all duration-300 ${i === 0 ? 'ring-ash' : 'ring-transparent hover:ring-ash-light'}`} />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-10">
              <button 
                onClick={() => {
                  useCartStore.getState().addItem(product);
                  useCartStore.getState().openCart();
                }}
                className="flex-1 bg-ash text-white py-5 uppercase tracking-[0.2em] text-[10px] font-sans font-medium hover:bg-ash/90 luxury-transition"
              >
                Add to Bag
              </button>
              <button 
                onClick={() => isWished ? removeWishlist(product.id) : addWishlist(product)}
                className={`p-5 border luxury-transition ${isWished ? 'border-ash bg-ash text-white' : 'border-ash-light hover:border-ash text-ash'}`}
                aria-label="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWished ? 'fill-current' : ''}`} strokeWidth={1.5} />
              </button>
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-3 mb-12 text-[10px] uppercase tracking-[0.2em] font-semibold text-green-700">
              <Check className="w-4 h-4" strokeWidth={2} /> Available Online
            </div>

            {/* Accordions */}
            <div className="border-t border-ash-light divide-y divide-ash-light mb-12">
              {/* Details */}
              <div className="py-6">
                <button 
                  onClick={() => toggleAccordion('details')}
                  className="flex items-center justify-between w-full text-left outline-none group"
                >
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] group-hover:text-ash-muted text-ash transition-colors">Product Details</span>
                  <ChevronDown className={`w-4 h-4 text-ash-muted transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeAccordion === 'details' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'details' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 text-sm font-sans text-ash-muted leading-[1.8] space-y-5 font-light">
                        <p>{product.description || "Crafted from the finest materials, this piece defines modern luxury. Its versatile design makes it the perfect companion for both everyday elegance and special occasions."}</p>
                        <ul className="list-disc pl-5 space-y-2 text-ash-muted">
                          <li>100% Calfskin Leather</li>
                          <li>Gold-toned hardware</li>
                          <li>Made in Italy</li>
                          <li>Dimensions: 24 x 16 x 6 cm</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              
              <div className="py-6">
                <button 
                  onClick={() => toggleAccordion('styling')}
                  className="flex items-center justify-between w-full text-left outline-none group"
                >
                  <span className="text-[10px] font-sans font-sans font-medium uppercase tracking-[0.2em] group-hover:text-ash-muted transition-colors">Styling & Occasions</span>
                  <ChevronDown className={`w-4 h-4 text-ash-muted transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeAccordion === 'styling' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'styling' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 text-sm font-sans text-ash-muted leading-[1.8] space-y-5 font-light">
                        <p>Elevate your ensemble by pairing this piece with tailored silhouettes or relaxed weekend wear. Perfect for evening galas, business luncheons, or elevated travel.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Shipping */}
              <div className="py-6">
                <button 
                  onClick={() => toggleAccordion('shipping')}
                  className="flex items-center justify-between w-full text-left outline-none group"
                >
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] group-hover:text-ash-muted text-ash transition-colors">Shipping & Returns</span>
                  <ChevronDown className={`w-4 h-4 text-ash-muted transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'shipping' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 space-y-6">
                        <div className="flex items-start gap-5 text-sm font-light">
                          <Truck className="w-5 h-5 shrink-0 text-ash mt-0.5" strokeWidth={1.2} />
                          <div>
                            <p className="font-medium mb-1 tracking-wide">Complimentary Standard Delivery</p>
                            <p className="text-ash-muted">Delivery in 3-5 working days.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-5 text-sm font-light">
                          <RefreshCcw className="w-5 h-5 shrink-0 text-ash mt-0.5" strokeWidth={1.2} />
                          <div>
                            <p className="font-medium mb-1 tracking-wide">Free Returns</p>
                            <p className="text-ash-muted">Returns can be requested within 14 days from delivery.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="mt-auto pt-8"> 
               <button className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-sans font-medium hover:text-ash-muted transition-colors mb-6 outline-none">
                 <Ruler className="w-4 h-4" strokeWidth={1.5} /> Size Guide
               </button>
               <button className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-sans font-medium hover:text-ash-muted transition-colors outline-none">
                 <Share2 className="w-4 h-4" strokeWidth={1.5} /> Share
               </button>
            </div>
          </div>
        </div>
      </div>


      <AnimatePresence>
        {isFullScreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-medium">{product.name}</span>
              <button onClick={() => setIsFullScreen(false)} className="p-2 hover:opacity-50 transition-opacity outline-none">
                <X className="w-6 h-6" strokeWidth={1} />
              </button>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center p-4">
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev === 0 ? images.length - 1 : prev - 1)); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 hover:opacity-50 transition-opacity outline-none z-10 hidden md:block"
              >
                <ArrowLeft className="w-8 h-8" strokeWidth={1} />
              </button>
              
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                src={images[activeImage]} 
                alt={`${product.name} Full View`}
                className="max-h-[90vh] max-w-full object-contain cursor-default"
              />
              
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev === images.length - 1 ? 0 : prev + 1)); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 hover:opacity-50 transition-opacity outline-none z-10 hidden md:block"
              >
                <ArrowRight className="w-8 h-8" strokeWidth={1} />
              </button>
            </div>
            
            <div className="p-6 flex justify-center gap-4 z-10 bg-white">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={(e) => { e.stopPropagation(); setActiveImage(i); }}
                  className={`w-16 aspect-[4/5] bg-[#FAFAFA] overflow-hidden transition-all duration-300 ${activeImage === i ? 'ring-1 ring-ash ring-offset-4' : 'opacity-40 hover:opacity-100'}`}
                >
                  <img loading="lazy" decoding="async" src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {showStickyPanel && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-ash-light z-[40] py-4 px-6 md:px-12 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-6">
              <img loading="lazy" decoding="async" src={images[0]} alt={product.name} className="w-12 h-16 object-cover hidden sm:block bg-white" />
              <div>
                <h4 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">{product.name}</h4>
                <p className="text-sm font-serif italic text-ash-muted">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</p>
              </div>
            </div>
            <button 
              onClick={() => {
                useCartStore.getState().addItem(product);
                useCartStore.getState().openCart();
              }}
              className="bg-ash text-white px-8 md:px-12 py-4 uppercase tracking-[0.2em] text-[10px] font-sans font-medium hover:bg-ash/90 luxury-transition outline-none"
            >
              Add to Bag
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Suspense fallback={null}>
          <ProductCarousel 
            title="Complete The Look" 
            subtitle="Frequently Bought Together"
            products={relatedProducts} 
            viewAllLink={`/shop?category=${product.category}`} 
          />
        </Suspense>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 1 && (
        <Suspense fallback={null}>
          <ProductCarousel 
            title="Recently Viewed" 
            products={recentlyViewed.filter(p => p.id !== product.id)} 
            viewAllLink="/account" 
            dark={true}
          />
        </Suspense>
      )}
    </div>
  )
}

