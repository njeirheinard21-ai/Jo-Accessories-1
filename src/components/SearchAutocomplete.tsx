import { useState, useEffect } from 'react';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService, Product } from '../services/productService';
import { motion, AnimatePresence } from 'motion/react';

export function SearchAutocomplete({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setIsLoading(true);
      try {
        // Simplified search for mock/demo purposes
        const { products } = await productService.getProducts(50);
        const filtered = products.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) || 
          p.category?.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered.slice(0, 5));
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(search, 300); // Debounce
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-ash-light z-50 p-6"
    >
      <div className="container mx-auto max-w-3xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ash-muted" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, categories..."
            className="w-full pl-12 pr-12 py-4 text-lg border-b-2 border-ash focus:outline-none bg-transparent"
          />
          <button 
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ash-muted hover:text-ash"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-ash border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ash-muted mb-4">Results</h3>
              {results.map(product => (
                <div 
                  key={product.id}
                  onClick={() => {
                    navigate(`/product/${product.id}`);
                    onClose();
                  }}
                  className="flex items-center gap-4 group cursor-pointer hover:bg-white p-2 -mx-2 transition-colors"
                >
                  <div className="w-16 h-20 bg-white flex-shrink-0">
                    <img loading="lazy" decoding="async" src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium uppercase tracking-wide group-hover:text-ash-muted">{product.name}</h4>
                    <p className="text-sm text-ash-muted">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="py-8 text-center text-ash-muted">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-ash-muted mb-6 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" /> Popular Searches
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
                        className="text-left text-sm font-light text-ash-muted hover:text-ash flex items-center justify-between group"
                      >
                        <span>{term}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-ash-muted mb-6 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" /> Trending Categories
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {name: 'The Summer Tote', img: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=400&auto=format&fit=crop'},
                    {name: 'Evening Clutches', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop'},
                    {name: 'Travel Essentials', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop'}
                  ].map(cat => (
                    <div key={cat.name} onClick={() => { setQuery(cat.name); }} className="group cursor-pointer">
                      <div className="aspect-[4/3] bg-white overflow-hidden mb-3">
                        <img loading="lazy" decoding="async" src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <span className="text-[10px] font-sans font-medium uppercase tracking-[0.1em]">{cat.name}</span>
                    </div>
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
