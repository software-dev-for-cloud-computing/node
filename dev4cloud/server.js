const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';
let DB_URI;

if (NODE_ENV === 'production') {
  DB_URI = process.env.MONGODB_URI;
} else {
  const DB_HOST = process.env.DB_HOST || "mongodb";
  const DB_PORT = process.env.DB_PORT || 27017;
  const DB_NAME = process.env.DB_NAME || "dev4cloud";
  DB_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

console.log(`Connecting to MongoDB at ${DB_URI}`);

mongoose.connect(DB_URI).then(() => {
  console.log('Connected to MongoDB');
  if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
