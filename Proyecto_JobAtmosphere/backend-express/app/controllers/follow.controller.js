const axios = require('axios');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const followCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.body;
    const userId = req.userId;
    const user = await User.findById(userId).exec();
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // Verificar si el usuario ya sigue a la empresa
    const isFollowing = user.following.includes(companyId);
    try {
        if (isFollowing) {
            // Si ya la sigue, hacemos unfollow
            user.following = user.following.filter(id => id !== companyId);
            await user.save();
            // Decrementar el contador de followers en el servidor de Prisma
            await axios.put(`http://localhost:3001/follow/${companyId}`, { increment: -1 });
            return res.status(200).json({ message: "Unfollowed company successfully" });
        } else {
            // Si no la sigue, hacemos follow
            user.following.push(companyId);
            await user.save();
            // Incrementar el contador de followers en el servidor de Prisma
            await axios.put(`http://localhost:3001/follow/${companyId}`, { increment: 1 });
            return res.status(200).json({ message: "Followed company successfully" });
        }
    } catch (error) {
        console.error("Error in follow/unfollow process:", error);
        return res.status(500).json({ message: "Error in follow/unfollow process", error: error.message });
    }
});
module.exports = followCompany ;