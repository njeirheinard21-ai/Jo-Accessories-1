import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCartStore } from "../../stores/cartStore"
import { useAuthStore } from "../../stores/authStore"
import { SEO } from "../../components/SEO"
import { ChevronLeft, ShieldCheck, X, Package, Truck } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { orderService } from "../../services/orderService"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is required"),
  address: z.string().min(5, "Delivery address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  notes: z.string().optional()
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function Checkout() {
  const { items, getTotals, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const { total, count } = getTotals()
  const navigate = useNavigate()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [whatsappError, setWhatsappError] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormData | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      notes: ""
    }
  })

  const onSubmit = (data: CheckoutFormData) => {
    setFormData(data)
    setShowModal(true)
  }

  const generateWhatsAppMessage = (data: CheckoutFormData, orderId: string) => {
    const orderDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })

    let msg = `*New Order: Jo Accessories*\n\n`
    msg += `*Order ID:* ${orderId}\n`
    msg += `*Order Date:* ${orderDate}\n\n`
    
    msg += `*Customer Information:*\n`
    msg += `Name: ${data.firstName} ${data.lastName}\n`
    msg += `Phone: ${data.phone}\n`
    msg += `Email: ${data.email}\n`
    msg += `Delivery Address: ${data.address}\n`
    msg += `City: ${data.city}\n`
    msg += `Country: ${data.country}\n`
    if (data.notes) {
      msg += `Order Notes: ${data.notes}\n`
    }
    msg += `\n*Order Details:*\n`
    msg += `--------------------------------\n`

    items.forEach((item, index) => {
      msg += `*${index + 1}. ${item.name}*\n`
      msg += `Variant: One Size / Black\n` // Assuming default variant logic as before
      msg += `Color: Black\n`
      msg += `Size: One Size\n`
      msg += `Quantity: ${item.quantity}\n`
      msg += `Unit Price: $${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n`
      msg += `Subtotal: $${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}\n`
      msg += `--------------------------------\n`
    })

    msg += `\n*Total Items:* ${count}\n`
    msg += `*Grand Total:* $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n\n`
    
    msg += `Please confirm product availability, delivery details, and payment instructions. Thank you for shopping with Jo Accessories.`
    
    return msg
  }

  const handleWhatsAppCheckout = async () => {
    if (!formData) return
    
    setIsProcessing(true)
    setWhatsappError(false)
    
    try {
      const draftOrder = {
        userId: user?.uid || 'guest',
        items: items.map(i => ({
          productId: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          image: i.image
        })),
        totalAmount: total,
        status: 'pending_whatsapp_confirmation' as const,
        customerInfo: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          notes: formData.notes || ''
        }
      }
      
      const orderId = await orderService.createDraftOrder(draftOrder)
      
      const message = generateWhatsAppMessage(formData, orderId)
      const encodedMessage = encodeURIComponent(message)
      const whatsappNumber = "237675122389" // Target official WhatsApp number
      
      // Device Detection
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      let isMobile = false;
      if (/windows phone/i.test(userAgent)) isMobile = true;
      if (/android/i.test(userAgent)) isMobile = true;
      if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) isMobile = true;
      if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform)) isMobile = true;
      
      // Universal URLs
      const waMeUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
      const customSchemeUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodedMessage}`
      const webUrl = `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`
      
      if (isMobile) {
        window.location.href = customSchemeUrl;
        
        const fallbackTimer = setTimeout(() => {
          if (!document.hidden) {
            window.location.href = waMeUrl;
          }
        }, 1500);
        
        const handleVisibilityChange = () => {
          if (document.hidden) {
            clearTimeout(fallbackTimer);
          }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange, { once: true });
      } else {
        const windowOpened = window.open(webUrl, '_blank')
        if (!windowOpened) {
          window.location.href = waMeUrl;
        }
      }
      
      setTimeout(() => {
        clearCart()
        setIsProcessing(false)
        setShowModal(false)
        navigate('/order-success')
      }, 3000)
    } catch (error) {
      console.error("Error creating draft order:", error)
      setWhatsappError(true)
      setIsProcessing(false)
    }
  }

  const handleCopyOrder = () => {
    if (!formData) return
    const msg = generateWhatsAppMessage(formData, "DRAFT_ORDER")
    navigator.clipboard.writeText(msg)
    alert("Order details copied to clipboard! Please paste it in WhatsApp manually.")
  }

  const handleCopyNumber = () => {
    navigator.clipboard.writeText("+237675122389")
    alert("WhatsApp number copied to clipboard!")
  }

  if (count === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <h2 className="font-serif text-2xl uppercase tracking-widest mb-4">Your Bag Is Empty</h2>
        <Link to="/shop" className="bg-ash text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-ash/90 transition-colors">
          Discover the Collection
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO title="Checkout | Jo Accessories" />
      
      <header className="border-b border-ash-light bg-white py-8">
        <div className="container mx-auto px-6 flex justify-center">
          <Link to="/">
            <img loading="eager" fetchPriority="high" src="https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/ChatGPT%20Image%20Jul%2025%2C%202026%2C%2001_37_06%20AM.png?alt=media&token=66dd75fd-533e-4c7f-8fe0-0dc831843bb0" alt="Jo Accessories" className="h-20 md:h-28 w-auto object-contain" />
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 lg:px-8 lg:max-w-6xl py-16 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Col - Form */}
        <div className="flex-1">
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              <div>
                <h2 className="font-serif text-3xl md:text-4xl tracking-tight uppercase mb-4">Delivery Details</h2>
                <p className="text-ash-muted font-sans font-light text-sm leading-relaxed max-w-md">
                  Please provide your delivery information to complete your order via WhatsApp.
                </p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans font-semibold uppercase tracking-[0.2em] mb-2">First Name *</label>
                    <input 
                      {...register("firstName")}
                      className="w-full border-b border-ash-light py-3 px-1 bg-transparent focus:outline-none focus:border-ash transition-colors"
                      placeholder="Jane"
                    />
                    {errors.firstName && <span className="text-red-500 text-xs mt-1 block">{errors.firstName.message}</span>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans font-semibold uppercase tracking-[0.2em] mb-2">Last Name *</label>
                    <input 
                      {...register("lastName")}
                      className="w-full border-b border-ash-light py-3 px-1 bg-transparent focus:outline-none focus:border-ash transition-colors"
                      placeholder="Doe"
                    />
                    {errors.lastName && <span className="text-red-500 text-xs mt-1 block">{errors.lastName.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans font-semibold uppercase tracking-[0.2em] mb-2">Email *</label>
                    <input 
                      {...register("email")}
                      type="email"
                      className="w-full border-b border-ash-light py-3 px-1 bg-transparent focus:outline-none focus:border-ash transition-colors"
                      placeholder="jane@example.com"
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans font-semibold uppercase tracking-[0.2em] mb-2">Phone *</label>
                    <input 
                      {...register("phone")}
                      className="w-full border-b border-ash-light py-3 px-1 bg-transparent focus:outline-none focus:border-ash transition-colors"
                      placeholder="+237..."
                    />
                    {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone.message}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-semibold uppercase tracking-[0.2em] mb-2">Address *</label>
                  <input 
                    {...register("address")}
                    className="w-full border-b border-ash-light py-3 px-1 bg-transparent focus:outline-none focus:border-ash transition-colors"
                    placeholder="Street address, apartment, suite, etc."
                  />
                  {errors.address && <span className="text-red-500 text-xs mt-1 block">{errors.address.message}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans font-semibold uppercase tracking-[0.2em] mb-2">City *</label>
                    <input 
                      {...register("city")}
                      className="w-full border-b border-ash-light py-3 px-1 bg-transparent focus:outline-none focus:border-ash transition-colors"
                      placeholder="City"
                    />
                    {errors.city && <span className="text-red-500 text-xs mt-1 block">{errors.city.message}</span>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans font-semibold uppercase tracking-[0.2em] mb-2">Country *</label>
                    <input 
                      {...register("country")}
                      className="w-full border-b border-ash-light py-3 px-1 bg-transparent focus:outline-none focus:border-ash transition-colors"
                      placeholder="Country"
                    />
                    {errors.country && <span className="text-red-500 text-xs mt-1 block">{errors.country.message}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-semibold uppercase tracking-[0.2em] mb-2">Order Notes (Optional)</label>
                  <textarea 
                    {...register("notes")}
                    className="w-full border-b border-ash-light py-3 px-1 bg-transparent focus:outline-none focus:border-ash transition-colors resize-none h-16"
                    placeholder="Any special instructions?"
                  />
                </div>

                <div className="pt-6">
                  <button type="submit" className="bg-ash text-white px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-sans font-medium hover:bg-ash/90 luxury-transition w-full flex items-center justify-center gap-3 outline-none">
                    Finalize Order on WhatsApp
                  </button>
                </div>
              </form>

              <div className="pt-6 border-t border-ash-light flex items-center">
                <Link to="/shop" className="text-[10px] uppercase tracking-[0.2em] font-semibold text-ash-muted flex items-center gap-2 hover:text-ash transition-colors outline-none">
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.5} /> Return to Shop
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Col - Summary */}
        <div className="w-full lg:w-[450px] shrink-0 mt-16 lg:mt-0">
          <div className="bg-white p-0">
            <h3 className="font-serif text-lg tracking-widest uppercase mb-8 pb-4 border-b border-ash text-ash">Order Summary</h3>
            
            <div className="space-y-6 mb-8 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
              {items.map(item => (
                <div key={item.id} className="flex gap-6">
                  <div className="w-24 h-28 bg-[#FAFAFA] shrink-0">
                    <img loading="eager" fetchPriority="high" src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center py-2">
                    <h4 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] mb-1 line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] text-ash-muted font-sans uppercase tracking-[0.1em] mb-1">Color: Black / Size: OS</p>
                    <p className="text-[10px] text-ash-muted font-sans uppercase tracking-[0.1em] mb-2">Qty: {item.quantity}</p>
                    <div className="text-sm font-serif italic text-ash mt-auto">
                      ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-ash-light pt-6 space-y-3 text-sm font-light">
              <div className="flex justify-between text-ash-muted">
                <span>Subtotal</span>
                <span className="font-serif italic text-ash">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-ash-muted">
                <span>Shipping</span>
                <span>Complimentary</span>
              </div>
              <div className="border-t border-ash-light pt-6 flex justify-between font-serif text-2xl mt-4 text-ash items-baseline">
                <span>Total</span>
                <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-[10px] text-ash-muted font-sans tracking-[0.2em] uppercase font-sans font-medium ml-1">USD</span></span>
              </div>
            </div>

            <div className="mt-12 space-y-6 pt-10 border-t border-ash-light">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-ash-muted shrink-0 mt-0.5" strokeWidth={1} />
                <div>
                  <h4 className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] mb-1">Authenticity Guaranteed</h4>
                  <p className="text-xs text-ash-muted font-light leading-relaxed">Every piece is verified for authenticity and quality by our in-house experts.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Package className="w-5 h-5 text-ash-muted shrink-0 mt-0.5" strokeWidth={1} />
                <div>
                  <h4 className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] mb-1">Premium Packaging</h4>
                  <p className="text-xs text-ash-muted font-light leading-relaxed">Your order will arrive in signature Jo Accessories packaging, perfect for gifting.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Truck className="w-5 h-5 text-ash-muted shrink-0 mt-0.5" strokeWidth={1} />
                <div>
                  <h4 className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] mb-1">Complimentary Delivery</h4>
                  <p className="text-xs text-ash-muted font-light leading-relaxed">Enjoy free express shipping on all orders, with easy 14-day returns.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ash/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-ash-light flex justify-between items-center">
                <h3 className="font-serif text-xl uppercase tracking-widest text-ash">Review Your Order</h3>
                <button onClick={() => setShowModal(false)} className="text-ash-muted hover:text-ash transition-colors outline-none">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  </div>
                  <h4 className="font-serif text-2xl mb-2 text-ash tracking-tight">Almost there!</h4>
                  <p className="text-ash-muted font-light text-sm max-w-sm mx-auto">Our Style Team will assist you in confirming availability, delivery, and payment via WhatsApp.</p>
                </div>
                
                <div className="bg-white p-6 flex flex-col gap-4 border border-ash-light">
                  <div className="flex justify-between items-center border-b border-ash-light pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-ash-muted">Products</span>
                    <span className="font-serif text-sm">✔</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-ash-light pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-ash-muted">Quantities</span>
                    <span className="font-serif text-sm">✔</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-ash-light pb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-ash-muted">Delivery Information</span>
                    <span className="font-serif text-sm">✔</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-ash">Total</span>
                    <span className="font-serif text-xl font-bold">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {whatsappError && (
                  <div className="mt-6 bg-red-50 text-red-600 p-4 border border-red-100 text-sm flex flex-col items-center gap-3">
                    <p>Unable to open WhatsApp automatically.</p>
                    <div className="flex gap-4">
                      <button onClick={handleCopyOrder} className="underline font-medium hover:text-red-800 outline-none">
                        Copy Order Details
                      </button>
                      <button onClick={handleCopyNumber} className="underline font-medium hover:text-red-800 outline-none">
                        Copy WhatsApp Number
                      </button>
                    </div>
                    <p className="text-xs">And send it to: +237 675 122 389</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-ash-light flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 px-6 py-4 border border-ash text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-ash hover:bg-white transition-colors outline-none"
                >
                  Back to Checkout
                </button>
                <button 
                  onClick={handleWhatsAppCheckout} 
                  disabled={isProcessing}
                  className="flex-1 bg-ash text-white px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-sans font-medium hover:bg-ash/90 luxury-transition flex items-center justify-center gap-2 disabled:opacity-50 outline-none"
                >
                  {isProcessing ? 'Connecting...' : 'Continue to WhatsApp'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
