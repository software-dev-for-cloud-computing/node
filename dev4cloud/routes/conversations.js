// routes/conversations.js
const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

// GET all conversations
router.get('/', conversationController.getAllConversations);

// GET conversation by ID
router.get('/:id', conversationController.getConversationById);

// POST create new conversation
router.post('/', conversationController.createConversation);

module.exports = router;
