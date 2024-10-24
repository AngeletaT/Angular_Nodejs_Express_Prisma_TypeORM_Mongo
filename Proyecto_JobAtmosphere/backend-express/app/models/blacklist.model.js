const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
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
    },
    {
        collection: "Blacklist",
    },
    {
        timestamps: true,
    }
);

const Blacklist = mongoose.model("Blacklist", blacklistSchema);

module.exports = Blacklist;
