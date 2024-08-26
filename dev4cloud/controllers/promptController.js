const Prompt = require('../models/prompt');
const Message = require('../models/message');

//return all prompts
exports.getAllPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find().populate('conversationId');
    res.json(prompts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//returns prompt with id
exports.getPromptById = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id).populate('conversationId');
    if (!prompt) return res.status(404).json({ message: 'Prompt not found' });
    res.json(prompt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//creates new prompt
exports.createPrompt = async (req, res) => {
  const { userId, conversationId, prompt } = req.body;
  try {
    const newPrompt = new Prompt({ userId, conversationId, prompt });
    await newPrompt.save();

    const newMessage = new Message({
      userId,
      conversationId,
      role: 'user',
      content: prompt,
      created_at: new Date()
    });
    await newMessage.save();

    res.status(201).json(newPrompt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//updates prompt
exports.updatePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('conversationId');
    if (!prompt) return res.status(404).json({ message: 'Prompt not found' });
    res.json(prompt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//deletes prompt
exports.deletePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findByIdAndDelete(req.params.id);
    if (!prompt) return res.status(404).json({ message: 'Prompt not found' });
    res.json({ message: 'Prompt deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
