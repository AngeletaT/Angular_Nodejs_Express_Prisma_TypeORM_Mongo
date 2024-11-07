const mongoose = require('mongoose');
const slugify = require('slugify');
const uniqueValidator = require('mongoose-unique-validator');
const User = require('../models/user.model.js');
const { log } = require('console');

const JobSchema = mongoose.Schema({
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    images: [],
    img: {
        type: String,
        required: true
    },
    id_cat: {
        type: String,
        required: true
    },
    favoritesCount: {
        type: Number,
        default: 0
    },
    recruiter: {
        type: String,
        default: ""
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    application: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        }
    }],
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'Jobs'
});

// #region PLUGINS
JobSchema.plugin(uniqueValidator, { msg: "already taken" });

JobSchema.pre('validate', async function (next) {
    if (!this.slug) {
        await this.slugify();
    }
    next();
});

// #region SLUGIFY
JobSchema.methods.slugify = async function () {
    this.slug = slugify(this.name) + '-' + (Math.random() * Math.pow(36, 10) | 0).toString(36);
};

// #region JOB RESPONSE
JobSchema.methods.toJobResponse = async function (user) {

    // return user;
    return {
        id: this._id,
        slug: this.slug,
        name: this.name,
        salary: this.salary,
        description: this.description,
        company: this.company,
        id_cat: this.id_cat,
        img: this.img,
        images: this.images,
        favorited: user ? user.isFavorite(this._id) : false,
        favoritesCount: this.favoritesCount || 0,
        comments: this.comments,
        isActive: this.isActive,
        application: this.application,
        recruiter: this.recruiter
    };
};

JobSchema.methods.toJobProfile = async function (user) {
    return {
        slug: this.slug,
        name: this.name,
        salary: this.salary,
        description: this.description,
        company: this.company,
        id_cat: this.id_cat,
        img: this.img,
        favorited: user ? user.isFavorite(this._id) : false,
        favoritesCount: this.favoritesCount || 0,
        isActive: this.isActive,
    };
};

// #region CAROUSEL RESPONSE
JobSchema.methods.toJobCarouselResponse = async function () {
    return {
        images: this.images,
    };
};

// #region FAVORITES
JobSchema.methods.updateFavoriteCount = async function () {
    const job = this;
    const count = await User.countDocuments({ favoriteJob: job._id }).exec();
    job.favoritesCount = count;
    return job.save();
};

// #region COMMENTS
JobSchema.methods.addComment = function (commentId) {
    this.comments.unshift(commentId);
    return this.save();
};

JobSchema.methods.removeComment = function (commentId) {
    this.comments.pull(commentId);
    return this.save();
};

// #region EXPORTS
module.exports = mongoose.model("Job", JobSchema);
