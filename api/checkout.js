export default async function handler(req, res) {
  // Allow CORS from your Carrd site
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'ron',
            product_data: {
              name: 'Media Kit',
            },
            unit_amount: 5000, // 50 RON in bani (cents)
          },
          quantity: 1,
        },
      ],
      // Collect billing address
      billing_address_collection: 'required',
      // Collect Tax ID (CUI) - ro_tin = Romanian Tax ID, fara prefix RO fortat
      tax_id_collection: {
        enabled: true,
      },
      // Collect phone number (optional, sterge daca nu vrei)
      phone_number_collection: {
        enabled: false,
      },
      success_url: 'https://mediaproducts.net/',
      cancel_url: 'https://mediaproducts.net/',
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: error.message });
  }
}
