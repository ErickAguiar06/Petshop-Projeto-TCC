const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar produto (ADMIN)
exports.create = async (req, res) => {
  const { nome, descricao, preco, imagem, alt } = req.body;

  try {
    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        imagem,
        alt,
      },
    });
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    res.status(500).json({ erro: "Erro ao cadastrar produto.", detalhes: error.message });
  }
};

// Listar todos os produtos (público)
exports.listar = async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ erro: "Erro ao buscar produtos." });
  }
};

// Atualizar produto (ADMIN)
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, imagem, alt } = req.body;

  try {
    const produtoAtualizado = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: { nome, descricao, preco: parseFloat(preco), imagem, alt },
    });
    res.json(produtoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ erro: "Erro ao atualizar produto.", detalhes: error.message });
  }
};

// Remover produto (ADMIN)
exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.produto.delete({ where: { id: parseInt(id) } });
    res.json({ mensagem: "Produto removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover produto:", error);
    res.status(500).json({ erro: "Erro ao remover produto.", detalhes: error.message });
  }
};
