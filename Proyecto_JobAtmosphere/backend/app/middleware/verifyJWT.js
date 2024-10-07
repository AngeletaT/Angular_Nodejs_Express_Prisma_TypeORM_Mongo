const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshToken.model");
const Blacklist = require("../models/blacklist.model");

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Token ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.userId = decoded.user.id;
        req.userEmail = decoded.user.email;
        req.userHashedPwd = decoded.user.password;
        next();
    });
};

const verifyRefreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;

    const blacklistedToken = await Blacklist.findOne({ token: refreshToken });
    if (blacklistedToken) {
        return res.status(403).json({ message: "Forbidden" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
        if (!tokenDoc) {
            return res.status(403).json({ message: "Forbidden" });
        }

        req.userId = decoded.userId;
        next();
    });
};

const blacklistRefreshToken = async (token) => {
    const blacklistedToken = new Blacklist({ token });
    await blacklistedToken.save();
};

module.exports = { verifyJWT, verifyRefreshToken, blacklistRefreshToken };
