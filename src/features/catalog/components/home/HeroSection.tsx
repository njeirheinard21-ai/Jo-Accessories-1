import { Link } from "react-router-dom"
import { motion } from "motion/react"

export function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-ash">
      {/* Background Campaign Image */}
      <motion.div 
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Desktop Image */}
        <img 
          loading="eager" 
          fetchPriority="high"
          src="https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/Jo%20Access%20Folder%2FChatGPT%20Image%20Aug%2010%2C%202026%2C%2007_08_10%20PM.png?alt=media&token=72939d05-4be2-421f-ac49-917a894366c0" 
          alt="Spring Summer Campaign" 
          className="w-full h-full object-cover object-center hidden md:block"
        />
        {/* Mobile Image (Alternative crop or separate mobile asset if available, using the detail view as mobile fallback for now) */}
        <img 
          loading="eager" 
          fetchPriority="high"
          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1738&auto=format&fit=crop" 
          alt="Spring Summer Campaign Mobile" 
          className="w-full h-full object-cover object-center block md:hidden"
        />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 md:pb-32 px-6 text-white text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col items-center"
        >
          <span className="typography-label tracking-[0.3em] mb-4 md:mb-6">
            COLLECTION
          </span>
          
          <h2 className="typography-display-lg md:text-7xl lg:text-[7rem] mb-8 md:mb-10 text-balance leading-none max-w-4xl mx-auto">
            THE NEW EXPRESSION
          </h2>
          
          <p className="typography-body text-white/80 max-w-md mx-auto mb-10 md:mb-12">
            Discover the latest collection
          </p>
          
          <Link 
            to="/shop?collection=spring-summer" 
            className="group inline-flex flex-col items-center gap-2 outline-none"
          >
            <span className="typography-label border-b border-transparent group-hover:border-white transition-colors duration-300 pb-1">
              EXPLORE COLLECTION
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

