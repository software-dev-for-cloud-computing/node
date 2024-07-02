const Document = require('../models/document');
const multer = require('multer');
const upload = multer();


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

  const { userId, conversationId, author, title, year, url, isbn, type, tags } = req.body;
  console.log(req.files[0].buffer)

  try {
    const pdfData = req.files[0].buffer   
    console.log(pdfData)
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
    res.status(201).json({ message: 'Document created successfully' }); // Rückmeldung ohne PDF-Daten
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
