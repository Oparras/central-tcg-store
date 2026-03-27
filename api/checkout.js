import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { items, userId } = body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
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

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,

      success_url: 'https://centraltcg.es/?success=true&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://centraltcg.es/?canceled=true',

      customer_creation: 'always',

      billing_address_collection: 'required',

      phone_number_collection: {
        enabled: true,
      },

      shipping_address_collection: {
        allowed_countries: ['ES'],
      },

      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 490,
              currency: 'eur',
            },
            display_name: 'Envío estándar',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 4 },
            },
          },
        },
      ],

      metadata: {
        userId: userId || '',
        items: JSON.stringify(
          items.map((i) => ({
            id: i.id,
            name: i.name,
            qty: i.qty,
            pvp: i.pvp,
          }))
        ),
      },
    });

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