import { loadStripe } from '@stripe/stripe-js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const handleCheckout = async (cartItems) => {
  try {
    // Obtener usuario actual si hay sesión
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems, userId })
    });

    if (!response.ok) throw new Error('Error al conectar con el servidor de pagos');

    const sessionData = await response.json();
    window.location.href = sessionData.url;

  } catch (error) {
    console.error('Error in checkout:', error);
    alert('Hubo un error al procesar el pago: ' + error.message);
  }
};