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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://centraltcg.es/?success=true',
      cancel_url: 'https://centraltcg.es/?canceled=true',
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