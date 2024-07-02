const Conversation = require('../models/conversation');
const Message = require('../models/message');

// Get all conversations
exports.getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find();
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get conversation by ID
exports.getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    // Fetch all messages for the conversation
    const messages = await Message.find({ conversationId: req.params.id }).sort({ created_at: 1 });

    // Return only messages in the response
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new conversation
exports.createConversation = async (req, res) => {
  const { userId, title } = req.body;

  if (!userId || !title) {
    return res.status(400).json({ message: 'userId and title are required' });
  }

  try {
    const newConversation = new Conversation({
      userId,
      title
    });

    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  
};
