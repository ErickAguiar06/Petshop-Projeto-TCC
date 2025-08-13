const prisma = require('../connect');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const SECRET = process.env.JWT_SECRET || 'secreta';
const SECRET_RECUPERACAO = process.env.JWT_SECRET_RECUPERACAO || 'recuperar_senha';

// Configuração do envio de e-mail
const transporter = nodemailer.createTransport({
    service: 'gmail', // pode mudar para outro provedor
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const create = async (req, res) => {
    const { nome, email, telefone, senha } = req.body;
    try {
        const usuario = await prisma.usuario.create({
            data: { nome, email, telefone, senha },
        });
        res.status(201).json(usuario);
    } catch (err) {
        res.status(400).json(err);
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (usuario && usuario.senha === senha) {
            const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, { expiresIn: '2h' });
            res.status(200).json({ message: 'Login bem-sucedido', token });
        } else {
            res.status(401).json({ message: 'Email ou senha inválidos.' });
        }
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

// Resetar senha
const resetarSenha = async (req, res) => {
    const { token, novaSenha } = req.body;
    try {
        const decoded = jwt.verify(token, SECRET_RECUPERACAO);
        await prisma.usuario.update({
            where: { id: decoded.id },
            data: { senha: novaSenha }
        });
        res.status(200).json({ message: 'Senha redefinida com sucesso!' });
    } catch (err) {
        res.status(400).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = {
    create,
    login,
    solicitarRecuperacao,
    resetarSenha
};