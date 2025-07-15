const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const app = express();
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const carrinho = req.body.carrinho;
  const line_items = carrinho.map(produto => ({
    price_data: {
      currency: 'brl',
      product_data: {
        name: produto.nome,
        description: produto.descricao,
      },
      unit_amount: Math.round(produto.preco * 100),
    },
    quantity: produto.quantidade,
  }));

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    ui_mode: 'embedded',
    return_url: 'http://localhost:5500/front/checkout-retorno.html?session_id={CHECKOUT_SESSION_ID}'
  });

  res.send({ clientSecret: session.client_secret });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
