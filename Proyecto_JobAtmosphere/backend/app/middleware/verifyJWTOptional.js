const jwt = require('jsonwebtoken');

const verifyJWTOptional = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Token ')) {
        req.loggedin = false;
        return next();
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                // Si el token no es válido, marcar como no autenticado y continuar
                req.loggedin = false;
                return next();
            }
            // Si el token es válido, marcar como autenticado y almacenar la información del usuario
            req.loggedin = true;
            req.userId = decoded.user.id;
            req.userEmail = decoded.user.email;
            req.userHashedPwd = decoded.user.password;
            next();
        }
    );
};

module.exports = verifyJWTOptional;
