const AiService = require('../services/aiService');
const Message = require('../models/message');
const Prompt = require('../models/prompt');


exports.getChatResponse = async (req, res) => {
  try {
    const { query, userId, conversationId, apiKey} = req.query;

    // Speichern der Benutzeranfrage als Prompt und Nachricht
    await saveUserQuery(query, userId, conversationId);

    // Aufruf der Funktion, um Nachrichten abzurufen und die AI-Antwort zu erhalten
    const { chat_history, context } = await fetchChatHistory(conversationId);

    console.log("##################")
    console.log(chat_history)



    // Aufruf des AI-Services, um die AI-Antwort zu erhalten
    const aiResponse = await AiService.fetchAiResponse(query,userId,conversationId,apiKey,chat_history);

    // Speichern der AI-Antwort als Nachricht mit der Rolle "ai"
    await saveAiResponse(aiResponse.answer, conversationId, userId);

    // Zusammenfügen der AI-Antwort mit vorbereiteten Daten
    const response = {
      input: query,
      chat_history,
      context,
      answer: aiResponse.answer
    };

    // Rückgabe der Daten als HTTP-Response
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function fetchChatHistory(conversationId) {
  try {
    // Beispiel für die Nachrichtenabfrage aus der Datenbank
    const chatHistory = await Message.find({ conversationId })
      .sort({ created_at: -1 })
      .limit(6)
      .exec();

    // Filterung der neuesten Nachrichten
    const userMessages = [];
    const aiMessages = [];

    // Durchlaufen der Nachrichten und Aufteilung nach Benutzer und AI
    chatHistory.forEach(message => {
      if (message.role === 'user' && userMessages.length < 3) {
        userMessages.push(message);
      } else if (message.role === 'ai' && aiMessages.length < 3) {
        aiMessages.push(message);
      }
    });

    // Formatierung der Antwortdaten
    const chat_history = [...userMessages, ...aiMessages].map(message => ({
      role: message.role,
      content: message.content,
      user_id: message.userId.toHexString(), // Konvertiere ObjectId zu String
      conversation_id: message.conversationId.toHexString(), // Konvertiere ObjectId zu String
      timestamp: message.created_at.toISOString()
    }));

    // Erstellen des Kontexts (hier ein Platzhalter)
    const context = [];

    return { chat_history, context };
  } catch (error) {
    throw new Error(`Error fetching chat history: ${error.message}`);
  }
}

async function saveUserQuery(query, userId, conversationId) {
  try {
    // Speichern der Benutzeranfrage als Prompt
    const prompt = new Prompt({
      userId,
      conversationId,
      prompt: query
    });
    await prompt.save();

    // Speichern der Benutzeranfrage als Nachricht
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

async function saveAiResponse(answer, conversationId, userId) {
  try {
    // Speichern der AI-Antwort als Nachricht mit der Rolle "ai"
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

