const jwt = require('jsonwebtoken');

let refreshTokenBlacklist = [];

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Token ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.userId = decoded.user.id;
            req.userEmail = decoded.user.email;
            req.userHashedPwd = decoded.user.password;
            next();
        }
    );
};

const verifyRefreshToken = (req, res, next) => {
    const { refreshToken } = req.body;

    if (refreshTokenBlacklist.includes(refreshToken)) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.userId = decoded.user.id;
            req.userEmail = decoded.user.email;
            req.userHashedPwd = decoded.user.password;
            next();
        }
    );
};

const blacklistRefreshToken = (token) => {
    refreshTokenBlacklist.push(token);
};

module.exports = { verifyJWT, verifyRefreshToken, blacklistRefreshToken };
