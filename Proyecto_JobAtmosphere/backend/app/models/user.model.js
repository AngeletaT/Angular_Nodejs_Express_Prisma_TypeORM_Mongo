const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// #region SCHEMA
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
        favouriteJob : [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        }],
    },
    {
        timestamps: true,
    }
);

userSchema.plugin(uniqueValidator);

// #region METHODS
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

// #region TO USER RESPONSE
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
        token: accessToken,
        refresh_token: refreshToken,
    };
};

// #region TO USER DETAILS
userSchema.methods.toUserDetails = function () {
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
    };
};

// #region TO PROFILE JSON
userSchema.methods.toProfileJSON = function (user) {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image,
        following: user ? user.isFollowing(this._id) : false,
    };
};

// #region FAVORITE JOB
userSchema.methods.isFavorite = function (id) {
    const idStr = id.toString();
    for (const article of this.favouriteJob) {
        if (article.toString() === idStr) {
            return true;
        }
    }
    return false;
}

userSchema.methods.favorite = function (id) {
    if(this.favouriteJob.indexOf(id) === -1){
        this.favouriteJob.push(id);
    }
    return this.save();
}

userSchema.methods.unfavorite = function (id) {
    if(this.favouriteJob.indexOf(id) !== -1){
        this.favouriteJob.remove(id);
    }
    return this.save();
};

module.exports = mongoose.model("User", userSchema);
