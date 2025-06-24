const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importarProdutos() {
  try {
    const caminho = path.join(__dirname, 'front', 'assets', 'json', 'tartaruga.json');
    const data = fs.readFileSync(caminho, 'utf-8');
    const produtos = JSON.parse(data);

    for (const p of produtos) {
      await prisma.produto.create({
        data: {
          nome: p.nome,
          descricao: p.descricao,
          preco: parseFloat(p.preco),
          imagem: p.image,
          alt: p.alt
        }
      });
    }

    console.log('✅ Produtos importados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao importar produtos:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importarProdutos();
