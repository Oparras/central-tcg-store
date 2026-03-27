import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const rawBody = await getRawBody(req);
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).json({ error: `Webhook error: ${err.message}` });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const items = JSON.parse(session.metadata?.items || '[]');
        const userId = session.metadata?.userId || null;

        const shipping =
            session.shipping_details ||
            session.collected_information?.shipping_details ||
            null;

        const payload = {
            stripe_session_id: session.id,
            stripe_customer_id: session.customer || null,
            user_id: userId || null,
            email: session.customer_details?.email || null,
            full_name: session.customer_details?.name || shipping?.name || null,
            phone: session.customer_details?.phone || null,
            shipping_name: shipping?.name || null,
            shipping_line1: shipping?.address?.line1 || null,
            shipping_line2: shipping?.address?.line2 || null,
            shipping_city: shipping?.address?.city || null,
            shipping_state: shipping?.address?.state || null,
            shipping_postal_code: shipping?.address?.postal_code || null,
            shipping_country: shipping?.address?.country || null,
            subtotal: session.amount_subtotal ? session.amount_subtotal / 100 : 0,
            shipping_amount: session.shipping_cost?.amount_total
                ? session.shipping_cost.amount_total / 100
                : 0,
            total: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency || 'eur',
            items,
            status: 'paid',
        };

        const { error } = await supabase.from('orders').insert(payload);

        if (error) {
            console.error('SUPABASE ORDER ERROR:', error);
        }
    }

    res.status(200).json({ received: true });
}