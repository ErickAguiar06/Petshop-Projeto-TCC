const express = require('express');
const rota = express.Router();

// Controllers
const usu = require('./controllers/usuario');
const produto = require('./controllers/produto');
const pedido = require('./controllers/pedido');

// Middleware
const { autenticarJWT, verificarAdmin } = require('./middleware/auth'); 

// Rotas de usuário
rota.post('/usuarios', usu.create);              
rota.post('/login', usu.login);                  
rota.post('/recuperar-senha', usu.solicitarRecuperacao); 
rota.post('/resetar-senha', usu.resetarSenha);
rota.get('/usuarios', autenticarJWT, usu.listar); // 🔑 apenas ADMIN

// Rotas de produto
rota.get('/produtos', produto.listar); 
// ✅ qualquer pessoa (mesmo sem login) consegue ver os produtos
rota.post('/produtos', autenticarJWT, verificarAdmin, produto.create); 
// 🔒 apenas ADMIN cadastra
rota.put('/produtos/:id', autenticarJWT, verificarAdmin, produto.update); 
// 🔒 apenas ADMIN altera
rota.delete('/produtos/:id', autenticarJWT, verificarAdmin, produto.remove); 
// 🔒 apenas ADMIN exclui

// Rotas de pedido
rota.post('/pedidos', autenticarJWT, pedido.create); 
// 🔒 qualquer usuário logado faz pedido
rota.get('/pedidos', autenticarJWT, verificarAdmin, pedido.listarTodos); 
// 🔒 apenas ADMIN lista todos os pedidos
rota.put('/pedidos/:id', autenticarJWT, verificarAdmin, pedido.update); 
// 🔒 apenas ADMIN altera pedidos
rota.delete('/pedidos/:id', autenticarJWT, verificarAdmin, pedido.remove); 
// 🔒 apenas ADMIN remove pedidos

module.exports = rota;
