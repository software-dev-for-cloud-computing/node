const mongoose = require('mongoose');
const { Schema } = mongoose;

//model for answers
const answerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  promptId: { type: Schema.Types.ObjectId, ref: 'Prompt', required: true },
  answer: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
