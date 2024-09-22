const mongoose = require('mongoose');
const slugify = require('slugify');
const uniqueValidator = require('mongoose-unique-validator');
// const User = require('../models/user.model.js');
const { log } = require('console');

// #region SCHEMA
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
    // author: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    // favouritesCount: {
    //     type: Number,
    //     default: 0
    // },
    // comments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Comment'
    // }]
});

// #region PLUGINS
JobSchema.plugin(uniqueValidator, { msg: "already taken" });

JobSchema.pre('validate', async function (next) {
    if (!this.slug) {
        // console.log('dentro del if');
        await this.slugify();
    }
    // console.log(this.slug);
    next();
});

// #region SLUGIFY
JobSchema.methods.slugify = async function () {
    this.slug = slugify(this.name) + '-' + (Math.random() * Math.pow(36, 10) | 0).toString(36);
};

// #region JOB RESPONSE
JobSchema.methods.toJobResponse = async function (user) {

    // const authorObj = await User.findById(this.author).exec();

    if (user !== null || user !== undefined) {
        // return "hay usuario"
        return {
            slug: this.slug,
            name: this.name,
            salary: this.salary,
            description: this.description,
            company: this.company,
            id_cat: this.id_cat,
            img: this.img,
            images: this.images,
            // favorited: user.isFavorite(this._id),
            // favoritesCount: this.favouritesCount,
            // author: authorObj.toProfileJSON(user)
        }
    } else {
        // return "no hay usuario"
        return {
            slug: this.slug,
            name: this.name,
            salary: this.salary,
            description: this.description,
            company: this.company,
            id_cat: this.id_cat,
            img: this.img,
            images: this.images,
            // favorited: false,
            // favoritesCount: this.favouritesCount,
            // author: authorObj.toProfileUnloggedJSON()
        }
    }
}

// #region CAROUSEL RESPONSE
// JobSchema.methods.toJobCarouselResponse = async function () {
//     return {
//         images: this.images
//     }
// }

// #region ADD FAVORITE
// JobSchema.methods.updateFavoriteCount = async function () {

//     const favoriteCount = await User.count({
//         favouriteJob: { $in: [this._id] }
//     });

//     // return favoriteCount; 
//     this.favouritesCount = favoriteCount;

//     return this.save();
// }

// #region ADD COMMENT
// JobSchema.methods.addComment = function (commentId) {
//     if (this.comments.indexOf(commentId) === -1) {
//         this.comments.push(commentId);
//     }
//     return this.save();
// };

// #region DELETE COMMENT
// JobSchema.methods.removeComment = function (commentId) {
//     if (this.comments.indexOf(commentId) !== -1) {
//         this.comments.remove(commentId);
//     }
//     return this.save();
// };

// #region EXPORTS
module.exports = mongoose.model('Job', JobSchema);