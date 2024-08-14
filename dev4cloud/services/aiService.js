const axios = require('axios');
const { ObjectId } = require('mongodb');

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



  static async sendDocumentToApi(pdfData, userId, documentId, apiKey) {
    try {
      const formData = new FormData();
      formData.append('file', pdfData);

      const url = process.env.DOCUMENT_API_URL;

      const response = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': apiKey,
        },
        params: {
          OwnerId: userId,
          DocumentId: documentId,
        },
      });

      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  }

}

module.exports = AiService;
