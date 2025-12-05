import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount, currency = 'usd', orgId, name, purpose_reason, comment } = await req.json();

    if (!amount || !orgId || !name || !purpose_reason) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency,
      metadata: {
        orgId,
        name,
        purpose_reason,
        comment: comment || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'PaymentIntent creation failed' }), { status: 500 });
  }
}
