const express = require('express');
const winston = require('winston');
const tagController = require('../controllers/tagController');

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

// GET all tags
router.get('/', async (req, res) => {
  try {
    logger.info(`Request received: ${req.method} ${req.originalUrl}`);
    await tagController.getAllTags(req, res);
    logger.info(`Response sent for: ${req.method} ${req.originalUrl}`);
  } catch (err) {
    logger.error(`Error handling request: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// GET tag by ID
router.get('/:id', async (req, res) => {
  try {
    logger.info(`Request received: ${req.method} ${req.originalUrl}`);
    await tagController.getTagById(req, res);
    logger.info(`Response sent for: ${req.method} ${req.originalUrl}`);
  } catch (err) {
    logger.error(`Error handling request: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// POST create new tag
router.post('/', async (req, res) => {
  try {
    logger.info(`Request received: ${req.method} ${req.originalUrl}`);
    await tagController.createTag(req, res);
    logger.info(`Response sent for: ${req.method} ${req.originalUrl}`);
  } catch (err) {
    logger.error(`Error handling request: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// PUT update tag by ID
router.put('/:id', async (req, res) => {
  try {
    logger.info(`Request received: ${req.method} ${req.originalUrl}`);
    await tagController.updateTag(req, res);
    logger.info(`Response sent for: ${req.method} ${req.originalUrl}`);
  } catch (err) {
    logger.error(`Error handling request: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// DELETE tag by ID
router.delete('/:id', async (req, res) => {
  try {
    logger.info(`Request received: ${req.method} ${req.originalUrl}`);
    await tagController.deleteTag(req, res);
    logger.info(`Response sent for: ${req.method} ${req.originalUrl}`);
  } catch (err) {
    logger.error(`Error handling request: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
