const mongoose = require('mongoose');
const { Schema } = mongoose;

const documentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  author: { type: String, required: true },
  title: { type: String, required: true },
  year: { type: Number, required: true },
  url: { type: String },
  isbn: { type: String },
  type: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
