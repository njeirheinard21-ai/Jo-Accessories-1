import { memo } from "react"
import { Link } from "react-router-dom"
import { Product } from "../core/domain/Product"
import { useCartStore } from "../stores/cartStore"
import { Plus } from "lucide-react"

interface ProductProps extends Partial<Product> {
  id: string
  name: string
  price: number
  image: string
  isNew?: boolean
  large?: boolean
}

export const ProductCard = memo(function ProductCard({ id, name, price, image, isNew, large, ...product }: ProductProps) {
  const { addItem, openCart } = useCartStore()
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, name, price, image, quantity: 1, ...product } as Product);
    openCart();
  };

  return (
    <Link to={`/product/${id}`} className="group block relative cursor-pointer outline-none">
      <div className={`relative overflow-hidden bg-[#FAFAFA] ${large ? 'aspect-[3/4]' : 'aspect-[3/4]'} mb-5`}>
        {isNew && (
          <span className="absolute top-4 left-4 z-10 text-[9px] font-sans font-semibold tracking-[0.2em] uppercase text-ash">
            New
          </span>
        )}
        <img loading="lazy" decoding="async" 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
        
        {/* Hover action - Minimal line button */}
        <div className="absolute inset-x-0 bottom-0 p-6 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-20">
          <button 
            onClick={handleAddToCart}
            className="flex items-center justify-between w-full bg-white/95 px-6 py-4 text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-ash hover:bg-ash hover:text-white transition-colors duration-500 "
          >
            <span>Add to Bag</span>
            <Plus className="w-4 h-4 font-light" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center text-center">
        <h3 className="uppercase tracking-[0.15em] text-[10px] font-sans font-semibold text-foreground mb-2 w-full px-4">{name}</h3>
        <p className="text-sm font-serif italic text-muted-foreground">${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
    </Link>
  )
})
