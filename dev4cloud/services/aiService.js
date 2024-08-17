const axios = require('axios');
const { ObjectId } = require('mongodb');
const FormData = require('form-data');

class AiService {
  static async fetchAiResponse(query, userId, conversationId, apiKey, chatHistory) {
    try {
      const userIdStr = userId instanceof ObjectId ? userId.toHexString() : userId;
      const conversationIdStr = conversationId instanceof ObjectId ? conversationId.toHexString() : conversationId;

      const url = `${process.env.AI_SERVICE_URL}?query=${encodeURIComponent(query)}&user_id=${encodeURIComponent(userIdStr)}&conversation_id=${encodeURIComponent(conversationIdStr)}`;

      console.log('Request URL:', url);
      console.log('Request Headers:', {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      });
      console.log('Request Body:', chatHistory);

      const response = await axios.post(url, chatHistory, {
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json',
        }
      });

      if (response.status !== 200) {
        throw new Error('AI service request failed');
      }

      return response.data;
    } catch (error) {
      throw new Error(`Error fetching AI response: ${error.message}`);
    }
  }




  static async fetchAiResponseMock(query) {
    // Simulate a mock response from the AI service
    const aiResponse = {
      answer: 'This is a mock AI response',
      // Add more mock data if needed
    };
    
    // Simulate a delay (optional, to mimic network delays)
    await new Promise(resolve => setTimeout(resolve, 1000));

    return aiResponse;
  }



  static async sendDocumentToApi(file, userId, documentId,conversationId, apiKey) {
    try {
      console.log('test')
      const formData = new FormData();
      
      // Append the file directly
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
        knownLength: file.size,
      });

      const url = process.env.DOCUMENT_API_URL;

      // Log the request URL and headers
      console.log('Request URL:', url);
      console.log('Request Headers:', {
        ...formData.getHeaders(),
        'X-Api-Key': apiKey,
      });

      const response = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': apiKey,
        },
        params: {
          OwnerId: userId,
          DocumentId: documentId,
          ConversationId : conversationId,
        },
      });

      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      throw new Error(`Error sending document to API: ${error.message}`);
    }
  }

}

module.exports = AiService;
