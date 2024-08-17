const axios = require('axios');
const { ObjectId } = require('mongodb');
const FormData = require('form-data');
const winston = require('winston');

class AiService {
  static logger = winston.createLogger({
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

  static async fetchAiResponse(query, userId, conversationId, apiKey, chatHistory) {
    try {
      const userIdStr = userId instanceof ObjectId ? userId.toHexString() : userId;
      const conversationIdStr = conversationId instanceof ObjectId ? conversationId.toHexString() : conversationId;

      const url = `${process.env.AI_SERVICE_URL}?query=${encodeURIComponent(query)}&user_id=${encodeURIComponent(userIdStr)}&conversation_id=${encodeURIComponent(conversationIdStr)}`;
      
      AiService.logger.info(`Fetching AI response from: ${url}`);

      const response = await axios.post(url, chatHistory, {
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json',
        }
      });

      if (response.status !== 200) {
        throw new Error('AI service request failed');
      }

      AiService.logger.info(`AI response received successfully: ${response.status}`);
      return response.data;
    } catch (error) {
      AiService.logger.error(`Error fetching AI response: ${error.message}`);
      throw new Error(`Error fetching AI response: ${error.message}`);
    }
  }

  static async fetchAiResponseMock(query) {
    try {
      // Simulate a mock response from the AI service
      const aiResponse = {
        answer: 'This is a mock AI response',
        // Add more mock data if needed
      };
      
      // Simulate a delay (optional, to mimic network delays)
      await new Promise(resolve => setTimeout(resolve, 1000));

      AiService.logger.info(`Mock AI response generated for query: ${query}`);
      return aiResponse;
    } catch (error) {
      AiService.logger.error(`Error generating mock AI response: ${error.message}`);
      throw new Error(`Error generating mock AI response: ${error.message}`);
    }
  }

  static async sendDocumentToApi(file, userId, documentId, conversationId, apiKey) {
    try {
      const formData = new FormData();
      
      // Append the file directly
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
        knownLength: file.size,
      });

      const url = process.env.DOCUMENT_API_URL;

      AiService.logger.info(`Sending document to API at: ${url}`);

      const response = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': apiKey,
        },
        params: {
          OwnerId: userId,
          DocumentId: documentId,
          ConversationId: conversationId,
        },
      });

      AiService.logger.info(`Document sent successfully: ${response.status}`);
      return response.data;
    } catch (error) {
      AiService.logger.error(`Error sending document to API: ${error.response ? error.response.data : error.message}`);
      throw new Error(`Error sending document to API: ${error.message}`);
    }
  }
}

module.exports = AiService;
