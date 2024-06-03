// This is your test secret API key.
const stripe = require('stripe')('sk_test_51PM8FBFZsLPR6zPrdS0JIsj1j1r0IUq9I4KzPnvZXzcHmztRj9jp7jU7dKtqeU8bNySYwmRdNcsHSTE8z6mzM4oL00WzBu0HPu');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: 'price_1PMImqFZsLPR6zPr3Xr9FQd5',
        quantity: 1,
      },
    ],
    mode: 'subscription',
    currency: 'usd',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/ecopoint.html`,
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));