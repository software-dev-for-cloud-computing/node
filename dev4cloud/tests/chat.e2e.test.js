const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const chatRoutes = require('../routes/chat'); // Adjust path as needed
const AiService = require('../services/aiService');
const Message = require('../models/message');
const Prompt = require('../models/prompt');
const app = express();

// Use JSON middleware
app.use(express.json());
app.use('/chat', chatRoutes);

// Mock the AiService and database models
jest.mock('../services/aiService');
jest.mock('../models/message');
jest.mock('../models/prompt');

describe('GET /chat/response', () => {
  let userId;
  let conversationId;
  let apiKey;
  let documentId;

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create mock data
    userId = new mongoose.Types.ObjectId();
    conversationId = new mongoose.Types.ObjectId();
    apiKey = 'test-api-key';
    documentId = new mongoose.Types.ObjectId();

    // Mock database operations
    Message.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([
        { role: 'user', content: 'Hello', userId, conversationId, created_at: new Date() },
        { role: 'ai', content: 'Hi there', userId, conversationId, created_at: new Date() }
      ])
    });

    AiService.fetchAiResponse.mockResolvedValue({
      answer: 'This is a response from AI.',
      chat_history: [],
      context: []
    });

    Prompt.prototype.save = jest.fn().mockResolvedValue();
    Message.prototype.save = jest.fn().mockResolvedValue();
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should return chat response successfully', async () => {
    const response = await request(app)
      .get('/chat/response')
      .query({ query: 'How are you?', userId, conversationId, apiKey, documentId });

    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('This is a response from AI.');
    expect(Message.prototype.save).toHaveBeenCalledTimes(2);
    expect(Prompt.prototype.save).toHaveBeenCalled();
  });

  it('should handle errors from AiService and return 500', async () => {
    AiService.fetchAiResponse.mockRejectedValue(new Error('AI Service Error'));

    const response = await request(app)
      .get('/chat/response')
      .query({ query: 'How are you?', userId, conversationId, apiKey, documentId });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('AI Service Error');
  });

  it('should handle missing query parameters and return 500', async () => {
    const response = await request(app).get('/chat/response');

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('AI Service Error');
  });
});
