const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

router.get('/', conversationController.getAllConversations);
router.get('/:id', conversationController.getConversationById);

module.exports = router;
