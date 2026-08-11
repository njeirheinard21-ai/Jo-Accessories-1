import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "motion/react"
import { ArrowRight } from "lucide-react"
import { useRef } from "react"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    
    <section ref={containerRef} className="relative w-full min-h-screen bg-white overflow-hidden flex flex-col justify-end pt-32 pb-16 selection:bg-ash selection:text-white">
      <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full h-full flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end h-full">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ y: y2, opacity }}
            className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-end xl:pr-12 pb-12"
          >
            <div className="flex items-center gap-4 mb-12">
              <div className="h-[1px] w-8 bg-ash"></div>
              <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-ash font-semibold">Spring / Summer 2026</span>
            </div>
            
            <h1 className="text-6xl md:text-[6rem] lg:text-[8rem] font-serif text-ash leading-[0.85] tracking-tight mb-10 uppercase text-balance">
              The <br />
              <span className="italic font-light text-ash-muted capitalize">New</span><br />
              Elegance
            </h1>
            
            <p className="text-ash-muted font-sans font-light text-sm md:text-base leading-[1.8] max-w-sm mb-12">
              A curated exploration of form, texture, and uncompromising craftsmanship. Discover accessories designed to redefine modern sophistication.
            </p>
            
            <Link 
              to="/shop?collection=spring-summer" 
              className="group inline-flex items-center gap-6 text-ash border-b border-ash/30 pb-3 hover:border-ash transition-colors duration-500 w-max"
            >
              <span className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase">Discover the Collection</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            </Link>
          </motion.div>

          {/* Editorial Image Composition */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative h-[60vh] lg:h-[80vh] w-full flex items-end">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: y1 }}
              className="absolute right-0 top-0 w-full lg:w-[90%] h-full z-10"
            >
              <div className="w-full h-full overflow-hidden bg-white">
                <img loading="eager" fetchPriority="high" 
                  src="https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/Jo%20Access%20Folder%2FChatGPT%20Image%20Aug%2010%2C%202026%2C%2007_08_10%20PM.png?alt=media&token=72939d05-4be2-421f-ac49-917a894366c0" 
                  alt="Campaign Hero" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="absolute left-0 bottom-0 lg:-bottom-12 w-[45%] lg:w-[40%] aspect-[3/4] z-20 border border-white"
            >
              <div className="w-full h-full overflow-hidden bg-white p-2 md:p-3">
                <img loading="eager" fetchPriority="high" 
                  src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1738&auto=format&fit=crop" 
                  alt="Detail view" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>

  )
}
