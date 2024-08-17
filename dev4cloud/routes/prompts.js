const express = require('express');
const winston = require('winston');
const promptController = require('../controllers/promptController');

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

// GET all prompts
router.get('/', async (req, res) => {
  try {
    logger.info(`Request received: ${req.method} ${req.originalUrl}`);
    await promptController.getAllPrompts(req, res);
    logger.info(`Response sent for: ${req.method} ${req.originalUrl}`);
  } catch (err) {
    logger.error(`Error handling request: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// GET prompt by ID
router.get('/:id', async (req, res) => {
  try {
    logger.info(`Request received: ${req.method} ${req.originalUrl}`);
    await promptController.getPromptById(req, res);
    logger.info(`Response sent for: ${req.method} ${req.originalUrl}`);
  } catch (err) {
    logger.error(`Error handling request: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// POST create new prompt
router.post('/', async (req, res) => {
  try {
    logger.info(`Request received: ${req.method} ${req.originalUrl}`);
    await promptController.createPrompt(req, res);
    logger.info(`Response sent for: ${req.method} ${req.originalUrl}`);
  } catch (err) {
    logger.error(`Error handling request: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// PUT update prompt by ID
router.put('/:id', async (req, res) => {
  try {
    logger.info(`Request received: ${req.method} ${req.originalUrl}`);
    await promptController.updatePrompt(req, res);
    logger.info(`Response sent for: ${req.method} ${req.originalUrl}`);
  } catch (err) {
    logger.error(`Error handling request: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// DELETE prompt by ID
router.delete('/:id', async (req, res) => {
  try {
    logger.info(`Request received: ${req.method} ${req.originalUrl}`);
    await promptController.deletePrompt(req, res);
    logger.info(`Response sent for: ${req.method} ${req.originalUrl}`);
  } catch (err) {
    logger.error(`Error handling request: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
