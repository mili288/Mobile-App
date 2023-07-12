import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    room: String,
    author: String,
    message: String,
    time: String,
  });

const Messages = mongoose.model('Messages', messageSchema);

export { Messages };