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
}

module.exports = AiService;
