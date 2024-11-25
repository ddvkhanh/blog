const { default: mongoose } = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    thumbnail: {
        data: Buffer,
        contentType: String,
        fileName: String,
    },
    createdAt: {type: Date, default: Date.now},
})

const Post = mongoose.model('Post', postSchema);