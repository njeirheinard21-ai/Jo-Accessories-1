import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Linkedin, Youtube, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-ash text-white pt-32 pb-16 border-t border-white/10 selection:bg-white selection:text-ash">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-32">
          
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-3xl md:text-5xl mb-8 tracking-tight text-white leading-none">JO ACCESSORIES</h3>
              <p className="text-ash-muted font-sans text-sm md:text-base mb-10 leading-[1.8] max-w-sm font-light">
                Defining the future of luxury fashion through uncompromising quality, timeless design, and continuous innovation.
              </p>
            </div>
            
            <div className="mt-auto">
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] mb-4 text-white">The Inner Circle</p>
              <form className="relative max-w-sm mb-12" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  className="w-full bg-transparent border-b border-white/10 focus:border-white py-3 px-0 text-[10px] font-sans tracking-[0.2em] font-semibold outline-none transition-colors uppercase placeholder:text-ash-muted"
                />
                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-sans font-medium uppercase tracking-[0.2em] hover:text-ash-muted transition-colors">
                  Join
                </button>
              </form>
              <div className="flex items-center gap-6">
                <a href="#" className="text-ash-muted hover:text-white transition-colors outline-none"><Instagram className="w-5 h-5" strokeWidth={1.2} /></a>
                <a href="#" className="text-ash-muted hover:text-white transition-colors outline-none"><Youtube className="w-5 h-5" strokeWidth={1.2} /></a>
                <a href="#" className="text-ash-muted hover:text-white transition-colors outline-none"><Facebook className="w-5 h-5" strokeWidth={1.2} /></a>
                <a href="#" className="text-ash-muted hover:text-white transition-colors outline-none"><Twitter className="w-5 h-5" strokeWidth={1.2} /></a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-6">
            <div className="aspect-[3/4] w-full overflow-hidden bg-ash mb-8 hidden lg:block">
               <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop" alt="Editorial" className="w-full h-full object-cover grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-10 flex flex-col gap-12">
            <div>
              <h4 className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] mb-6 text-white">Client Services</h4>
              <ul className="flex flex-col gap-4 text-sm font-sans text-ash-muted font-light">
                <li><Link to="/" className="hover:text-white transition-colors outline-none">Contact Us</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors outline-none">Track Order</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors outline-none">Returns & Exchanges</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors outline-none">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] mb-6 text-white">The House</h4>
              <ul className="flex flex-col gap-4 text-sm font-sans text-ash-muted font-light">
                <li><Link to="/" className="hover:text-white transition-colors outline-none">Our Story</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors outline-none">Sustainability</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors outline-none">Find a Boutique</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] font-sans text-ash-muted tracking-[0.2em] uppercase font-semibold">
          <p>&copy; {new Date().getFullYear()} JO ACCESSORIES. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
             <span className="hover:text-white/60 transition-colors cursor-pointer">United States (USD)</span>
             <span className="hover:text-white/60 transition-colors cursor-pointer">English</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
