const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(), // Speicheroption: Datei im Speicher behalten
    limits: { fileSize: 10 * 1024 * 1024 } // Maximalgröße der Datei auf 10 MB begrenzen
  });

router.get('/', documentController.getAllDocuments);
router.get('/:id', documentController.getDocumentById);
router.post('/', upload.single('pdf'), documentController.createDocument);
router.put('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
