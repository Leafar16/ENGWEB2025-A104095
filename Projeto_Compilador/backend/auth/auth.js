var jwt = require('jsonwebtoken');

module.exports.validate = (req, res, next) => {
    var token = req.query.token || req.body.token || req.headers['authorization'];
    if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')) {
        token = req.headers['authorization'].split(' ')[1];
    }
    if (token) {
        jwt.verify(token, "EngWeb2025", (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Invalid token' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(401).json({ error: 'Token not provided' });
    }
};

module.exports.validateAdmin = (req, res, next) => {
    var token = req.query.token || req.body.token || req.headers['authorization'];
    if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')) {
        token = req.headers['authorization'].split(' ')[1];
    }
    if (token) {
        jwt.verify(token, "EngWeb2025", (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Invalid token' });
            } else {
                if (decoded.level === "admin") {
                    req.decoded = decoded;
                    next();
                } else {
                    res.status(403).json({ error: 'Not authorized' });
                }
            }
        });
    } else {
        res.status(401).json({ error: 'Token not provided' });
    }
};

module.exports.validateClient = (req, res, next) => {
    var token = req.query.token || req.body.token || req.headers['authorization'];
    if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')) {
        token = req.headers['authorization'].split(' ')[1];
    }
    if (token) {
        jwt.verify(token, "EngWeb2025", (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Invalid token' });
            } else {
                if (decoded.level === "client") {
                    req.decoded = decoded;
                    next();
                } else {
                    res.status(403).json({ error: 'Not authorized' });
                }
            }
        });
    } else {
        res.status(401).json({ error: 'Token not provided' });
    }
};