const express = require('express');
const winston = require('winston');
const conversationController = require('../controllers/conversationController');

const router = express.Router();

// Create a logger using winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

// Middleware to log requests
router.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// GET all conversations
router.get('/', async (req, res) => {
  try {
    logger.info(`Request received: ${req.method} ${req.originalUrl}`);
    await conversationController.getAllConversations(req, res);
    logger.info(`Response sent for: ${req.method} ${req.originalUrl}`);
  } catch (err) {
    logger.error(`Error handling request: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// GET conversation by ID
router.get('/:id', async (req, res) => {
  try {
    logger.info(`Request received: ${req.method} ${req.originalUrl}`);
    await conversationController.getConversationById(req, res);
    logger.info(`Response sent for: ${req.method} ${req.originalUrl}`);
  } catch (err) {
    logger.error(`Error handling request: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// POST create new conversation
router.post('/', async (req, res) => {
  try {
    logger.info(`Request received: ${req.method} ${req.originalUrl}`);
    await conversationController.createConversation(req, res);
    logger.info(`Response sent for: ${req.method} ${req.originalUrl}`);
  } catch (err) {
    logger.error(`Error handling request: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
