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
    addItem({ id, name, price, image, quantity: 1, ...product } as unknown as Product);
    openCart();
  };

  return (
    <Link to={`/product/${id}`} className="group block relative cursor-pointer outline-none w-full">
      <div className="relative overflow-hidden bg-ash-light/20 aspect-[3/4] md:aspect-[16/9] w-full">
        {isNew && (
          <span className="absolute top-6 left-6 z-20 typography-label bg-white text-ash px-4 py-2">
            NEW ARRIVAL
          </span>
        )}
        
        {/* Main Image */}
        <img 
          loading="lazy" 
          decoding="async" 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
        
        {/* Overlay Darkening */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] z-10" />

        {/* Info Panel */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 flex flex-col justify-end opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1 text-white">
              {category && (
                <p className="typography-label mb-3 text-white/80">
                  {category}
                </p>
              )}
              <h3 className="typography-display-sm md:text-5xl lg:text-6xl mb-4 tracking-tight leading-none">
                {name}
              </h3>
              {description && (
                <p className="typography-body text-white/80 max-w-md line-clamp-2 mb-4 hidden md:block">
                  {description}
                </p>
              )}
              <p className="typography-caption italic text-white text-base">
                ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <button 
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-3 bg-white text-ash px-8 py-4 typography-label hover:bg-ash hover:text-white luxury-transition"
              >
                <span>ADD TO BAG</span>
                <Plus className="w-4 h-4" strokeWidth={1} />
              </button>
              
              <div className="flex items-center justify-center gap-3 border border-white text-white px-8 py-4 typography-label hover:bg-white hover:text-ash luxury-transition backdrop-blur-sm">
                <span>VIEW DETAILS</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
})

