const empresaService = require('../services/empresaService');
const { success, error, created, notFound, forbidden } = require('../utils/response');
const logger = require('../utils/logger');

class EmpresaController {
  // Verificar si existe perfil empresa
  async checkPerfilExists(req, res, next) {
    try {
      const { id_usuario } = req.params;

      const result = await empresaService.checkPerfilExists(id_usuario);

      return success(res, result);
    } catch (err) {
      logger.error('Error en checkPerfilExists:', err);
      if (err.message === 'Usuario no encontrado') {
        return notFound(res, err.message);
      }
      if (err.message === 'Acceso no autorizado') {
        return forbidden(res, err.message);
      }
      if (err.message === 'Datos no encontrados') {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Crear perfil empresa
  async createPerfilEmpresa(req, res, next) {
    try {
      const { empresaData, representanteData, id_usuario } = req.body;

      if (!id_usuario) {
        return error(res, 'ID de usuario inválido', 400);
      }

      const result = await empresaService.createPerfilEmpresa(
        empresaData,
        representanteData,
        id_usuario
      );

      return created(res, result, 'Perfil de empresa creado exitosamente');
    } catch (err) {
      logger.error('Error en createPerfilEmpresa:', err);
      if (err.message === 'Usuario no encontrado') {
        return notFound(res, err.message);
      }
      if (err.message === 'Empresa no encontrada') {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Obtener perfil empresa
  async getPerfilEmpresa(req, res, next) {
    try {
      const { id_usuario } = req.params;

      if (!id_usuario) {
        return error(res, 'ID de usuario inválido', 400);
      }

      const result = await empresaService.getPerfilEmpresa(id_usuario);

      return success(res, result);
    } catch (err) {
      logger.error('Error en getPerfilEmpresa:', err);
      if (err.message.includes('No se encontró')) {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Agregar reseña
  async addReview(req, res, next) {
    try {
      const { id_usuario, calificacion, comentario, id_identificador } = req.body;

      if (!id_usuario || !calificacion || !id_identificador) {
        return error(res, 'Faltan campos requeridos', 400);
      }

      await empresaService.addReview(id_usuario, calificacion, comentario, id_identificador);

      return created(res, null, 'Reseña agregada exitosamente');
    } catch (err) {
      logger.error('Error en addReview:', err);
      
      if (err.message.includes('no existe') || err.message.includes('no encontró')) {
        return notFound(res, err.message);
      }
      if (err.message.includes('mismo tipo') || err.message.includes('ya has realizado')) {
        return error(res, err.message, 400);
      }
      next(err);
    }
  }
}

module.exports = new EmpresaController();