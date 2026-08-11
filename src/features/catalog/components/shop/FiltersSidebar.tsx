import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Check, ChevronDown, X } from "lucide-react"

interface FiltersSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function FiltersSidebar({ isOpen, onClose }: FiltersSidebarProps) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('category')

  const toggleAccordion = (id: string) => {
    setActiveAccordion(prev => prev === id ? null : id)
  }

  const filterSections = [
    {
      id: 'category',
      title: 'Category',
      options: ['Bags', 'Cosmetics', 'Accessories', 'Small Leather Goods']
    },
    {
      id: 'brand',
      title: 'Brand',
      options: ['Prada', 'Gucci', 'Saint Laurent', 'Bottega Veneta', 'Loewe']
    },
    {
      id: 'color',
      title: 'Color',
      options: ['Black', 'White', 'Beige', 'Red', 'Blue', 'Green', 'Brown']
    },
    {
      id: 'material',
      title: 'Material',
      options: ['Leather', 'Canvas', 'Suede', 'Nylon', 'Exotic']
    }
  ]

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
            <button onClick={onClose}><X className="w-5 h-5 text-ash-muted" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 lg:p-0">
            {/* Active Filters */}
            <div className="mb-8 hidden lg:block">
               <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] mb-4">Filters</h3>
               {/* Example active filter tags */}
               <div className="flex flex-wrap gap-2">
                 <span className="inline-flex items-center gap-1 bg-white px-3 py-1 text-[10px] font-sans uppercase tracking-[0.2em]">
                   Bags <X className="w-3 h-3 cursor-pointer" />
                 </span>
                 <button className="text-xs text-ash-muted underline ml-2 hover:text-ash">Clear All</button>
               </div>
            </div>

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
                                  {/* Dummy logic for checked state */}
                                  {option === 'Bags' && <Check className="w-3 h-3 text-ash" />}
                                </div>
                                <span className="text-sm text-ash-muted group-hover:text-ash transition-colors">{option}</span>
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
                      <div className="mt-6 flex items-center gap-4">
                        <div className="flex-1 border border-ash-light p-2">
                          <span className="text-xs text-ash-muted block mb-1">Min</span>
                          <input type="number" placeholder="$0" className="w-full text-sm outline-none bg-transparent" />
                        </div>
                        <div className="flex-1 border border-ash-light p-2">
                          <span className="text-xs text-ash-muted block mb-1">Max</span>
                          <input type="number" placeholder="$5000+" className="w-full text-sm outline-none bg-transparent" />
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
              Show Results (124)
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
