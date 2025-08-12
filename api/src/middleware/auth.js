const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secreta';

function autenticarJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET, (err, usuario) => {
            if (err) return res.sendStatus(403);
            req.usuario = usuario;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}
module.exports = autenticarJWT;