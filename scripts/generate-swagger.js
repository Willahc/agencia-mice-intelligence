// scripts/generate-swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Agência MICE Intelligence API',
      version: '1.0.0',
      description: 'Endpoints for MICE event management and analytics',
    },
    servers: [{ url: 'http://localhost:{port}', variables: { port: { default: '3000' } } }],
  },
  // Paths to the API route files where JSDoc comments are placed
  apis: [path.resolve(__dirname, '../src/routes/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

// Write to a JSON file that can be required by the server
fs.writeFileSync(path.resolve(__dirname, '../scripts/swaggerSpec.json'), JSON.stringify(swaggerSpec, null, 2));
console.log('Swagger spec generated at scripts/swaggerSpec.json');
