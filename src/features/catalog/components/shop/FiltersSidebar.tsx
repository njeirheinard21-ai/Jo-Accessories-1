import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Check, ChevronDown, X } from "lucide-react"
import { useSearchParams } from "react-router-dom"

interface FiltersSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function FiltersSidebar({ isOpen, onClose }: FiltersSidebarProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeAccordion, setActiveAccordion] = useState<string | null>('category')

  const toggleAccordion = (id: string) => {
    setActiveAccordion(prev => prev === id ? null : id)
  }

  const activeCategory = searchParams.get('category');
  const brandsParam = searchParams.get('brands');
  const activeBrands = brandsParam ? brandsParam.split(',') : [];
  
  const colorsParam = searchParams.get('colors');
  const activeColors = colorsParam ? colorsParam.split(',') : [];

  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const filterSections = [
    {
      id: 'category',
      title: 'Category',
      options: ['Bags', 'Shoes', 'Cosmetics', 'Accessories', 'Small Leather Goods'],
      activeItems: activeCategory ? [activeCategory] : [],
      onToggle: (opt: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (activeCategory === opt) {
          newParams.delete('category');
        } else {
          newParams.set('category', opt);
        }
        setSearchParams(newParams);
      }
    },
    {
      id: 'brands',
      title: 'Brand',
      options: ['Prada', 'Gucci', 'Saint Laurent', 'Bottega Veneta', 'Loewe', 'JO Accessories'],
      activeItems: activeBrands,
      onToggle: (opt: string) => {
        const newParams = new URLSearchParams(searchParams);
        let newBrands = [...activeBrands];
        if (newBrands.includes(opt)) {
          newBrands = newBrands.filter(b => b !== opt);
        } else {
          newBrands.push(opt);
        }
        if (newBrands.length > 0) {
          newParams.set('brands', newBrands.join(','));
        } else {
          newParams.delete('brands');
        }
        setSearchParams(newParams);
      }
    }
  ]

  const activeFilterCount = (activeCategory ? 1 : 0) + activeBrands.length + activeColors.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  const clearAll = () => {
    const newParams = new URLSearchParams();
    if (searchParams.get('sort')) newParams.set('sort', searchParams.get('sort')!);
    setSearchParams(newParams);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ash/40 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <div className={`
        fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white shadow-2xl transform transition-transform duration-500 ease-in-out lg:relative lg:transform-none lg:shadow-none lg:z-auto lg:w-64 shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-ash-light lg:hidden">
            <h2 className="font-serif uppercase tracking-[0.1em] text-xl">Filters</h2>
            <button onClick={onClose} className="p-2 -mr-2 outline-none focus-visible:ring-1 focus-visible:ring-ash"><X className="w-5 h-5 text-ash-muted" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 lg:p-0">
            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em]">Active Filters</h3>
                  <button onClick={clearAll} className="text-[10px] uppercase tracking-widest text-ash-muted underline hover:text-ash transition-colors">Clear</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeCategory && (
                    <span className="inline-flex items-center gap-1 bg-ash-light/20 px-3 py-1.5 text-[9px] font-sans uppercase tracking-[0.2em] text-ash">
                      {activeCategory} <button onClick={() => filterSections[0].onToggle(activeCategory)} className="p-1 -mr-1 outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-1"><X className="w-3 h-3 hover:opacity-50" /></button>
                    </span>
                  )}
                  {activeBrands.map(b => (
                    <span key={b} className="inline-flex items-center gap-1 bg-ash-light/20 px-3 py-1.5 text-[9px] font-sans uppercase tracking-[0.2em] text-ash">
                      {b} <button onClick={() => filterSections[1].onToggle(b)} className="p-1 -mr-1 outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-1"><X className="w-3 h-3 hover:opacity-50" /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Accordions */}
            <div className="space-y-6">
              {filterSections.map((section) => (
                <div key={section.id} className="border-b border-ash-light pb-4">
                  <button 
                    onClick={() => toggleAccordion(section.id)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em]">{section.title}</span>
                    <ChevronDown className={`w-4 h-4 text-ash-muted transition-transform ${activeAccordion === section.id ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === section.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-4 space-y-3">
                          {section.options.map(option => (
                            <li key={option}>
                              <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="w-4 h-4 border border-ash-light flex items-center justify-center group-hover:border-ash transition-colors">
                                  {section.activeItems.includes(option) && <Check className="w-3 h-3 text-ash" />}
                                </div>
                                <span className="text-sm text-ash-muted group-hover:text-ash transition-colors">{option}</span>
                                {/* Hidden checkbox to make it accessible */}
                                <input type="checkbox" className="hidden" checked={section.activeItems.includes(option)} onChange={() => section.onToggle(option)} />
                              </label>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Price Range */}
              <div className="border-b border-ash-light pb-4">
                <button 
                  onClick={() => toggleAccordion('price')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em]">Price</span>
                  <ChevronDown className={`w-4 h-4 text-ash-muted transition-transform ${activeAccordion === 'price' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'price' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 border border-ash-light p-2">
                            <span className="text-[9px] uppercase tracking-widest text-ash-muted block mb-1">Min</span>
                            <input 
                              type="number" 
                              placeholder="$0" 
                              className="w-full text-sm outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2 bg-transparent"
                              value={minPrice}
                              onChange={e => {
                                const newParams = new URLSearchParams(searchParams);
                                if (e.target.value) newParams.set('minPrice', e.target.value);
                                else newParams.delete('minPrice');
                                setSearchParams(newParams);
                              }}
                            />
                          </div>
                          <div className="flex-1 border border-ash-light p-2">
                            <span className="text-[9px] uppercase tracking-widest text-ash-muted block mb-1">Max</span>
                            <input 
                              type="number" 
                              placeholder="$5000+" 
                              className="w-full text-sm outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2 bg-transparent"
                              value={maxPrice}
                              onChange={e => {
                                const newParams = new URLSearchParams(searchParams);
                                if (e.target.value) newParams.set('maxPrice', e.target.value);
                                else newParams.delete('maxPrice');
                                setSearchParams(newParams);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-ash-light lg:hidden">
            <button onClick={onClose} className="w-full bg-ash text-white py-4 text-[10px] font-sans font-semibold uppercase tracking-[0.2em]">
              Apply & Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
