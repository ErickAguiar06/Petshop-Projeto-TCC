const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Rotas existentes
const rota = require('./src/routes');
app.use('/', rota);

// Rota de recuperação de senha
app.post('/recuperar-senha', async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Verificar se o usuário existe
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // 2. Criar transporte de e-mail
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // ex: smtp.gmail.com
      port: process.env.EMAIL_PORT, // ex: 465
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 3. Enviar e-mail
    await transporter.sendMail({
      from: `"Petshop 4 Patas" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperação de Senha',
      text: `Olá, ${usuario.nome}. Aqui está seu link para recuperar a senha: http://localhost:5500/front/redefinir.html?email=${email}`,
      html: `<p>Olá, <b>${usuario.nome}</b>!</p>
             <p>Clique no link abaixo para redefinir sua senha:</p>
             <a href="http://localhost:5500/front/redefinir.html?email=${email}">Recuperar senha</a>`
    });

    res.json({ message: 'E-mail de recuperação enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ error: 'Erro ao enviar e-mail de recuperação' });
  }
});

// Rota do Stripe
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