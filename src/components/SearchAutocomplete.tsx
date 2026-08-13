import { useState, useEffect } from 'react';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { productService, Product } from '../services/productService';
import { motion, AnimatePresence } from 'motion/react';

export function SearchAutocomplete({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ products: Product[], brands: string[], categories: string[] }>({ products: [], brands: [], categories: [] });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], brands: [], categories: [] });
      return;
    }

    const search = async () => {
      setIsLoading(true);
      try {
        const { products } = await productService.getProducts(100);
        const q = query.toLowerCase();
        
        const matchedProducts = products.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.category?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.tags?.some(t => t.toLowerCase().includes(q))
        );

        const matchedBrands = Array.from(new Set(products.map(p => p.brand).filter(b => b && b.toLowerCase().includes(q)))) as string[];
        const matchedCategories = Array.from(new Set(products.map(p => p.category).filter(c => c && c.toLowerCase().includes(q)))) as string[];

        setResults({
          products: matchedProducts.slice(0, 4),
          brands: matchedBrands.slice(0, 3),
          categories: matchedCategories.slice(0, 3)
        });
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(search, 300); // Debounce
    return () => clearTimeout(timer);
  }, [query]);

  const hasResults = results.products.length > 0 || results.brands.length > 0 || results.categories.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-[100] md:bg-white/95 md:backdrop-blur-md overflow-y-auto"
    >
      <div className="container mx-auto max-w-4xl px-4 py-6 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-full max-w-2xl mx-auto">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-ash-muted" strokeWidth={1.5} />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH PRODUCTS, BRANDS, CATEGORIES..."
              className="w-full pl-10 pr-12 py-4 text-xl md:text-2xl font-serif uppercase tracking-widest border-b-2 border-ash focus:outline-none bg-transparent placeholder:text-ash-muted/50"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 -mr-2 text-ash-muted hover:text-ash outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            )}
          </div>
          <button 
            onClick={onClose}
            className="md:hidden ml-4 text-[10px] uppercase tracking-widest font-sans font-semibold text-ash"
          >
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="hidden md:flex flex-col items-center justify-center p-4 hover:opacity-70 transition-opacity absolute right-6 top-6"
          >
            <X className="w-8 h-8 font-light" strokeWidth={1} />
            <span className="text-[10px] uppercase tracking-[0.2em] mt-2">Close</span>
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border border-ash border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : query && !hasResults ? (
            <div className="py-20 text-center">
              <h3 className="typography-display-sm uppercase text-ash mb-4">No results for "{query}"</h3>
              <p className="typography-body text-ash-muted mb-8">Please check your spelling or try a different term.</p>
              
              <div className="flex flex-col items-center">
                <span className="typography-caption uppercase tracking-[0.2em] mb-4 text-ash">Try exploring:</span>
                <div className="flex flex-wrap justify-center gap-4">
                  {['Bags', 'New Arrivals', 'Best Sellers'].map(suggestion => (
                    <Link 
                      key={suggestion} 
                      to={`/shop?category=${suggestion === 'Bags' ? 'Bags' : ''}`}
                      onClick={onClose}
                      className="border border-ash-light px-6 py-3 text-[10px] uppercase tracking-[0.2em] hover:border-ash transition-colors"
                    >
                      {suggestion}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : query && hasResults ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-5 space-y-10">
                {results.categories.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-ash-muted mb-4">Categories</h3>
                    <ul className="space-y-3">
                      {results.categories.map(c => (
                        <li key={c}>
                          <Link 
                            to={`/shop?category=${encodeURIComponent(c)}`} 
                            onClick={onClose}
                            className="typography-body uppercase hover:text-ash-muted transition-colors flex items-center justify-between group"
                          >
                            <span>{c}</span>
                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {results.brands.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-ash-muted mb-4">Brands</h3>
                    <ul className="space-y-3">
                      {results.brands.map(b => (
                        <li key={b}>
                          <Link 
                            to={`/shop?brands=${encodeURIComponent(b)}`} 
                            onClick={onClose}
                            className="typography-body uppercase hover:text-ash-muted transition-colors flex items-center justify-between group"
                          >
                            <span>{b}</span>
                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="md:col-span-7">
                {results.products.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-ash-muted mb-6">Products</h3>
                    <div className="space-y-6">
                      {results.products.map(product => (
                        <div 
                          key={product.id}
                          onClick={() => {
                            navigate(`/product/${product.id}`);
                            onClose();
                          }}
                          className="flex items-center gap-6 group cursor-pointer"
                        >
                          <div className="w-20 aspect-[3/4] bg-[#FAFAFA] overflow-hidden shrink-0">
                            <img loading="lazy" decoding="async" src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          </div>
                          <div>
                            {product.brand && <p className="typography-caption uppercase tracking-wider text-ash-muted mb-1">{product.brand}</p>}
                            <h4 className="typography-body text-ash uppercase tracking-wide mb-1">{product.name}</h4>
                            <p className="typography-price text-ash">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link 
                      to={`/shop?search=${encodeURIComponent(query)}`}
                      onClick={onClose}
                      className="mt-8 inline-block typography-label border-b border-ash pb-1 hover:text-ash-muted hover:border-ash-muted transition-colors"
                    >
                      VIEW ALL RESULTS ({results.products.length})
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
              <div>
                <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-ash-muted mb-6 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" /> Trending Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Totes', 'Crossbody', 'New Arrivals', 'Black Bags', 'Jacquemus', 'Summer Essentials'].map(term => (
                    <button 
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 border border-ash-light text-[10px] uppercase tracking-[0.1em] hover:border-ash transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-ash-muted mb-6 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Recent Searches
                </h3>
                <div className="flex flex-col gap-3">
                  {['Loewe Puzzle', 'Leather Care', 'Wallets'].map(term => (
                    <button 
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-left text-sm font-light text-ash-muted hover:text-ash flex items-center justify-between group py-2"
                    >
                      <span>{term}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
