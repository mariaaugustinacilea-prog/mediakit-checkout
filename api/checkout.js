export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'ron',
          product_data: { name: 'Media Kit' },
          unit_amount: 5000,
        },
        quantity: 1,
      }],
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true },
      success_url: 'https://mediaproducts.net/',
      cancel_url: 'https://mediaproducts.net/',
    });

    res.redirect(303, session.url);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
