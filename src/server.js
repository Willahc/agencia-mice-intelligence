// src/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./logger');
const config = require('./config');
const apiRouter = require('./routes/api');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../scripts/swaggerSpec'); // generated later

const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigins }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Log each request
app.use((req, res, next) => {
  logger.info('Incoming %s %s', req.method, req.originalUrl);
  next();
});

// API routes
app.use('/api', apiRouter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Static files (public folder)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fallback for SPA / unknown routes – serve index.html if exists
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'public', 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      logger.error('Static file not found: %s', err.message);
      res.status(404).send('Arquivo não encontrado: 404');
    }
  });
});

// Central error handler
app.use((err, req, res, next) => {
  logger.error('Error handling request %s %s: %s', req.method, req.originalUrl, err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message });
});

app.listen(config.port, () => {
  logger.info('🚀 Servidor MICE Intelligence rodando em http://localhost:%d', config.port);
});

module.exports = app;
