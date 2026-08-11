import { motion } from "motion/react"
import { Quote } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      text: "An absolute masterclass in design and quality. The attention to detail is unparalleled in modern fashion.",
      author: "Vogue",
      role: "Editorial Review"
    },
    {
      text: "Jo Accessories redefines what it means to carry a luxury piece everyday. Truly spectacular craftsmanship.",
      author: "Harper's Bazaar",
      role: "Style Guide"
    },
    {
      text: "The perfect balance of timeless elegance and contemporary functionality. A must-have for the modern wardrobe.",
      author: "GQ",
      role: "Fashion Editor"
    }
  ]

  return (
    <section className="py-32 lg:py-48 bg-white border-t border-ash-light selection:bg-ash selection:text-white">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24 md:mb-32"
        >
          <p className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase mb-8 text-ash">In The Press</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight text-ash uppercase">Acclaimed by Experts</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 max-w-7xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-10 w-8 h-[1px] bg-ash/20 group-hover:bg-ash transition-colors duration-500"></div>
              <p className="text-lg md:text-xl font-serif text-ash leading-[1.9] mb-10 flex-1 italic text-balance">
                "{testimonial.text}"
              </p>
              <div>
                <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase mb-2 text-ash">{testimonial.author}</p>
                <p className="text-[10px] font-sans text-ash-muted uppercase tracking-[0.15em] font-light">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
