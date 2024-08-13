const axios = require('axios');

class AiService {
  static async fetchAiResponse(query) {
    try {
      const response = await axios.post('http://localhost:5000/ai', { query }, {
        headers: {
          'Content-Type': 'application/json'
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

        // Make the POST request
        const response = await axios.post('http://127.0.0.1:8000/api/v1/document', formData, {
            headers: {
                'X-Api-Key': apiKey,
                'Content-Type': 'multipart/form-data' // This tells the server we're sending form data
            },
            params: {
                OwnerId: userId,
                DocumentId: documentId
            }
        });

        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}


}

module.exports = AiService;
