const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const winston = require('winston');

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

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    logger.info(`Registering user: ${username}, ${email}`);
    const newUser = new User({ username, email, password });
    await newUser.save();
    logger.info(`User registered successfully: ${newUser.id}`);
    res.status(201).json(newUser);
  } catch (err) {
    logger.error(`Error registering user: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    logger.info(`Login attempt for user: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`User not found: ${email}`);
      return res.status(400).json({ message: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Invalid credentials for user: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

    logger.info(`User logged in successfully: ${user.id}`);
    res.json({ token, userId: user.id }); // Return token and userId
  } catch (err) {
    logger.error(`Error during login: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
