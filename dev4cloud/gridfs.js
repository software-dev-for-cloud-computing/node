const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

// Verwende die Mongoose-Verbindung, die bereits in der Hauptdatei erstellt wurde
const db = mongoose.connection;

let gridFSBucket;

function initializeGridFSBucket() {
  if (!db.readyState) {
    throw new Error('Database connection not established.');
  }

  gridFSBucket = new GridFSBucket(db.db, { bucketName: 'documents' });
}

module.exports = {
  initializeGridFSBucket,
  getGridFSBucket: () => gridFSBucket
};
