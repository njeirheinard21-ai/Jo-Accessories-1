import { memo } from "react"
import { Link } from "react-router-dom"
import { Product } from "../core/domain/Product"
import { useCartStore } from "../stores/cartStore"
import { Plus, ArrowRight } from "lucide-react"

interface FeaturedProductProps extends Partial<Product> {
  id: string
  name: string
  price: number
  image: string
  description?: string
  category?: string
  isNew?: boolean
}

export const FeaturedProductCard = memo(function FeaturedProductCard({ id, name, price, image, description, category, isNew, ...product }: FeaturedProductProps) {
  const { addItem, openCart } = useCartStore()
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, name, price, image, quantity: 1, ...product } as Product);
    openCart();
  };

  return (
    <Link to={`/product/${id}`} className="group block relative cursor-pointer outline-none">
      <div className="relative overflow-hidden bg-[#FAFAFA] aspect-[4/5] md:aspect-[16/9] lg:aspect-[16/9]">
        {isNew && (
          <span className="absolute top-6 left-6 z-20 text-[9px] font-sans font-semibold tracking-[0.2em] uppercase text-ash bg-white/90 px-4 py-2 backdrop-blur-sm">
            New Arrival
          </span>
        )}
        
        {/* Main Image with Zoom on Hover */}
        <img loading="lazy" decoding="async" 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
        
        {/* Overlay Darkening */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] z-10" />

        {/* Info Panel sliding in or appearing */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 flex flex-col justify-end opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1 text-white">
              {category && (
                <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] mb-3 text-white/80">
                  {category}
                </p>
              )}
              <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4 tracking-tight leading-none">
                {name}
              </h3>
              {description && (
                <p className="font-sans font-light text-sm text-white/80 max-w-md line-clamp-2 mb-2 hidden md:block">
                  {description}
                </p>
              )}
              <p className="text-lg font-serif italic text-white/90">
                ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <button 
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-3 bg-white text-ash px-8 py-4 text-[10px] font-sans font-semibold uppercase tracking-[0.2em] hover:bg-ash hover:text-white transition-colors duration-500"
              >
                <span>Add to Bag</span>
                <Plus className="w-4 h-4" strokeWidth={1.5} />
              </button>
              
              <div className="flex items-center justify-center gap-3 border border-white/30 text-white px-8 py-4 text-[10px] font-sans font-semibold uppercase tracking-[0.2em] hover:bg-white hover:text-ash transition-colors duration-500 backdrop-blur-sm">
                <span>View Details</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
})
