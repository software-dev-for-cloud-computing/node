const axios = require('axios');
const { ObjectId } = require('mongodb');

class AiService {
  static async fetchAiResponse(query, userId, conversationId, apiKey, chatHistory) {
    try {
      // Erstellen der Anfrage-Parameter als Strings
      const userIdStr = userId instanceof ObjectId ? userId.toHexString() : userId;
      const conversationIdStr = conversationId instanceof ObjectId ? conversationId.toHexString() : conversationId;

      // URL mit den Query-Parametern
      const url = `http://127.0.0.1:8000/api/v1/qa?query=${encodeURIComponent(query)}&user_id=${encodeURIComponent(userIdStr)}&conversation_id=${encodeURIComponent(conversationIdStr)}`;

      // Logging der Anfrage-Details
      console.log('Request URL:', url);
      console.log('Request Headers:', {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      });
      console.log('Request Body:', chatHistory);

      // POST-Anfrage durchführen
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
            // Create a FormData instance to handle the binary data
            const formData = new FormData();
            formData.append('file', pdfData); // 'file' should match the expected field name in the API

            // Construct the URL without query parameters
            const url = 'http://127.0.0.1:8000/api/v1/document';

            // Make the POST request
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
