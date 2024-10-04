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
        refreshToken: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.plugin(uniqueValidator);

// @desc generate access token for a user
// @required valid email and password
userSchema.methods.generateAccessToken = function () {
    const accessToken = jwt.sign(
        {
            user: {
                id: this._id,
                email: this.email,
                password: this.password,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
    return accessToken;
};

// @desc generate refresh token for a user
userSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign(
        {
            user: {
                id: this._id,
                email: this.email,
                password: this.password,
            },
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    );
    this.refreshToken = refreshToken;
    return this.save().then(() => refreshToken);
};

userSchema.methods.toUserResponse = function () {
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        token: this.generateAccessToken(),
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
