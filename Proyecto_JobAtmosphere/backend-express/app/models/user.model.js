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
            match: [/\S+@\S+.\S+/, "is invalid"],
            index: true,
        },
        bio: {
            type: String,
            default: "",
        },
        image: {
            type: String,
            default: "",
        },
        refresh_token: {
            type: String,
            default: "",
        },
        favoriteJob: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job"
        }],
        following: [{
            type: String,
            default: "",
        }],
        inscription: [{
            jobId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job"
            },
            status: {
                type: String,
                enum: ["pending", "accepted", "rejected"],
                default: "pending"
            }
        }],
    },
    {
        collection: 'Users'
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', function (next) {
    if (!this.image) {
        this.image = `https://i.pravatar.cc/150?u=${this.username}`;
    }
    next();
});

userSchema.plugin(uniqueValidator);

// #region METHODS
userSchema.methods.generateAccessToken = function () {
    const accessToken = jwt.sign(
        {
            user: {
                id: this._id,
                email: this.email,
                typeuser: 'client'
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
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d" }
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
        favoriteJob: this.favoriteJob,
        following: this.following,
    };
};

// #region PROFILE
userSchema.methods.toProfileUser = async function () {
    const Job = require("./job.model");
    const favoriteJobs = await Job.find({ _id: { $in: this.favoriteJob } }).exec();

    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        favoriteJobs: await Promise.all(favoriteJobs.map(async job => await job.toJobProfile(this))),
    };
};

// #region FAVORITE
userSchema.methods.isFavorite = function (id) {
    const idStr = id.toString();
    for (const job of this.favoriteJob) {
        if (job.toString() === idStr) {
            return true;
        }
    }
    return false;
}

userSchema.methods.favorite = function (id) {
    if (this.favoriteJob.indexOf(id) === -1) {
        this.favoriteJob.push(id);
    }
    return this.save();
}

userSchema.methods.unfavorite = function (id) {
    if (this.favoriteJob.indexOf(id) !== -1) {
        this.favoriteJob.remove(id);
    }
    return this.save();
};

// #region FOLLOW
userSchema.methods.isFollowing = function (id) {
    const idStr = id.toString();
    for (const followingUser of this.following) {
        if (followingUser.toString() === idStr) {
            return true;
        }
    }
    return false;
};

userSchema.methods.follow = function (id) {
    if (this.following.indexOf(id) === -1) {
        this.following.push(id);
    }
    return this.save();
}

userSchema.methods.unfollow = function (id) {
    if (this.following.indexOf(id) !== -1) {
        this.following.remove(id);
    }
    return this.save();
};

module.exports = mongoose.model('User', userSchema);