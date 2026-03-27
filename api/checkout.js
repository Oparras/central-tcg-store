import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items, userId } = req.body;

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name, images: [item.img] },
        unit_amount: Math.round(item.pvp * 100),
      },
      quantity: item.qty,
    }));

    // Calcular total para decidir envío
    const total = items.reduce((acc, item) => acc + (item.pvp * item.qty), 0);
    const envioGratis = total >= 40;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://centraltcg.es/?success=true',
      cancel_url: 'https://centraltcg.es/?canceled=true',
      shipping_address_collection: {
        allowed_countries: ['ES', 'PT', 'FR', 'DE', 'IT', 'GB', 'BE', 'NL'],
      },
      shipping_options: envioGratis
        ? [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: 0, currency: 'eur' },
              display_name: '🎉 Envío gratis',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 2 },
                maximum: { unit: 'business_day', value: 5 },
              },
            },
          },
        ]
        : [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: 395, currency: 'eur' },
              display_name: 'Envío estándar',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 2 },
                maximum: { unit: 'business_day', value: 5 },
              },
            },
          },
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: 0, currency: 'eur' },
              display_name: '🎉 Envío gratis (pedidos +40€)',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 3 },
                maximum: { unit: 'business_day', value: 7 },
              },
            },
          },
        ],
      metadata: {
        items: JSON.stringify(items),
        userId: userId || '',
      },
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}