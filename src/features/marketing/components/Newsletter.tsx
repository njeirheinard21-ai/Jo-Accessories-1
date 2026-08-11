import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"

export function Newsletter() {
  return (
    <section className="bg-\[#FAFAFA\] text-foreground py-32 lg:py-48 selection:bg-ash selection:text-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase mb-8 text-ash">Private Client</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif uppercase tracking-tight mb-8">The Inner Circle</h2>
            <p className="text-ash-muted font-sans font-light text-sm md:text-base mb-12 leading-[1.8]">
              Subscribe to receive exclusive access to limited releases, private sales, and the latest editorial content.
            </p>
            
            <form className="relative w-full max-w-md mx-auto group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-transparent border-b border-ash/30 focus:border-ash py-4 px-0 text-[10px] font-sans tracking-[0.2em] font-semibold outline-none transition-colors uppercase placeholder:text-ash-muted"
                required
              />
              <button 
                type="submit" 
                className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-ash hover:opacity-50 transition-opacity outline-none"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-5 h-5 transform group-focus-within:translate-x-1 luxury-transition" strokeWidth={1.5} />
              </button>
            </form>
            <p className="text-[10px] text-ash-muted mt-8 tracking-[0.1em] uppercase">
              By subscribing, you agree to our <a href="#" className="underline hover:text-ash transition-colors">Privacy Policy</a> and <a href="#" className="underline hover:text-ash transition-colors">Terms of Service</a>.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
