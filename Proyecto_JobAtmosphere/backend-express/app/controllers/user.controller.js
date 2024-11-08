const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const argon2 = require("argon2");
const Blacklist = require("../models/blacklist.model");

const registerUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // Confirmar datos
    if (!user || !user.email || !user.username || !user.password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const existingUser = await User.find({ $or: [{ email: user.email }, { username: user.username }] });
    if (existingUser.length > 0) {
        return res.status(409).json({ message: "Un usuario con este correo electrónico o nombre de usuario ya existe" });
    }

    // Hashear contraseña
    const hashedPwd = await argon2.hash(user.password);

    const userObject = {
        username: user.username,
        password: hashedPwd,
        email: user.email,
    };

    const createdUser = await User.create(userObject);

    if (createdUser) {
        res.status(201).json({
            message: "Usuario registrado correctamente",
        });
    } else {
        res.status(422).json({
            errors: {
                body: "No se pudo registrar un usuario",
            },
        });
    }
});

const userLogin = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // confirm data
    if (!user || !user.email || !user.password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const loginUser = await User.findOne({ email: user.email }).exec();

    if (!loginUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const match = await argon2.verify(loginUser.password, user.password);

    if (!match) {
        return res.status(401).json({ message: "No autorizado: Contraseña incorrecta" });
    }

    if (loginUser.refresh_token) {
        const tokenExists = await Blacklist.findOne({ token: loginUser.refresh_token }).exec();
        if (!tokenExists) {
            await Blacklist.create({ token: loginUser.refresh_token, userId: loginUser._id });
        }
    }

    const response = loginUser.toUserResponse();
    res.status(200).json({
        user: response,
    });
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const email = req.userEmail;

    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
        user: user.toUserDetails(),
    });
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
        user: target.toUserDetails(),
    });
});

const getUserProfile = asyncHandler(async (req, res) => {
    const email = req.userEmail;

    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const profileUser = await user.toProfileUser();

    res.status(200).json({
        user: profileUser,
    });
});

const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User
        .findById(id)
        .exec();
    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({
        user: user,
    });
});

module.exports = {
    registerUser,
    getCurrentUser,
    userLogin,
    updateUser,
    getUserProfile,
    getUserById,
};
