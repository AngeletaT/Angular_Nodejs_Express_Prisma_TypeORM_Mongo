const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            default: uuidv4,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            match: [/\S+@\S+\.\S+/, "is invalid"],
            index: true,
        },
        bio: {
            type: String,
            default: "",
        },
        image: {
            type: String,
            default: "https://static.productionready.io/images/smiley-cyrus.jpg",
        },
        refresh_token: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.plugin(uniqueValidator);

userSchema.methods.generateAccessToken = function () {
    const accessToken = jwt.sign(
        {
            user: {
                id: this._id,
                email: this.email,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "15m" }
    );
    return accessToken;
};

userSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign(
        {
            user: {
                id: this._id,
                email: this.email,
            },
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "1d" }
    );
    return refreshToken;
};

userSchema.methods.toUserResponse = function () {
    const accessToken = this.generateAccessToken();
    const refreshToken = this.generateRefreshToken();

    this.refresh_token = refreshToken;
    this.save();

    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        access_token: accessToken,
        refresh_token: refreshToken,
    };
};

userSchema.methods.toUserDetails = function () {
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
    };
};

userSchema.methods.toProfileJSON = function (user) {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image,
        following: user ? user.isFollowing(this._id) : false,
    };
};

module.exports = mongoose.model("User", userSchema);
