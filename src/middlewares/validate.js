// src/middlewares/validate.js
const Joi = require('joi');

/**
 * Middleware generator that validates request body against a Joi schema.
 * On validation error, responds with 400 and details.
 */
function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });
    if (error) {
      const details = error.details.map(d => d.message);
      return res.status(400).json({ error: 'Invalid request payload', details });
    }
    // replace body with the validated value (sanitized)
    req.body = value;
    return next();
  };
}

module.exports = { validateBody };
