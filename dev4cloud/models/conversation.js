const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
