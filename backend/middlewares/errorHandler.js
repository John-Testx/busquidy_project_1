const config = require('../config');
const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error('Error:', err);

  // Error de CORS
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'Acceso CORS no permitido'
    });
  }

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.details
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  // Error de base de datos
  if (err.code && err.code.startsWith('ER_')) {
    return res.status(500).json({
      success: false,
      message: 'Error de base de datos',
      error: config.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: config.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;