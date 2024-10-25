const Job = require('../models/job.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const asyncHandler = require('express-async-handler');
const { json } = require('body-parser');

//#region ADD COMMENT
const addCommentsToJob = asyncHandler(async (req, res) => {
    const id = req.userId;
    const author = await User.findById(id).exec();

    if (!author) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }

    const { slug } = req.params;
    const job = await Job.findOne({ slug }).exec();

    if (!job) {
        return res.status(401).json({
            message: "Job Not Found"
        });
    }

    const body = req.body.body;

    if (!body) {
        return res.status(400).json({
            message: "Body is required"
        });
    }

    const newComment = await Comment.create({
        body: body,
        author: author._id,
        job: job._id
    });

    await job.addComment(newComment._id);
    return res.status(200).json({
        comment: await newComment.toCommentResponse(author)
    });
});

// #region GET COMMENTS
const getCommentsFromJob = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const job = await Job.findOne({ slug }).exec();

    if (!job) {
        return res.status(401).json({
            message: "job Not Found"
        });
    }

    const loggedin = req.loggedin;

    if (loggedin) {
        const loginUser = await User.findById(req.userId).exec();
        return await res.status(200).json({
            comments: await Promise.all(job.comments.map(async commentId => {
                const commentObj = await Comment.findById(commentId).exec();
                    return await commentObj.toCommentResponse(loginUser);
            }))
        })
    } else {
        return await res.status(200).json({
            comments: await Promise.all(job.comments.map(async (commentId) => {
                const commentObj = await Comment.findById(commentId).exec();
                const temp = await commentObj.toCommentResponse(null);
                return temp;
            }))
        })
    }
});

// #region DELETE COMMENT
const deleteComment = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const author = await User.findById(userId).exec();

    if (!author) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }

    const { slug, id } = req.params;
    const job = await Job.findOne({ slug }).exec();

    if (!job) {
        return res.status(401).json({
            message: "job Not Found"
        });
    }

    const comment = await Comment.findById(id).exec();

    if (comment.author.toString() === author._id.toString()) {
        await job.removeComment(comment._id);
        await Comment.deleteOne({ _id: comment._id });
        return res.status(200).json({
            message: "comment has been successfully deleted!!!"
        });
    } else {
        return res.status(403).json({
            error: "only the author of the comment can delete the comment"
        })
    }
});

module.exports = {
    addCommentsToJob,
    getCommentsFromJob,
    deleteComment
};