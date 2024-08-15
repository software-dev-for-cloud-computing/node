const Document = require('../models/document');
const AiService = require('../services/aiService');



exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find().populate('conversationId'); // Populate to include conversation details
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${document.title}.pdf"`);
    res.send(document.pdfData);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.createDocument = async (req, res) => {
  const { userId, conversationId, author, title, year, url, isbn, type, tags, apiKey } = req.body;

  try {
    console.log('##############');
    console.log(req.file);
    const pdfData = req.file.buffer; // Hier wird die PDF-Datei aus der Anfrage entnommen

    // Erstelle und speichere das neue Dokument
    const newDocument = new Document({
      userId,
      conversationId,
      author,
      title,
      year,
      url,
      isbn,
      type,
      tags,
      pdfData
    });

    await newDocument.save();

    // Sende das Dokument an die externe API
    try {
      const apiResponse = await AiService.sendDocumentToApi(req.file, userId, newDocument._id, apiKey);
      console.log('Document sent successfully:', apiResponse);
      res.status(201).json({ message: 'Document created and sent successfully', apiResponse });
    } catch (apiError) {
      console.error('Error sending document to external API:', apiError.message);
      res.status(500).json({ message: 'Document created but failed to send to external API', error: apiError.message });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('conversationId'); // Populate to include updated conversation details
    if (!document) return res.status(404).json({ message: 'Document not found' });
    res.json(document);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
