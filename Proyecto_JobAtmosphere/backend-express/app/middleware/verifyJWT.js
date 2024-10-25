const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Blacklist = require('../models/blacklist.model');

// Middleware para verificar el JWT
const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Token ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const accessToken = authHeader.split(' ')[1];

    try {
        // 1. Decodificar el accessToken sin verificar la firma
        const decodedAccessToken = jwt.decode(accessToken);
        if (!decodedAccessToken || !decodedAccessToken.user) {
            return res.status(403).json({ message: 'Forbidden: Token invalid' });
        }

        // 2. Buscar al usuario en la base de datos
        const user = await User.findById(decodedAccessToken.user.id).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 3. Verificar el refreshToken del usuario
        const refreshToken = user.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Unauthorized: Refresh token not found' });
        }

        // 4. Comprobar si el refreshToken está en la blacklist
        const tokenExistsInBlacklist = await Blacklist.findOne({ token: refreshToken }).exec();
        if (tokenExistsInBlacklist) {
            return res.status(401).json({ message: 'Unauthorized: Refresh token invalid' });
        }

        // 5. Verificar el refreshToken
        try {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Unauthorized: Refresh token expired' });
        }

        // 6. Verificar el accessToken
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
                if (err) {
                    // Si el accessToken ha expirado, generar un nuevo accessToken usando el refreshToken
                    try {
                        const newAccessToken = user.generateAccessToken();
                        req.headers.authorization = `Token ${newAccessToken}`;
                        req.userId = user._id;
                        req.userEmail = user.email;
                        req.user = user;
                        next();
                    } catch (err) {
                        return res.status(403).json({ message: 'Forbidden: Could not generate a new access token' });
                    }
                } else {
                    // Si el accessToken es válido
                    req.userId = decoded.user.id;
                    req.userEmail = decoded.user.email;
                    req.user = user;
                    next();
                }
            }
        );
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Middleware para el logout del usuario
const logoutUser = async (req, res) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Token ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const accessToken = authHeader.split(' ')[1];

    try {
        // 1. Decodificar el accessToken sin verificar la firma
        const decodedAccessToken = jwt.decode(accessToken);
        if (!decodedAccessToken || !decodedAccessToken.user) {
            return res.status(403).json({ message: 'Forbidden: Token invalid' });
        }

        // 2. Buscar al usuario en la base de datos
        const user = await User.findById(decodedAccessToken.user.id).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 3. Obtener el refreshToken del usuario y añadirlo a la blacklist
        const refreshToken = user.refresh_token;
        if (refreshToken) {
            await Blacklist.create({ token: refreshToken, userId: user._id });
        }

        res.status(200).json({ message: 'Session successfully closed' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
module.exports = {
    verifyJWT,
    logoutUser
};