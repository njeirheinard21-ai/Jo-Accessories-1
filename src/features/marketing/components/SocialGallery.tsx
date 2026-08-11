import { motion } from "motion/react"
import { Instagram } from "lucide-react"

const images = [
  "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599643478524-fb66f70a00ea?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop"
]

export function SocialGallery() {
  return (
    <section className="py-32 md:py-48 bg-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 mb-24 lg:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center max-w-2xl mx-auto"
        >
          <Instagram className="w-5 h-5 mb-8 text-ash" strokeWidth={1} />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight text-ash mb-6 uppercase">The Jo Accessories World</h2>
          <p className="text-[10px] text-ash-muted font-sans font-semibold uppercase tracking-[0.25em]">Follow @joaccessories for daily inspiration</p>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {images.map((img, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative cursor-pointer ${idx % 2 === 1 ? 'md:mt-16' : ''}`}
            >
              <div className="aspect-[4/5] overflow-hidden bg-white ">
                <img loading="lazy" decoding="async" 
                  src={img} 
                  alt="Social Inspiration" 
                  className="w-full h-full object-cover filter grayscale-[10%] group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
                <div className="absolute inset-0 bg-ash/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center">
                   <span className="text-[10px] text-white font-sans font-semibold uppercase tracking-[0.2em] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                     Discover the Look
                   </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
