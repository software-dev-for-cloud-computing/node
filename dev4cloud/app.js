const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json'); // Stellen Sie sicher, dass der Pfad zu Ihrer Swagger JSON-Datei korrekt ist

require('./config/passport')(passport); // Passport korrekt initialisieren

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(passport.initialize());

// Routen
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/prompts', require('./routes/prompts'));

// Swagger UI Setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Exportieren der App für den Einsatz im Server
module.exports = app;

// Starten des Servers, wenn das Modul direkt ausgeführt wird
if (require.main === module) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server läuft auf Port ${PORT}`);
    });
}
// test