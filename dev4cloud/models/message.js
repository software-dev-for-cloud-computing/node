const mongoose = require('mongoose');
const { Schema } = mongoose;


//model for messages
const messageSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    role: { type: String, required: true, enum: ['user', 'ai'] },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
  });

  const Message = mongoose.model('Message', messageSchema);
  module.exports = Message;
