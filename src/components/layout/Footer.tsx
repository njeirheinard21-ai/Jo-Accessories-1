import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-ash text-white pt-24 md:pt-32 pb-16 selection:bg-white selection:text-ash">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24 md:mb-32">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="typography-display-md mb-8 text-white uppercase tracking-widest">
                JO ACCESSORIES
              </h3>
              <p className="typography-body text-ash-muted mb-10 max-w-sm">
                Defining the future of luxury fashion through uncompromising quality, timeless design, and continuous innovation.
              </p>
            </div>
            
            <div className="mt-8 md:mt-auto">
              <p className="typography-label mb-4 text-white">The Inner Circle</p>
              <form className="relative max-w-sm mb-12" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  className="w-full bg-transparent border-b border-white/20 focus:border-white py-3 px-0 typography-label outline-none transition-colors placeholder:text-ash-muted"
                />
                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-2 -mr-2 typography-label hover:text-ash-muted transition-colors">
                  Join
                </button>
              </form>
              <div className="flex items-center gap-8">
                <a href="https://instagram.com" className="p-2 -ml-2 text-ash-muted hover:text-white luxury-transition outline-none"  target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5" strokeWidth={1} />
                </a>
                <a href="https://youtube.com" className="p-2 text-ash-muted hover:text-white luxury-transition outline-none"  target="_blank" rel="noopener noreferrer">
                  <Youtube className="w-5 h-5" strokeWidth={1} />
                </a>
                <a href="https://facebook.com" className="p-2 text-ash-muted hover:text-white luxury-transition outline-none"  target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-5 h-5" strokeWidth={1} />
                </a>
                <a href="https://twitter.com" className="p-2 text-ash-muted hover:text-white luxury-transition outline-none"  target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-5 h-5" strokeWidth={1} />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-12 lg:pl-16">
            <div>
              <h4 className="typography-label mb-8 text-white">SHOP</h4>
              <ul className="flex flex-col gap-5 typography-body text-ash-muted">
                <li><Link to="/shop?sort=newest" className="hover:text-white luxury-transition outline-none">New Arrivals</Link></li>
                <li><Link to="/shop?category=women" className="hover:text-white luxury-transition outline-none">Women</Link></li>
                <li><Link to="/shop?category=bags" className="hover:text-white luxury-transition outline-none">Bags</Link></li>
                <li><Link to="/shop?category=accessories" className="hover:text-white luxury-transition outline-none">Accessories</Link></li>
                <li><Link to="/shop?category=designers" className="hover:text-white luxury-transition outline-none">Designers</Link></li>
                <li><Link to="/shop?category=sale" className="hover:text-white luxury-transition outline-none">Sale</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="typography-label mb-8 text-white">CUSTOMER CARE</h4>
              <ul className="flex flex-col gap-5 typography-body text-ash-muted">
                <li><Link to="/contact" className="hover:text-white luxury-transition outline-none">Contact Us</Link></li>
                <li><Link to="/track-order" className="hover:text-white luxury-transition outline-none">Track Order</Link></li>
                <li><Link to="/returns" className="hover:text-white luxury-transition outline-none">Returns & Exchanges</Link></li>
                <li><Link to="/shipping" className="hover:text-white luxury-transition outline-none">Shipping Information</Link></li>
                <li><Link to="/faq" className="hover:text-white luxury-transition outline-none">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="typography-label mb-8 text-white">ABOUT</h4>
              <ul className="flex flex-col gap-5 typography-body text-ash-muted">
                <li><Link to="/about" className="hover:text-white luxury-transition outline-none">Our Story</Link></li>
                <li><Link to="/sustainability" className="hover:text-white luxury-transition outline-none">Sustainability</Link></li>
                <li><Link to="/careers" className="hover:text-white luxury-transition outline-none">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="typography-label mb-8 text-white">LEGAL</h4>
              <ul className="flex flex-col gap-5 typography-body text-ash-muted">
                <li><Link to="/terms" className="hover:text-white luxury-transition outline-none">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-white luxury-transition outline-none">Privacy Policy</Link></li>
                <li><Link to="/cookie-policy" className="hover:text-white luxury-transition outline-none">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between typography-caption uppercase font-semibold text-ash-muted">
          <p>&copy; {new Date().getFullYear()} JO ACCESSORIES. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6 mt-6 md:mt-0">
             <button className="hover:text-white luxury-transition outline-none">United States (USD)</button>
             <button className="hover:text-white luxury-transition outline-none">English</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
