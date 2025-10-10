// Respuesta de éxito estándar
function success(res, data, message = 'Operación exitosa', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

// Respuesta de error estándar
function error(res, message = 'Error en la operación', statusCode = 500, errors = null) {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

// Respuesta de creación exitosa
function created(res, data, message = 'Recurso creado exitosamente') {
  return success(res, data, message, 201);
}

// Respuesta de no encontrado
function notFound(res, message = 'Recurso no encontrado') {
  return error(res, message, 404);
}

// Respuesta de no autorizado
function unauthorized(res, message = 'No autorizado') {
  return error(res, message, 401);
}

// Respuesta de prohibido
function forbidden(res, message = 'Acceso prohibido') {
  return error(res, message, 403);
}

// Respuesta de validación fallida
function validationError(res, errors, message = 'Error de validación') {
  return error(res, message, 400, errors);
}

module.exports = {
  success,
  error,
  created,
  notFound,
  unauthorized,
  forbidden,
  validationError
};