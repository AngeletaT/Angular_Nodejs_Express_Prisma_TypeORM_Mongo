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
        timestamps: true
    });

// #region TO COMMENT RESPONSE
commentSchema.methods.toCommentResponse = async function (user) {
    const authorObj = await User.findById(this.author).exec();

    return {
        id: this._id,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: authorObj.toProfileJSON(user)
    }

}

module.exports = mongoose.model('Comment', commentSchema);