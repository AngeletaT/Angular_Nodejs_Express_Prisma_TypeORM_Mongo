const asyncHandler = require("express-async-handler");
const User = require("../models/user.model.js");
const RefreshToken = require("../models/refreshToken.model.js");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { blacklistRefreshToken } = require("../middleware/verifyJWT");

const registerUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // confirm data
    if (!user || !user.email || !user.username || !user.password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const existingUser = await User.find({ $or: [{ email: user.email }, { username: user.username }] });
    if (existingUser.length > 0) {
        return res.status(409).json({ message: "Un usuario con este correo electrónico o nombre de usuario ya existe" });
    }

    // hash password
    const hashedPwd = await argon2.hash(user.password);

    const userObject = {
        username: user.username,
        password: hashedPwd,
        email: user.email,
    };

    const createdUser = await User.create(userObject);

    if (createdUser) {
        // user object created successfully
        res.status(201).json({
            user: createdUser.toUserResponse(),
        });
    } else {
        res.status(422).json({
            errors: {
                body: "No se pudo registrar un usuario",
            },
        });
    }
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const email = req.userEmail;

    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
        user: user.toUserResponse(),
    });
});

const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Verificar que el email y la contraseña estén presentes
    if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    const user = await User.findOne({ email }).exec();

    // Verificar que el usuario exista
    if (!user) {
        return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Generar nuevos tokens
    const accessToken = user.generateAccessToken();
    const refreshTokenDoc = new RefreshToken();
    const refreshToken = await refreshTokenDoc.generateToken(user._id);

    res.json({ user: user.toUserResponse(), accessToken, refreshToken });
});

const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc) {
        return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
        return res.status(403).json({ message: "Forbidden" });
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshTokenDoc = new RefreshToken();
    const newRefreshToken = await newRefreshTokenDoc.generateToken(user._id);

    // Blacklist the old refresh token
    await blacklistRefreshToken(refreshToken);

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
});

const updateUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // confirm data
    if (!user) {
        return res.status(400).json({ message: "Required a User object" });
    }

    const email = req.userEmail;

    const target = await User.findOne({ email }).exec();

    if (user.email) {
        target.email = user.email;
    }
    if (user.username) {
        target.username = user.username;
    }
    if (user.password) {
        const hashedPwd = await argon2.hash(user.password);
        target.password = hashedPwd;
    }
    if (typeof user.image !== "undefined") {
        target.image = user.image;
    }
    if (typeof user.bio !== "undefined") {
        target.bio = user.bio;
    }
    await target.save();

    return res.status(200).json({
        user: target.toUserResponse(),
    });
});

const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    // Blacklist the refresh token
    await blacklistRefreshToken(refreshToken);

    res.status(200).json({ mensaje: "Cierre de sesión exitoso" });
});

module.exports = {
    registerUser,
    getCurrentUser,
    userLogin,
    refreshToken,
    updateUser,
    logout,
};
