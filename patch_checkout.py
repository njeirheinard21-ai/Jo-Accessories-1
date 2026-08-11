import re

with open('src/pages/public/Checkout.tsx', 'r') as f:
    content = f.read()

# Add handleCopyNumber function
new_funcs = """  const handleCopyOrder = () => {
    if (!formData) return
    const msg = generateWhatsAppMessage(formData, "DRAFT_ORDER")
    navigator.clipboard.writeText(msg)
    alert("Order details copied to clipboard! Please paste it in WhatsApp manually.")
  }

  const handleCopyNumber = () => {
    navigator.clipboard.writeText("+237675122389")
    alert("WhatsApp number copied to clipboard!")
  }"""

content = content.replace("""  const handleCopyOrder = () => {
    if (!formData) return
    const msg = generateWhatsAppMessage(formData, "DRAFT_ORDER")
    navigator.clipboard.writeText(msg)
    alert("Order details copied to clipboard! Please paste it in WhatsApp manually.")
  }""", new_funcs)

# Update the modal error view
new_error_view = """                {whatsappError && (
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
                )}"""

content = content.replace("""                {whatsappError && (
                  <div className="mt-6 bg-red-50 text-red-600 p-4 border border-red-100 text-sm flex flex-col items-center gap-3">
                    <p>Unable to open WhatsApp automatically.</p>
                    <button onClick={handleCopyOrder} className="underline font-medium hover:text-red-800 outline-none">
                      Copy Order Details
                    </button>
                    <p className="text-xs">And send it to: +237 675 122 389</p>
                  </div>
                )}""", new_error_view)

with open('src/pages/public/Checkout.tsx', 'w') as f:
    f.write(content)
