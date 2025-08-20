// controllers/pedido.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  // Criar pedido (qualquer usuário logado)
  async create(req, res) {
    try {
      const { usuarioId, itens } = req.body;

      if (!usuarioId || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "Dados inválidos." });
      }

      const pedido = await prisma.pedido.create({
        data: {
          usuarioId,
          itens: {
            create: itens.map(item => ({
              produtoId: item.id,
              quantidade: item.quantidade,
            })),
          },
        },
        include: {
          itens: { include: { produto: true } }, // já retorna info dos produtos
          usuario: true,
        },
      });

      res.status(201).json(pedido);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      res.status(500).json({ error: "Erro ao criar pedido.", detalhes: error.message });
    }
  },

  // Listar todos os pedidos (ADMIN)
  async listarTodos(req, res) {
    try {
      const pedidos = await prisma.pedido.findMany({
        include: {
          itens: { include: { produto: true } },
          usuario: true,
        },
      });
      res.json(pedidos);
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      res.status(500).json({ error: "Erro ao listar pedidos.", detalhes: error.message });
    }
  },

  // Atualizar pedido (ADMIN)
  async update(req, res) {
    const { id } = req.params;
    const { itens } = req.body;

    try {
      const pedidoAtualizado = await prisma.pedido.update({
        where: { id: parseInt(id) },
        data: {
          itens: {
            deleteMany: {}, // remove os itens antigos
            create: itens.map(item => ({
              produtoId: item.id,
              quantidade: item.quantidade,
            })),
          },
        },
        include: { itens: { include: { produto: true } }, usuario: true },
      });

      res.json(pedidoAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      res.status(500).json({ error: "Erro ao atualizar pedido.", detalhes: error.message });
    }
  },

  // Remover pedido (ADMIN)
  async remove(req, res) {
    const { id } = req.params;

    try {
      await prisma.pedido.delete({ where: { id: parseInt(id) } });
      res.json({ mensagem: "Pedido removido com sucesso." });
    } catch (error) {
      console.error("Erro ao remover pedido:", error);
      res.status(500).json({ error: "Erro ao remover pedido.", detalhes: error.message });
    }
  },
};
