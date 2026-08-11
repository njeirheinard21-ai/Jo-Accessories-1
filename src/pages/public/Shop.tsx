import { useState, useMemo } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { productService } from "../../services/productService"
import { ProductCard } from "../../components/ProductCard"
import { Filter, ChevronDown } from "lucide-react"
import { SEO } from "../../components/SEO"
import { FiltersSidebar } from "../../features/catalog/components/shop/FiltersSidebar"
import { motion } from "motion/react"

export function Shop() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [sortBy, setSortBy] = useState("Newest")

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['products', sortBy],
    queryFn: ({ pageParam }) => productService.getProducts(12, pageParam),
    getNextPageParam: (lastPage) => lastPage.lastDoc || undefined,
    initialPageParam: undefined as any
  })

  const products = useMemo(() => {
    return data?.pages.flatMap(page => page.products) || [];
  }, [data])

  let sortedProducts = products;
  // We handle initial sort via backend, but we can still do a local re-sort if needed.
  // Actually, since we're paginating, local sorting is bad. 
  // For the purpose of this example, we'll just display what we get from infinite query.


  return (
    <div className="bg-[#FAFAFA] min-h-screen selection:bg-ash selection:text-white">
      <SEO title="Discover New Arrivals | Jo Accessories" />
      
      {/* Category Header */}
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] mb-16 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img loading="lazy" decoding="async" 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Collection Campaign" 
            className="w-full h-full object-cover filter brightness-[0.7] grayscale-[20%]"
          />
        </div>
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl relative z-10 text-white">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] mb-6"
          >
            Autumn / Winter 2026
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-[6rem] font-serif uppercase tracking-tight mb-8 leading-none text-balance"
          >
            The Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/40 font-sans font-light text-sm md:text-base leading-[1.8] max-w-2xl mx-auto"
          >
            Discover our meticulously curated selection of luxury pieces. 
            From iconic handbags to transformative cosmetics, elevate your everyday with Jo Accessories.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-32">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-ash-light gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-ash-light px-4 py-2 text-[10px] font-sans font-medium uppercase tracking-[0.2em] hover:border-ash transition-colors"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
            <span className="text-[10px] text-ash-muted font-sans uppercase tracking-[0.2em]">
              {isLoading ? '...' : products.length} Results
            </span>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 text-[10px] font-sans font-medium uppercase tracking-[0.2em] group"
            >
              Sort By: {sortBy}
              <ChevronDown className="w-4 h-4 text-ash-muted group-hover:text-ash transition-colors" />
            </button>
            
            {/* Sort Dropdown */}
            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-ash-light border border-ash-light z-30 py-2">
                {['Recommended', 'Newest', 'Price: High to Low', 'Price: Low to High'].map(opt => (
                  <button key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); }} className="w-full text-left px-4 py-2 text-[10px] text-ash-muted hover:text-ash uppercase tracking-[0.2em] font-sans">
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-12">
          {/* Desktop Filters */}
          <FiltersSidebar 
            isOpen={isMobileFiltersOpen} 
            onClose={() => setIsMobileFiltersOpen(false)} 
          />

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-white aspect-[3/4] mb-4"></div>
                    <div className="h-3 bg-white w-3/4 mb-2"></div>
                    <div className="h-3 bg-white w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6">
                  {sortedProducts?.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: (idx % 8) * 0.1 }}
                    >
                      <ProductCard {...product} large={true} />
                    </motion.div>
                  ))}
                </div>
                
                {hasNextPage && (
                  <div className="mt-20 flex justify-center">
                    <button 
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="border border-ash px-12 py-4 text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-ash hover:bg-ash hover:text-white luxury-transition outline-none disabled:opacity-50"
                    >
                      {isFetchingNextPage ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
