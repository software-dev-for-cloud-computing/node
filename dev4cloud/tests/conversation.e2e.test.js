const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const conversationRoutes = require('../routes/conversations');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const { Types } = mongoose;

const app = express();
app.use(express.json());
app.use('/conversations', conversationRoutes);

describe('Conversation End-to-End Tests', () => {
  beforeAll(async () => {
    // Verbinde dich mit der Testdatenbank
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Datenbank leeren und trennen
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  describe('GET /conversations', () => {
    it('should return all conversations', async () => {
      // Verwende gültige ObjectIds für userId
      const conversation1 = new Conversation({ userId: new Types.ObjectId(), title: 'Test Conversation 1' });
      const conversation2 = new Conversation({ userId: new Types.ObjectId(), title: 'Test Conversation 2' });
      await conversation1.save();
      await conversation2.save();

      const response = await request(app).get('/conversations');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /conversations/:id', () => {
    it('should return a conversation by ID with messages', async () => {
      const conversation = new Conversation({ userId: new Types.ObjectId(), title: 'Test Conversation' });
      const savedConversation = await conversation.save();

      // Füge Nachrichten hinzu (mit den erforderlichen Feldern role und userId)
      const message1 = new Message({ conversationId: savedConversation._id, content: 'Hello', role: 'user', userId: new Types.ObjectId() });
      const message2 = new Message({ conversationId: savedConversation._id, content: 'Hi', role: 'user', userId: new Types.ObjectId() });
      await message1.save();
      await message2.save();

      const response = await request(app).get(`/conversations/${savedConversation._id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].content).toBe('Hello');
    });

    it('should return 404 if conversation not found', async () => {
      const response = await request(app).get('/conversations/invalid-id');
      expect(response.statusCode).toBe(500);
    });
  });

  describe('POST /conversations', () => {
    it('should create a new conversation', async () => {
      const newConversation = {
        userId: new Types.ObjectId(),
        title: 'New Conversation',
      };

      const response = await request(app)
        .post('/conversations')
        .send(newConversation);
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe('New Conversation');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/conversations').send({});
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('userId and title are required');
    });
  });
});
