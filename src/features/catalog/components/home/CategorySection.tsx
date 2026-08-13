import { Link } from "react-router-dom"
import { motion } from "motion/react"

const categories = [
  {
    title: "Handbags",
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop",
    to: "/shop?category=bags"
  },
  {
    title: "Footwear",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    to: "/shop?category=shoes"
  },
  {
    title: "Accessories",
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop",
    to: "/shop?category=accessories"
  }
]

export function CategorySection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl md:text-5xl font-serif uppercase tracking-tight text-ash">Explore Categories</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <Link key={category.title} to={category.to} className="group block relative overflow-hidden aspect-[4/5] outline-none">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                <img 
                  loading="lazy" decoding="async" 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/30" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="typography-display-sm text-white mb-2 uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">{category.title}</h3>
                  <span className="text-[10px] text-white uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 border-b border-white w-max pb-1">Shop Now</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
