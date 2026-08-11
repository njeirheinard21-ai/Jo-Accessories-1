import { useRef, memo } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "motion/react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "../../../../components/ProductCard"
import { Product } from "../../../../core/domain/Product"

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink: string;
  dark?: boolean;
  className?: string;
}

export const ProductCarousel = memo(function ProductCarousel({ title, subtitle, products, viewAllLink, dark = false, className }: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const bgClass = dark ? 'bg-ash text-white' : 'bg-[#FAFAFA] text-ash';
  const headingClass = dark ? 'text-white' : 'text-ash';
  const borderClass = dark ? 'border-white/10' : 'border-ash-light';
  const btnClass = dark ? 'border-white/20 hover:border-white' : 'border-ash/30 hover:border-ash';
  const navBtnClass = dark ? 'border border-white/20 text-white hover:bg-white hover:text-ash' : 'border border-ash-light text-ash hover:bg-ash hover:text-white';

  return (
    <section className={`py-20 lg:py-32 ${bgClass} selection:bg-ash selection:text-white ${className || ''}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-end justify-between mb-16 md:mb-24 gap-6"
        >
          <div>
            {subtitle && <p className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase mb-4 text-ash-muted">{subtitle}</p>}
            <h2 className={`text-4xl md:text-5xl lg:text-[5rem] font-serif tracking-tight leading-[0.9] uppercase ${headingClass}`}>{title}</h2>
          </div>
          
          <div className="flex items-center gap-8">
            <Link to={viewAllLink} className={`hidden md:flex items-center gap-6 border-b pb-2 luxury-transition ${btnClass}`}>
              <span className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase">Discover</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex gap-3">
              <button onClick={() => scroll('left')} className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full luxury-transition hover:scale-105 ${navBtnClass}`}>
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button onClick={() => scroll('right')} className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full luxury-transition hover:scale-105 ${navBtnClass}`}>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </motion.div>
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 lg:gap-10 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 -mx-4 px-4 md:-mx-8 md:px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="min-w-[280px] md:min-w-[380px] lg:min-w-[440px] snap-start shrink-0"
            >
              {/* ProductCard needs to be adapted or wrapped, assuming it inherits color properly or we force it */}
              <div className={dark ? '[&_h3]:text-white [&_p]:text-white/60' : ''}>
                 <ProductCard {...product} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})
