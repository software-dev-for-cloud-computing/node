const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json');
const cors = require('cors');
require('dotenv').config(); // Laden der Umgebungsvariablen

const app = express();

// Multer-Konfiguration
const upload = multer({
    storage: multer.memoryStorage(), // Datein im Speicher halten
    limits: { fileSize: 10 * 1024 * 1024 } // Maximalgröße der Datei auf 10 MB begrenzen
});

// Middleware
/*app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // URL-codierte Daten verarbeiten

// Swagger UI Setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/prompts', require('./routes/prompts'));
app.use('/api/chat', require('./routes/chat'));

// Export the app for use in the server
module.exports = app;

// Start the server if this module is executed directly
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server läuft auf Port ${PORT}`);
    });
}
