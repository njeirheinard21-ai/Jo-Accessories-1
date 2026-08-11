import { Link } from "react-router-dom"
import { Check } from "lucide-react"
import { SEO } from "../../components/SEO"

export function OrderSuccess() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 selection:bg-ash selection:text-white">
      <SEO title="Order Confirmed | Jo Accessories" />
      <div className="max-w-xl w-full text-center space-y-12">
        <div className="flex justify-center">
          <div className="w-24 h-24 border border-ash rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-ash" strokeWidth={1} />
          </div>
        </div>
        <div>
          <h1 className="font-serif text-4xl md:text-5xl uppercase tracking-widest text-ash mb-6">Order Received</h1>
          <p className="text-ash-muted font-sans font-light text-sm leading-[1.8] max-w-sm mx-auto">
            Thank you for your purchase. We have received your request and our team will be in touch shortly to finalize delivery details.
          </p>
        </div>
        <div className="py-8 border-y border-ash-light">
          <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] mb-2 text-ash">Order Reference</p>
          <p className="text-ash-muted font-sans tracking-[0.3em] uppercase">JO-{(Math.random() * 1000000).toFixed(0)}</p>
        </div>
        <div className="pt-4">
          <Link to="/shop" className="inline-block border border-ash text-ash px-12 py-4 text-[10px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-ash hover:text-white transition-colors outline-none">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
