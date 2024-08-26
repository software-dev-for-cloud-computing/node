const AiService = require('../services/aiService');
const Message = require('../models/message');
const Prompt = require('../models/prompt');

// Controller to handle AI chat responses
exports.getChatResponse = async (req, res) => {
  try {
    const { query, userId, conversationId, apiKey, documentId } = req.query;

    // Save the user's query as a prompt and message
    await saveUserQuery(query, userId, conversationId);

    // Fetch chat history and context to assist with AI response
    const { chat_history, context } = await fetchChatHistory(conversationId);

    // Call AI service to get the AI's response
    const aiResponse = await AiService.fetchAiResponse(query, userId, conversationId, apiKey, chat_history, documentId);

    // Save the AI response as a message with the role "ai"
    await saveAiResponse(aiResponse.answer, conversationId, userId);

    // Combine the AI response with any prepared data
    const response = aiResponse;

    // Send the response data as the HTTP response
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to fetch chat history from the database
async function fetchChatHistory(conversationId) {
  try {
    // Example query to get messages from the database
    const chatHistory = await Message.find({ conversationId })
      .sort({ created_at: -1 }) // Sort by creation time in descending order
      .limit(6) // Limit to the last 6 messages
      .exec();

    // Filter and categorize the latest messages
    const userMessages = [];
    const aiMessages = [];

    // Loop through messages and categorize as user or AI
    chatHistory.forEach(message => {
      if (message.role === 'user' && userMessages.length < 3) {
        userMessages.push(message);
      } else if (message.role === 'ai' && aiMessages.length < 3) {
        aiMessages.push(message);
      }
    });

    // Format the response data
    const chat_history = [...userMessages, ...aiMessages].map(message => ({
      role: message.role,
      content: message.content,
      user_id: message.userId.toHexString(), // Convert ObjectId to String
      conversation_id: message.conversationId.toHexString(), // Convert ObjectId to String
      timestamp: message.created_at.toISOString() // Format timestamp
    }));

    // Create context (placeholder here)
    const context = [];

    return { chat_history, context };
  } catch (error) {
    throw new Error(`Error fetching chat history: ${error.message}`);
  }
}

// Function to save the user's query as a prompt and message
async function saveUserQuery(query, userId, conversationId) {
  try {
    // Save the user's query as a prompt
    const prompt = new Prompt({
      userId,
      conversationId,
      prompt: query
    });
    await prompt.save();

    // Save the user's query as a message
    const userMessage = new Message({
      role: 'user',
      content: query,
      userId,
      conversationId
    });
    await userMessage.save();
  } catch (error) {
    throw new Error(`Error saving user query: ${error.message}`);
  }
}

// Function to save the AI's response as a message
async function saveAiResponse(answer, conversationId, userId) {
  try {
    // Save the AI's response as a message with the role "ai"
    const aiMessage = new Message({
      role: 'ai',
      content: answer,
      conversationId,
      userId
    });
    await aiMessage.save();
  } catch (error) {
    throw new Error(`Error saving AI response: ${error.message}`);
  }
}
