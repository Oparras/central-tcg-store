import { loadStripe } from '@stripe/stripe-js';

// Clave Pública LIVE de Stripe (Central TCG)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51TEu7B9T2prQMYzAEd3cMyU7BSpCj8U4erbeHG3hQzoJ0lJyW6A9n08vD6ztClzPb6WxkIDPCCDVrKLU5tFxSeES00w18jJYYf');

export const handleCheckout = async (cartItems) => {
  try {
    const stripe = await stripePromise;
    
    // Llamada a nuestra API serverless (compatible con Vercel/Netlify)
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems })
    });
    
    if (!response.ok) {
      throw new Error('Error al conectar con el servidor de pagos');
    }

    const session = await response.json();

    // Redireccionamos a la pasarela de pago de Stripe usando el ID de sesión
    const result = await stripe.redirectToCheckout({ sessionId: session.id });

    if (result.error) {
      alert(result.error.message);
    }

  } catch (error) {
    console.error('Error in checkout:', error);
    alert('Hubo un error al procesar el pago: ' + error.message);
  }
};
