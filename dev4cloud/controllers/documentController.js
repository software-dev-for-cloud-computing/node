const mongoose = require('mongoose');
const Document = require('../models/document');
const GridFSBucket = require('mongodb').GridFSBucket;
let gfs;
const { getGridFSBucket } = require('../gridfs');
const Grid = require('gridfs-stream');
const { Readable } = require('stream');
const AiService = require('../services/aiService');
const conn = mongoose.connection;

// New: Initialize GridFSBucket if it's not already initialized
const initializeGridFS = () => {
  if (!gfs) {
    const conn = mongoose.connection;
    gfs = new GridFSBucket(conn.db, { bucketName: 'documents' });
  }
};

// Old: Initialize GridFS when the connection is open
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('documents');
});

// Fetch and return all documents from the database
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find().populate('conversationId');
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fetch a document by ID and return it, including PDF data from GridFS if available
exports.getDocumentById = async (req, res) => {
  try {
    const conn = mongoose.connection;
    if (conn.readyState !== 1) {
      return res.status(500).json({ message: 'MongoDB connection is not ready' });
    }
    const bucket = new GridFSBucket(conn.db, { bucketName: 'documents' });

    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    // If the document has a pdfFileId, stream the PDF data from GridFS
    if (document.pdfFileId) {
      const downloadStream = bucket.openDownloadStream(document.pdfFileId);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${document.title}.pdf"`);
      downloadStream.pipe(res);
    } else {
      // If no pdfFileId is available, send the document without PDF data
      res.json(document);
    }
  } catch (err) {
    console.error('Error fetching document:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// Create a new document and store it in the database
exports.createDocument = async (req, res) => {
  const { userId, conversationId, author, title, year, url, isbn, type, tags, apiKey } = req.body;

  try {
    const bucket = getGridFSBucket();
    const uploadStream = bucket.openUploadStream(req.file.originalname);
    uploadStream.end(req.file.buffer);

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
      pdfFileId: uploadStream.id // Save the GridFS file ID
    });

    await newDocument.save();

    try {
      // Send the document to an external API
      const apiResponse = await AiService.sendDocumentToApi(req.file, userId, newDocument._id, conversationId, apiKey);
      res.status(201).json({ message: 'Document created and sent successfully', apiResponse });
    } catch (apiError) {
      res.status(500).json({ message: 'Document created but failed to send to external API', error: apiError.message });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a document by ID
exports.updateDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('conversationId');
    if (!document) return res.status(404).json({ message: 'Document not found' });
    res.json(document);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a document by ID and its associated PDF data from GridFS
exports.deleteDocument = async (req, res) => {
  try {
    initializeGridFS();
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    // Delete associated PDF data from GridFS if available
    if (document.pdfFileId) {
      gfs.delete(document.pdfFileId, (err) => {
        if (err) {
          console.error('Error deleting file from GridFS:', err.message);
          return res.status(500).json({ message: 'Error deleting file from GridFS' });
        }
      });
    }

    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete all documents and their associated PDF data from GridFS
exports.deleteAllDocuments = async (req, res) => {
  try {
    initializeGridFS();
    const documents = await Document.find();

    // Delete all documents from MongoDB
    await Document.deleteMany({});

    // Delete all associated PDF files from GridFS
    documents.forEach(async (document) => {
      if (document.pdfFileId) {
        try {
          await gfs.delete(document.pdfFileId);
        } catch (err) {
          console.error('Error removing file from GridFS:', err.message);
        }
      }
    });

    res.json({ message: 'All documents and associated files have been deleted' });
  } catch (err) {
    console.error('Error deleting all documents:', err.message);
    res.status(500).json({ message: err.message });
  }
};
