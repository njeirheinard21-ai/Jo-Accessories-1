import { memo, useState } from "react"
import { Link } from "react-router-dom"
import { Product } from "../core/domain/Product"
import { useCartStore } from "../stores/cartStore"
import { Plus, Heart } from "lucide-react"

interface ProductProps extends Partial<Product> {
  id: string
  name: string
  price: number
  compareAtPrice?: number
  image: string
  hoverImage?: string
  brand?: string
  isNew?: boolean
  large?: boolean
  colors?: string[]
}

export const ProductCard = memo(function ProductCard({ id, name, price, compareAtPrice, image, hoverImage, brand = "JO Accessories", isNew, large, colors, ...product }: ProductProps) {
  const { addItem, openCart } = useCartStore()
  const [isWishlisted, setIsWishlisted] = useState(false)
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, image, quantity: 1, ...product } as Product);
    openCart();
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted)
  };

  return (
    <Link to={`/product/${id}`} className="group block relative cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2">
      <div className={`relative overflow-hidden bg-ash-light/20 aspect-[3/4] mb-4`}>
        {isNew && (
          <span className="absolute top-4 left-4 z-20 typography-label text-ash bg-white/80 px-2 py-1">
            NEW
          </span>
        )}
        
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 z-20 p-3 text-ash hover:opacity-70 transition-opacity"
          aria-label="Add to wishlist"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} strokeWidth={1} />
        </button>

        <img loading="lazy" decoding="async" 
          src={image} 
          alt={name} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hoverImage ? "group-hover:opacity-0" : "group-hover:scale-[1.03]"}`}
        />
        
        {hoverImage && (
          <img loading="lazy" decoding="async" 
            src={hoverImage} 
            alt={`${name} detail`} 
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] scale-[1.03]"
          />
        )}
        
        {/* Hover action */}
        <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-20">
          <button 
            onClick={handleAddToCart}
            className="flex items-center justify-between w-full bg-white/95 backdrop-blur-sm px-6 py-4 typography-label hover:bg-ash hover:text-white luxury-transition shadow-sm"
          >
            <span>ADD TO BAG</span>
            <Plus className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col text-left px-1">
        {brand && <p className="typography-caption uppercase tracking-wider text-ash-muted mb-1">{brand}</p>}
        <h3 className="typography-body text-ash mb-1 truncate">{name}</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <p className="typography-price text-ash">${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            {compareAtPrice && compareAtPrice > price && (
              <p className="typography-price text-ash-muted line-through text-xs">${compareAtPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            )}
          </div>
          
          {colors && colors.length > 0 && (
            <div className="flex gap-1">
              {colors.slice(0, 3).map((color, idx) => (
                <div key={idx} className="w-2.5 h-2.5 rounded-full border border-ash/20" style={{ backgroundColor: color }} />
              ))}
              {colors.length > 3 && <span className="typography-caption text-[8px] ml-1">+{colors.length - 3}</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
})

