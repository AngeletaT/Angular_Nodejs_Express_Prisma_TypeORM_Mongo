const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const refreshTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

refreshTokenSchema.methods.generateToken = function (userId) {
    const token = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    this.token = token;
    this.userId = userId;
    this.expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    return this.save().then(() => token);
};

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
