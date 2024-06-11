const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json'); // Make sure to provide the correct path to your Swagger JSON file

require('./config/passport')(passport); // Correctly initialize passport

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/prompts', require('./routes/prompts'));

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
