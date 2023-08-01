import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    author: String,
    content: String,
    time: String,
  });

const Post = mongoose.model('Post', postSchema);

export { Post };