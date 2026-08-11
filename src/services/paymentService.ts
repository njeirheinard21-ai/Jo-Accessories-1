// This service handles interactions with various payment gateways.
// In a full production setup, this would communicate with your Node backend
// which securely holds the private keys for these services.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface PaymentIntent {
  clientSecret: string;
  status: string;
  provider: 'stripe' | 'paypal' | 'mtn_momo' | 'orange_money' | 'google_pay' | 'apple_pay';
}

export const paymentService = {
  createPaymentIntent: async (
    orderTotal: number, 
    currency: string, 
    provider: PaymentIntent['provider'],
    idToken: string
  ): Promise<PaymentIntent> => {
    try {
      const response = await fetch(`${API_URL}/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ amount: orderTotal, currency, provider })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error initializing ${provider} payment:`, error);
      throw error;
    }
  },
  
  // Specific integration helpers
  processStripePayment: async (clientSecret: string, cardElement: any) => {
    // In production, use @stripe/react-stripe-js
    console.log("Processing Stripe payment with client secret", clientSecret);
    return { success: true, transactionId: `pi_mock_${Date.now()}` };
  },
  
  processPayPalOrder: async (orderId: string) => {
    // In production, use @paypal/react-paypal-js
    console.log("Processing PayPal order", orderId);
    return { success: true, transactionId: `paypal_mock_${Date.now()}` };
  },

  processMTNMobileMoney: async (phoneNumber: string, amount: number) => {
    // Initiates a push USSD prompt to the user's phone via MTN MoMo API
    console.log(`Initiating MTN MoMo push for ${phoneNumber}`);
    return { success: true, transactionId: `momo_mock_${Date.now()}`, status: 'pending_user_approval' };
  },
  
  processOrangeMoney: async (phoneNumber: string, amount: number) => {
    // Initiates Orange Money web payment or USSD
    console.log(`Initiating Orange Money payment for ${phoneNumber}`);
    return { success: true, transactionId: `orange_mock_${Date.now()}`, status: 'pending_user_approval' };
  }
};
