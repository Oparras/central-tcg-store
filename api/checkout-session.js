import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({ error: 'session_id requerido' });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['line_items'],
        });

        return res.status(200).json({
            id: session.id,
            amount_total: session.amount_total,
            amount_subtotal: session.amount_subtotal,
            currency: session.currency,
            customer_details: session.customer_details || null,
            shipping_details:
                session.shipping_details ||
                session.collected_information?.shipping_details ||
                null,
            shipping_cost: session.shipping_cost || null,
            metadata: session.metadata || {},
        });
    } catch (error) {
        console.error('❌ ERROR SESSION:', error);
        return res.status(500).json({ error: error.message });
    }
}