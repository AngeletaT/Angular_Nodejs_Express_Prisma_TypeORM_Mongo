const mongoose = require('mongoose');
const User = require("./user.model");

// #region SCHEMA
const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }
},
    {
        collection: 'Comments'
    },
    {
        timestamps: true
    });

// #region TO COMMENT RESPONSE
commentSchema.methods.toCommentResponse = async function (user) {
    // console.log("Fetching author for comment:", this._id);
    const authorObj = await User.findById(this.author).exec();

    if (!authorObj) {
        // console.log("Author not found for comment:", this._id);
        return {
            id: this._id,
            body: this.body,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            author: null
        };
    }

    // console.log("Author found:", authorObj.username);

    return {
        id: this._id,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: await authorObj.toProfileUser(user)
    };
}

module.exports = mongoose.model('Comment', commentSchema);