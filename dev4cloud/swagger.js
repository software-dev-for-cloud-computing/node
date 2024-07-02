const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './app.js',
];

swaggerAutogen(outputFile, endpointsFiles).then(() => {
  require('./server'); // Starte den Server nach der Generierung
});
