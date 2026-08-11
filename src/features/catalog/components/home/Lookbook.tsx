import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "motion/react"
import { ArrowRight } from "lucide-react"
import { useRef } from "react"

export function Lookbook() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [200, -200]);

  return (
    <section ref={containerRef} className="py-32 lg:py-48 bg-[#FAFAFA] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <p className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase mb-8 text-ash">Editorial Features</p>
            <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-serif tracking-tight text-ash leading-[0.9] uppercase text-balance">
              The <br/><span className="italic text-ash-muted font-light capitalize">Art</span> Of Details
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:pb-4"
          >
            <Link 
              to="/shop" 
              className="group inline-flex items-center gap-6 bg-transparent border-b border-ash/30 pb-3 hover:border-ash transition-colors duration-500 text-ash"
            >
              <span className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase">Discover the Editorial</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          
          <div className="lg:col-span-4 flex flex-col justify-end pt-12 lg:pt-0">
            <motion.div 
              style={{ y: y1 }}
              className="aspect-[4/5] overflow-hidden group  bg-white"
            >
              <img loading="lazy" decoding="async" 
                src="https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1887&auto=format&fit=crop" 
                alt="Lookbook Detail" 
                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
            </motion.div>
            <div className="mt-6">
              <h3 className="text-sm font-sans font-medium uppercase tracking-[0.1em] mb-2">Modern Silhouettes</h3>
              <p className="text-sm font-serif italic text-ash-muted">Vol. 01</p>
            </div>
          </div>
          
          <div className="lg:col-span-8 relative">
            <motion.div 
              style={{ y: y2 }}
              className="aspect-[16/10] overflow-hidden group  bg-white"
            >
              <img loading="lazy" decoding="async" 
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1738&auto=format&fit=crop" 
                alt="Lookbook Main" 
                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
            </motion.div>
            <div className="absolute -bottom-16 -right-4 lg:-right-12 bg-white p-6 lg:p-12 border border-ash-light max-w-[300px] z-10 hidden md:block">
               <p className="text-ash-muted font-sans font-light text-sm leading-[1.8]">
                Discover the meticulous craftsmanship behind our latest collection. Every stitch, every fold, every material chosen to elevate your everyday elegance.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
