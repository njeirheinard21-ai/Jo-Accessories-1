import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCartStore } from "../../stores/cartStore"
import { useAuthStore } from "../../stores/authStore"
import { SEO } from "../../components/SEO"
import { ChevronLeft, ShieldCheck, X, Package, Truck, Phone } from "lucide-react"
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
  notes: z.string().optional(),
  paymentMethod: z.enum(["mtn_momo", "orange_money", "card", "whatsapp"])
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function Checkout() {
  const { items, getTotals, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const { total, count } = getTotals()
  const navigate = useNavigate()
  
  const EXCHANGE_RATE = 605; // 1 USD = 605 XAF (mock rate)
  const totalFCFA = total * EXCHANGE_RATE;

  const [isProcessing, setIsProcessing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [whatsappError, setWhatsappError] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormData | null>(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "Douala",
      country: "Cameroon",
      notes: "",
      paymentMethod: "mtn_momo"
    }
  })

  const selectedCountry = watch("country")
  const selectedPayment = watch("paymentMethod")

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
    msg += `Payment Method: ${data.paymentMethod.replace('_', ' ').toUpperCase()}\n`
    
    if (data.notes) {
      msg += `Order Notes: ${data.notes}\n`
    }

    msg += `\n*Order Details:*\n`
    msg += `--------------------------------\n`
    items.forEach((item, index) => {
      msg += `*${index + 1}. ${item.name}*\n`
      msg += `Quantity: ${item.quantity}\n`
      msg += `Unit Price: $${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })} / ${(item.price * EXCHANGE_RATE).toLocaleString()} FCFA\n`
      msg += `Subtotal: $${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })} / ${(item.price * item.quantity * EXCHANGE_RATE).toLocaleString()} FCFA\n`
      msg += `--------------------------------\n`
    })

    msg += `\n*Total Items:* ${count}\n`
    msg += `*Grand Total (USD):* $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n`
    msg += `*Grand Total (XAF):* ${totalFCFA.toLocaleString()} FCFA\n\n`
    
    msg += `Please confirm product availability, delivery details, and payment instructions.`
    return msg
  }

  const handleCheckoutConfirm = async () => {
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
          state: '',
          zip: ''
        },
        paymentMethod: formData.paymentMethod
      }

      const order = await orderService.createOrder(draftOrder)
      const message = generateWhatsAppMessage(formData, order.id)
      
      const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+237600000000'
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
      
      clearCart()
      window.open(whatsappUrl, '_blank')
      navigate(`/order-success?id=${order.id}`)
      
    } catch (error) {
      console.error("Error creating draft order:", error)
      setWhatsappError(true)
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-12 flex flex-col items-center justify-center selection:bg-ash selection:text-white">
        <Package className="w-16 h-16 text-ash/20 mb-6" strokeWidth={1} />
        <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest text-ash mb-6">Bag Empty</h1>
        <p className="text-ash-muted font-sans font-light text-sm max-w-sm text-center mb-12 leading-[1.8]">
          Your selection is currently empty. Explore our collection to find your next statement piece.
        </p>
        <Link to="/shop" className="inline-block border border-ash text-ash px-12 py-4 text-[10px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-ash hover:text-white luxury-transition outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2">
          Discover The Collection
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO title="Secure Checkout | Jo Accessories" />
      
      {/* Checkout Header */}
      <header className="border-b border-ash-light py-6">
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          <Link to="/shop" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-sans text-ash-muted hover:text-ash luxury-transition">
            <ChevronLeft className="w-4 h-4" /> Return to Shop
          </Link>
          <div className="flex items-center gap-2 text-ash">
            <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold">Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Form */}
          <div className="flex-1 lg:max-w-2xl">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              
              {/* Contact Information */}
              <section>
                <h2 className="text-sm font-sans font-semibold uppercase tracking-[0.2em] mb-6 border-b border-ash-light pb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.1em] text-ash-muted mb-2">First Name</label>
                    <input {...register("firstName")} type="text" className={`w-full border p-3 outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2 focus:border-ash transition-colors ${errors.firstName ? 'border-red-500' : 'border-ash-light'}`} />
                    {errors.firstName && <span className="text-red-500 text-xs mt-1 block">{errors.firstName.message}</span>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-[0.1em] text-ash-muted mb-2">Last Name</label>
                    <input {...register("lastName")} type="text" className={`w-full border p-3 outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2 focus:border-ash transition-colors ${errors.lastName ? 'border-red-500' : 'border-ash-light'}`} />
                    {errors.lastName && <span className="text-red-500 text-xs mt-1 block">{errors.lastName.message}</span>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-sans uppercase tracking-[0.1em] text-ash-muted mb-2">Email Address</label>
                    <input {...register("email")} type="email" className={`w-full border p-3 outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2 focus:border-ash transition-colors ${errors.email ? 'border-red-500' : 'border-ash-light'}`} />
                    {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-sans uppercase tracking-[0.1em] text-ash-muted mb-2">Phone Number (Required for Mobile Money / Delivery)</label>
                    <input {...register("phone")} type="tel" className={`w-full border p-3 outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2 focus:border-ash transition-colors ${errors.phone ? 'border-red-500' : 'border-ash-light'}`} />
                    {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone.message}</span>}
                  </div>
                </div>
              </section>

              {/* Delivery Address */}
              <section>
                <h2 className="text-sm font-sans font-semibold uppercase tracking-[0.2em] mb-6 border-b border-ash-light pb-4">Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-sans uppercase tracking-[0.1em] text-ash-muted mb-2">Country</label>
                    <select {...register("country")} className="w-full border border-ash-light p-3 outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2 focus:border-ash transition-colors bg-white">
                      <option value="Cameroon">Cameroon</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Gabon">Gabon</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="France">France</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-sans uppercase tracking-[0.1em] text-ash-muted mb-2">Address (Street, Quarter, Landmarks)</label>
                    <input {...register("address")} type="text" className={`w-full border p-3 outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2 focus:border-ash transition-colors ${errors.address ? 'border-red-500' : 'border-ash-light'}`} />
                    {errors.address && <span className="text-red-500 text-xs mt-1 block">{errors.address.message}</span>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-sans uppercase tracking-[0.1em] text-ash-muted mb-2">City</label>
                    <input {...register("city")} type="text" className={`w-full border p-3 outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2 focus:border-ash transition-colors ${errors.city ? 'border-red-500' : 'border-ash-light'}`} />
                    {errors.city && <span className="text-red-500 text-xs mt-1 block">{errors.city.message}</span>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-sans uppercase tracking-[0.1em] text-ash-muted mb-2">Order Notes (Optional)</label>
                    <textarea {...register("notes")} rows={3} className="w-full border border-ash-light p-3 outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2 focus:border-ash transition-colors resize-none" placeholder="Any special instructions for delivery..."></textarea>
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <h2 className="text-sm font-sans font-semibold uppercase tracking-[0.2em] mb-6 border-b border-ash-light pb-4">Payment Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`border p-4 cursor-pointer transition-colors flex flex-col gap-2 ${selectedPayment === 'mtn_momo' ? 'border-ash bg-[#FAFAFA]' : 'border-ash-light hover:border-ash'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.1em]">MTN Mobile Money</span>
                      <input type="radio" value="mtn_momo" {...register("paymentMethod")} className="hidden" />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPayment === 'mtn_momo' ? 'border-ash' : 'border-ash-light'}`}>
                        {selectedPayment === 'mtn_momo' && <div className="w-2 h-2 rounded-full bg-ash" />}
                      </div>
                    </div>
                    <span className="text-xs text-ash-muted">Pay securely via MTN Cameroon.</span>
                  </label>

                  <label className={`border p-4 cursor-pointer transition-colors flex flex-col gap-2 ${selectedPayment === 'orange_money' ? 'border-ash bg-[#FAFAFA]' : 'border-ash-light hover:border-ash'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.1em]">Orange Money</span>
                      <input type="radio" value="orange_money" {...register("paymentMethod")} className="hidden" />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPayment === 'orange_money' ? 'border-ash' : 'border-ash-light'}`}>
                        {selectedPayment === 'orange_money' && <div className="w-2 h-2 rounded-full bg-ash" />}
                      </div>
                    </div>
                    <span className="text-xs text-ash-muted">Pay securely via Orange Cameroun.</span>
                  </label>

                  <label className={`border p-4 cursor-pointer transition-colors flex flex-col gap-2 ${selectedPayment === 'card' ? 'border-ash bg-[#FAFAFA]' : 'border-ash-light hover:border-ash'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.1em]">Credit / Debit Card</span>
                      <input type="radio" value="card" {...register("paymentMethod")} className="hidden" />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPayment === 'card' ? 'border-ash' : 'border-ash-light'}`}>
                        {selectedPayment === 'card' && <div className="w-2 h-2 rounded-full bg-ash" />}
                      </div>
                    </div>
                    <span className="text-xs text-ash-muted">Visa, Mastercard (Stripe via WhatsApp link).</span>
                  </label>

                  <label className={`border p-4 cursor-pointer transition-colors flex flex-col gap-2 ${selectedPayment === 'whatsapp' ? 'border-ash bg-[#FAFAFA]' : 'border-ash-light hover:border-ash'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.1em]">Order via WhatsApp</span>
                      <input type="radio" value="whatsapp" {...register("paymentMethod")} className="hidden" />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPayment === 'whatsapp' ? 'border-ash' : 'border-ash-light'}`}>
                        {selectedPayment === 'whatsapp' && <div className="w-2 h-2 rounded-full bg-ash" />}
                      </div>
                    </div>
                    <span className="text-xs text-ash-muted">Finalize payment directly with our team.</span>
                  </label>
                </div>
              </section>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-[#FAFAFA] p-8 lg:sticky lg:top-8">
              <h2 className="font-serif text-xl uppercase tracking-widest mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto scrollbar-hide">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-white relative">
                      <img loading="lazy" decoding="async" src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-ash text-white rounded-full flex items-center justify-center text-[10px] font-sans font-medium">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[10px] font-sans font-semibold uppercase tracking-[0.1em] text-ash mb-1">{item.name}</h3>
                      <p className="text-xs text-ash-muted mb-1">One Size</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-serif text-ash">${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-ash/10 pt-6 space-y-4 mb-6">
                <div className="flex justify-between text-sm text-ash-muted">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm text-ash-muted">
                  <span>Shipping</span>
                  <span>Calculated next step</span>
                </div>
              </div>

              <div className="border-t border-ash/20 pt-6 mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-serif uppercase tracking-widest text-ash">Total (USD)</span>
                  <span className="font-serif text-2xl text-ash">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-end text-sm text-ash-muted">
                  <span>Local Currency (XAF)</span>
                  <span>~ {totalFCFA.toLocaleString()} FCFA</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full bg-ash text-white py-5 uppercase tracking-[0.2em] text-[10px] font-sans font-semibold hover:bg-ash/90 luxury-transition disabled:opacity-50 disabled:cursor-not-allowed mb-6 flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing...' : 'Place Order via WhatsApp'}
              </button>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-xs text-ash-muted">
                  <Truck className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Delivery across Cameroon within 1-3 business days. International shipping available.</p>
                </div>
                <div className="flex items-start gap-3 text-xs text-ash-muted">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>100% Secure checkout. Jo Accessories guarantees the authenticity of all products.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && formData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setShowModal(false)}
              className="absolute inset-0 bg-ash/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white max-w-md w-full relative z-10 p-8 shadow-2xl"
            >
              <button 
                onClick={() => !isProcessing && setShowModal(false)}
                className="absolute top-4 right-4 p-2 hover:opacity-50 transition-opacity outline-none focus-visible:ring-1 focus-visible:ring-ash focus-visible:ring-offset-2"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8">
                <div className="w-12 h-12 bg-[#FAFAFA] flex items-center justify-center mb-6 rounded-full mx-auto">
                  <Phone className="w-5 h-5 text-ash" />
                </div>
                <h3 className="text-xl font-serif text-center uppercase tracking-widest mb-4">Complete Order</h3>
                <p className="text-sm text-ash-muted text-center font-light leading-relaxed">
                  You are about to be redirected to WhatsApp to finalize your payment via <strong>{formData.paymentMethod.replace('_', ' ').toUpperCase()}</strong> and confirm delivery details with our concierge team.
                </p>
                
                {whatsappError && (
                  <p className="text-red-500 text-xs text-center mt-4 bg-red-50 p-2 border border-red-100">
                    There was an issue creating your order. Please try again.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleCheckoutConfirm}
                  disabled={isProcessing}
                  className="w-full bg-ash text-white py-4 uppercase tracking-[0.2em] text-[10px] font-sans font-semibold hover:bg-ash/90 luxury-transition disabled:opacity-50"
                >
                  {isProcessing ? 'Redirecting...' : 'Continue to WhatsApp'}
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  disabled={isProcessing}
                  className="w-full border border-ash-light py-4 uppercase tracking-[0.2em] text-[10px] font-sans font-semibold hover:border-ash transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
