import { motion } from "motion/react"

export function BrandStory() {
  return (
    <section className="bg-ash text-white py-32 md:py-48 overflow-hidden relative selection:bg-white selection:text-ash">
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start max-w-xl"
          >
            <p className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase mb-12 text-ash-muted">
              The Heritage
            </p>
            
            <h2 className="text-5xl md:text-6xl lg:text-[5.5rem] font-serif tracking-tight mb-12 leading-[0.9] uppercase text-balance">
              Crafting The Future Of <span className="italic text-ash-muted font-light capitalize">Luxury</span>
            </h2>
            
            <div className="space-y-6 text-ash-muted font-sans font-light text-sm md:text-base leading-[1.9]">
              <p>
                Founded on the principles of uncompromising quality and timeless design, 
                Jo Accessories bridges the gap between classic elegance and contemporary edge.
              </p>
              <p>
                Every piece is a testament to the artistry of modern fashion, designed to empower and inspire.
              </p>
            </div>
          </motion.div>

          <div className="relative h-[60vh] lg:h-[80vh] w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-10"
            >
              <img loading="lazy" decoding="async" 
                src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1974&auto=format&fit=crop" 
                alt="Craftsmanship" 
                className="w-full h-full object-cover grayscale-[30%] contrast-125"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -left-8 md:-left-16 bottom-16 z-20 w-48 md:w-64 aspect-square bg-ash p-4 hidden sm:block border border-white/10"
            >
              <img loading="lazy" decoding="async" 
                src="https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=1974&auto=format&fit=crop" 
                alt="Material Detail" 
                className="w-full h-full object-cover grayscale brightness-75"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
