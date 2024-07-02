const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
let DB_URI;

if (NODE_ENV === 'production') {
  DB_URI = process.env.MONGODB_URI;
} else {
  const DB_HOST = process.env.DB_HOST || "localhost"; // Änderung hier zu "localhost"
  const DB_PORT = process.env.DB_PORT || 27017;
  const DB_NAME = process.env.DB_NAME || "dev4cloud";
  DB_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

console.log(`Connecting to MongoDB at ${DB_URI}`);

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    if (require.main === module) {
      app.listen(PORT, 'localhost', () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });


