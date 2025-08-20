const prisma = require('../connect');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); // ✅ importando bcrypt

const SECRET = process.env.JWT_SECRET || 'secreta';
const SECRET_RECUPERACAO = process.env.JWT_SECRET_RECUPERACAO || 'recuperar_senha';

// Configuração do envio de e-mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Listar todos os usuários (somente ADMIN)
const listar = async (req, res) => {
  try {
    if (req.usuario.tipo !== "ADMIN") {
      return res.status(403).json({ erro: "Acesso negado. Apenas ADMIN pode listar usuários." });
    }

    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, telefone: true, tipo: true }
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar usuários." });
  }
};

// Criar usuário com hash de senha
const create = async (req, res) => {
    const { nome, email, telefone, senha, tipo } = req.body;
    try {
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        const usuario = await prisma.usuario.create({
            data: { 
                nome, 
                email, 
                telefone, 
                senha: senhaHash, // salva hash
                tipo: tipo || "CLIENTE"
            },
        });
        res.status(201).json(usuario);
    } catch (err) {
        res.status(400).json(err);
    }
};

// Login com comparação de hash
const login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha); // ✅ compara hash
        if (!senhaValida) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, tipo: usuario.tipo }, 
            SECRET, 
            { expiresIn: '2h' }
        );
        res.status(200).json({ message: 'Login bem-sucedido', token, tipo: usuario.tipo });

    } catch (err) {
        res.status(400).json(err);
    }
};

// Solicitar recuperação de senha
const solicitarRecuperacao = async (req, res) => {
    const { email } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
        return res.status(200).json({ message: 'Se o email estiver cadastrado, você receberá instruções.' });
    }

    const tokenRecuperacao = jwt.sign({ id: usuario.id }, SECRET_RECUPERACAO, { expiresIn: '15m' });
    const link = `http://localhost:5500/resetar-senha.html?token=${tokenRecuperacao}`;

    try {
        await transporter.sendMail({
            from: '"4 Patas PetShop" <naoresponda@4patas.com>',
            to: email,
            subject: 'Recuperação de Senha',
            html: `<p>Você solicitou a recuperação de senha.</p>
                   <p><a href="${link}">Clique aqui para redefinir sua senha</a></p>
                   <p>Este link expira em 15 minutos.</p>`
        });

        res.status(200).json({ message: 'Se o email estiver cadastrado, você receberá instruções.' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao enviar email de recuperação.' });
    }
};

// Resetar senha com hash
const resetarSenha = async (req, res) => {
    const { token, novaSenha } = req.body;
    try {
        const decoded = jwt.verify(token, SECRET_RECUPERACAO);

        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(novaSenha, saltRounds);

        await prisma.usuario.update({
            where: { id: decoded.id },
            data: { senha: senhaHash } // salva hash
        });

        res.status(200).json({ message: 'Senha redefinida com sucesso!' });
    } catch (err) {
        res.status(400).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = {
    listar,
    create,
    login,
    solicitarRecuperacao,
    resetarSenha
};
