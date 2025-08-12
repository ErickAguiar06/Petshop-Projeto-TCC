const prisma = require('../connect');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secreta';

const create = async (req, res) => {
    const { nome, email, telefone, senha } = req.body;
    console.log('Dados recebidos:', req.body);

    try {
        const usuario = await prisma.usuario.create({
            data: { nome, email, telefone, senha },
        });
        console.log('Usuário criado:', usuario);
        res.status(201).json(usuario);
    } catch (err) {
        console.error('Erro ao criar usuário:', err);
        res.status(400).json(err);
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;
    console.log('Tentativa de login:', req.body);

    try {
        const usuario = await prisma.usuario.findUnique({
            where: { email },
        });

        if (usuario && usuario.senha === senha) {
            // Gera o token JWT
            const token = jwt.sign(
                { id: usuario.id, email: usuario.email },
                SECRET,
                { expiresIn: '2h' }
            );
            res.status(200).json({ message: 'Login bem-sucedido', token });
        } else {
            res.status(401).json({ message: 'Email ou senha inválidos.' });
        }
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(400).json(err);
    }
};

module.exports = {
    create,
    login,
};
