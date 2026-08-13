import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center selection:bg-ash selection:text-white">
      <SEO title="Page Not Found | Jo Accessories" />
      <h1 className="text-[8rem] md:text-[12rem] font-serif text-ash leading-none mb-4 uppercase tracking-tighter">404</h1>
      <h2 className="text-[10px] font-sans text-ash mb-8 uppercase tracking-[0.3em] font-semibold border-y border-ash py-4 px-12 inline-block">Not Found</h2>
      <p className="text-ash-muted max-w-sm mx-auto text-sm font-sans font-light mb-12 leading-[1.8]">
        THE PAGE YOU'RE LOOKING FOR HAS LEFT THE COLLECTION.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/" 
          className="inline-block border border-ash text-ash px-12 py-4 text-[10px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-ash hover:text-white luxury-transition outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2"
        >
          Return Home
        </Link>
        <Link 
          to="/shop?sort=newest" 
          className="inline-block border border-ash text-ash px-12 py-4 text-[10px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-ash hover:text-white luxury-transition outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2"
        >
          Explore New Arrivals
        </Link>
      </div>
    </div>
  );
}
