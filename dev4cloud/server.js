const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5001;

mongoose.connect('mongodb://localhost:27017/dev4cloud', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
