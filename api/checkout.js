import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    console.log('🔥 Checkout llamado');

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // 🔥 MUY IMPORTANTE: parse manual del body
    let body = req.body;

    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { items, userId } = body || {};

    console.log('📦 Items:', items);

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items inválidos' });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name || 'Producto',
          images:
            item.img && item.img.startsWith('http') ? [item.img] : [],
        },
        unit_amount: Math.round(Number(item.pvp) * 100),
      },
      quantity: Number(item.qty) || 1,
    }));

    console.log('🧾 Line items:', lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://centraltcg.es/?success=true',
      cancel_url: 'https://centraltcg.es/?canceled=true',
    });

    console.log('✅ Session creada:', session.id);

    return res.status(200).json({
      url: session.url,
    });

  } catch (error) {
    console.error('❌ ERROR CHECKOUT:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}