// src/config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*'],
  logDir: process.env.LOG_DIR || 'logs',
};
