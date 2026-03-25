import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const handleCheckout = async (cartItems) => {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems })
    });

    if (!response.ok) {
      throw new Error('Error al conectar con el servidor de pagos');
    }

    const session = await response.json();
    window.location.href = session.url;

  } catch (error) {
    console.error('Error in checkout:', error);
    alert('Hubo un error al procesar el pago: ' + error.message);
  }
};