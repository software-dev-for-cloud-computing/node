const mongoose = require('mongoose');
const { Schema } = mongoose;


//model for prompts
const promptSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  prompt: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Prompt = mongoose.model('Prompt', promptSchema);
module.exports = Prompt;
