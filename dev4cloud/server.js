const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 5001;
const DB_USER = process.env.DB_USER || "";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "mongodb";
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME || "dev4cloud";

let DB_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

if (DB_USER && DB_PASSWORD) {
  DB_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

console.log(`Connecting to MongoDB at ${DB_URI}`);

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  if (require.main === module) {
    app.listen(PORT, 'localhost', () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
