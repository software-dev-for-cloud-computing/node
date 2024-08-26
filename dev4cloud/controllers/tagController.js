const Tag = require('../models/tag');

//returns all tags
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//returns tag with id
exports.getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: 'Tag not found' });
    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//creates new tag
exports.createTag = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newTag = new Tag({ name, description });
    await newTag.save();
    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//updates tag
exports.updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tag) return res.status(404).json({ message: 'Tag not found' });
    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//deletes tag
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return res.status(404).json({ message: 'Tag not found' });
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
