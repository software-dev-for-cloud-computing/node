const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const documentRoutes = require('../routes/documents');
const Document = require('../models/document');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const { Types } = mongoose;

const app = express();
app.use(express.json());
app.use('/documents', documentRoutes);

describe('Document End-to-End Tests', () => {
    let userId;
    let conversationId;

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Create a user
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });
        const savedUser = await user.save();
        userId = savedUser._id;

        // Create a conversation
        const conversation = new Conversation({
            userId: userId,
            title: 'Test Conversation',
        });
        const savedConversation = await conversation.save();
        conversationId = savedConversation._id;
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    describe('GET /documents', () => {
        it('should return all documents', async () => {
            const doc1 = new Document({
                title: 'Test Document 1',
                content: 'Sample content 1',
                type: 'Report',
                year: 2024,
                author: 'Author 1',
                conversationId: conversationId, 
                userId: userId, 
            });
            const doc2 = new Document({
                title: 'Test Document 2',
                content: 'Sample content 2',
                type: 'Article',
                year: 2023,
                author: 'Author 2',
                conversationId: conversationId, 
                userId: userId, 
            });
            await doc1.save();
            await doc2.save();

            const response = await request(app).get('/documents');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2);
        });
    });

    describe('GET /documents/:id', () => {
        it('should return a document by ID', async () => {
            const doc = new Document({
                title: 'Test Document',
                content: 'Sample content',
                type: 'Report',
                year: 2024,
                author: 'Author Test',
                conversationId: conversationId, 
                userId: userId, 
            });
            const savedDoc = await doc.save();

            const response = await request(app).get(`/documents/${savedDoc._id}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.title).toBe('Test Document');
        });

        it('should return 500 if document not found', async () => {
            const response = await request(app).get('/documents/invalid-id');
            expect(response.statusCode).toBe(500); 
        });
    });

    describe('POST /documents', () => {
        it('should create a new document', async () => {
            const newDocument = {
                title: 'New Document',
                content: 'New content',
                type: 'Report',
                year: 2024,
                author: 'John Doe',
                conversationId: conversationId, 
                userId: userId, 
            };

            const response = await request(app)
                .post('/documents')
                .send(newDocument);

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.title).toBe('New Document');
        });

        it('should handle file upload', async () => {
            const response = await request(app)
                .post('/documents')
                .field('title', 'Document with File')
                .field('content', 'Content with file')
                .field('type', 'Report')
                .field('year', 2024)
                .field('author', 'John Doe')
                .field('conversationId', conversationId) 
                .field('userId', userId)
                .attach('file', 'path/to/sample.pdf');

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('_id');
        });
    });

    describe('PUT /documents/:id', () => {
        it('should update a document by ID', async () => {
            const doc = new Document({
                title: 'Test Document',
                content: 'Old content',
                type: 'Report',
                year: 2024,
                author: 'John Doe',
                conversationId: conversationId, 
                userId: userId, 
            });
            const savedDoc = await doc.save();

            const updatedData = {
                title: 'Updated Document',
                content: 'Updated content',
                type: 'Report',
                year: 2024,
                author: 'John Doe',
                conversationId: conversationId, 
                userId: userId, 
            };
            const response = await request(app)
                .put(`/documents/${savedDoc._id}`)
                .send(updatedData);

            expect(response.statusCode).toBe(200);
            expect(response.body.title).toBe('Updated Document');
        });
    });

    describe('DELETE /documents/:id', () => {
        it('should delete a document by ID', async () => {
            const doc = new Document({
                title: 'Test Document',
                content: 'Sample content',
                type: 'Report',
                year: 2024,
                author: 'John Doe',
                conversationId: conversationId, 
                userId: userId, 
            });
            const savedDoc = await doc.save();

            const response = await request(app).delete(`/documents/${savedDoc._id}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Document deleted');
        });
    });

    describe('DELETE /documents', () => {
        it('should delete all documents', async () => {
            await Document.create([
                {
                    title: 'Doc1',
                    content: 'Sample content 1',
                    type: 'Report',
                    year: 2024,
                    author: 'Author 1',
                    conversationId: conversationId, 
                    userId: userId, 
                },
                {/*  */
                    title: 'Doc2',
                    content: 'Sample content 2',
                    type: 'Article',
                    year: 2023,
                    author: 'Author 2',
                    conversationId: conversationId, 
                    userId: userId, 
                },
            ]);
            const response = await request(app).delete('/documents');
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('All documents and associated files have been deleted');
        });
    });
});
