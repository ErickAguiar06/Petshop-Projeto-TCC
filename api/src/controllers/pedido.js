// controllers/pedido.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async create(req, res) {
    try {
      const { usuarioId, itens } = req.body;

      if (!usuarioId || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: 'Dados inválidos.' });
      }

      const pedido = await prisma.pedido.create({
        data: {
          usuarioId,
          itens: {
            create: itens.map(item => ({
              produtoId: item.id,
              quantidade: item.quantidade
            }))
          }
        },
        include: {
          itens: true
        }
      });

      res.status(201).json(pedido);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(500).json({ error: 'Erro ao criar pedido.' });
    }
  }
};
