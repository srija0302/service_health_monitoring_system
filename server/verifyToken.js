const jwt = require('jsonwebtoken');
const config = require('./config')
const secretKey = config.jwtSecretKey;
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ success: false, message: 'Token not provided' });
    }

    jwt.verify(token.replace('Bearer ', ''), secretKey, (err, user) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
        }

        req.user = user;
        next();
    });
};

module.exports = verifyToken;
