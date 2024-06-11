const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
