const jwt = require('jsonwebtoken');
const SECRET = 'EngWeb2025';

function verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        res.locals.user = decoded;
        next();
    } catch (err) {
        console.error('Token inválido:', err);
        return res.clearCookie('token').redirect('/login');
    }
}

function getRole(tokem) {
    try {
        const decoded = jwt.verify(tokem, SECRET);
        return decoded.level;
    } catch (err) {
        console.error('Erro ao decodificar token:', err);
        return null;
    }
}

function verifyAdminToken(req, res, next) {
    verifyToken(req, res, function () {
        if (req.user && req.user.level === 'admin') {
            next();
        } else {
            res.status(403).send('Acesso negado: Admins apenas.');
        }
    });
}

module.exports = { verifyToken, verifyAdminToken, getRole };
