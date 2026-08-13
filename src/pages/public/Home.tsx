import { FeaturedProductCard } from "../../components/FeaturedProductCard"
import { lazy, Suspense } from "react"
import { SEO } from "../../components/SEO"
import { mockProducts } from "../../data/mockProducts"
import { HeroSection } from "../../features/catalog/components/home/HeroSection"

const CategorySection = lazy(() => import("../../features/catalog/components/home/CategorySection").then(m => ({ default: m.CategorySection })))
const ProductCarousel = lazy(() => import("../../features/catalog/components/home/ProductCarousel").then(m => ({ default: m.ProductCarousel })))
const Newsletter = lazy(() => import("../../features/marketing/components/Newsletter").then(m => ({ default: m.Newsletter })))

export function Home() {
  const newArrivals = mockProducts.slice(0, 6);
  const bestSellers = mockProducts.slice(4, 10);
  const trending = mockProducts.slice(8, 14);

  return (
    <div className="w-full bg-white">
      <SEO title="Jo Accessories | Luxury Fashion & Cosmetics" />
      
      <HeroSection />
      
      <Suspense fallback={<div className="h-96"></div>}>
        <CategorySection />
      </Suspense>

      <Suspense fallback={<div className="h-96"></div>}>
        <div className="container mx-auto px-6 lg:px-12 pt-16 md:pt-24 pb-4 md:pb-6">
          <h2 className="text-4xl md:text-5xl font-serif uppercase tracking-tight text-center mb-12">Featured Piece</h2>
          {newArrivals.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <FeaturedProductCard {...newArrivals[0]} image="https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/Jo%20Access%20Folder%2FChatGPT%20Image%20Aug%2010%2C%202026%2C%2008_41_13%20PM.png?alt=media&token=0bcc33e8-f796-4499-bbcd-5af88fb53cd0" />
            </div>
          )}
        </div>
      </Suspense>
      
      <Suspense fallback={<div className="h-96"></div>}>
        <ProductCarousel 
          title="New Arrivals" 
          subtitle="The Latest Expressions"
          products={newArrivals} 
          viewAllLink="/shop?sort=newest" 
          className="!pt-8 md:!pt-12"
        />
        
        
        <ProductCarousel 
          title="Curated Edits" 
          subtitle="Curated By Editors"
          products={trending} 
          viewAllLink="/shop?collection=trending" 
        />
        
        
        <ProductCarousel 
          title="Best Sellers" 
          subtitle="Iconic Pieces"
          products={bestSellers} 
          viewAllLink="/shop?collection=best-sellers"
          dark={true}
        />
        
        
        
        <Newsletter />
      </Suspense>
    </div>
  )
}
