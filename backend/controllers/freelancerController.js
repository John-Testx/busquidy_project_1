const freelancerService = require('../services/freelancerService');
const { success, error, created, notFound } = require('../utils/response');
const logger = require('../utils/logger');

class FreelancerController {
  // Verificar si existe perfil
  async checkPerfilExists(req, res, next) {
    try {
      const { id_usuario } = req.params;

      const result = await freelancerService.checkPerfilExists(id_usuario);

      return success(res, result);
    } catch (err) {
      logger.error('Error en checkPerfilExists:', err);
      if (err.message.includes('no encontrado')) {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Crear perfil freelancer
  async createPerfilFreelancer(req, res, next) {
    try {
      const data = req.body;
      const { id_usuario } = data;

      if (!id_usuario) {
        return error(res, 'ID de usuario inválido', 400);
      }

      const result = await freelancerService.createPerfilFreelancer(data, id_usuario);

      return created(res, result, 'Perfil de freelancer creado exitosamente');
    } catch (err) {
      logger.error('Error en createPerfilFreelancer:', err);
      if (err.message.includes('no encontrado')) {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Obtener perfil freelancer
  async getPerfilFreelancer(req, res, next) {
    try {
      const { id_usuario } = req.params;

      if (!id_usuario || isNaN(id_usuario)) {
        return error(res, 'ID de usuario inválido', 400);
      }

      const result = await freelancerService.getPerfilFreelancer(id_usuario);

      return success(res, result);
    } catch (err) {
      logger.error('Error en getPerfilFreelancer:', err);
      if (err.message.includes('no encontró')) {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Actualizar sección de perfil
  async updatePerfilSection(req, res, next) {
    try {
      const { id_usuario, section } = req.params;
      const updatedData = req.body;

      const result = await freelancerService.updatePerfilSection(
        id_usuario,
        section,
        updatedData
      );

      return success(res, result, 'Actualización exitosa');
    } catch (err) {
      logger.error('Error en updatePerfilSection:', err);
      if (err.message === 'No se encontró el freelancer') {
        return notFound(res, err.message);
      }
      if (err.message === 'Sección no válida') {
        return error(res, err.message, 400);
      }
      if (err.message === 'No se encontraron datos para actualizar') {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Listar freelancers
  async listFreelancers(req, res, next) {
    try {
      const freelancers = await freelancerService.listFreelancers();

      if (freelancers.length === 0) {
        return notFound(res, 'No se encontraron freelancers');
      }

      return success(res, freelancers);
    } catch (err) {
      logger.error('Error en listFreelancers:', err);
      next(err);
    }
  }

  // Obtener perfil público de freelancer
  async getPublicPerfil(req, res, next) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return error(res, 'ID de usuario inválido', 400);
      }

      const result = await freelancerService.getPublicPerfil(id);

      return success(res, result);
    } catch (err) {
      logger.error('Error en getPublicPerfil:', err);
      if (err.message.includes('no encontró')) {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Postular a proyecto
  async postularProyecto(req, res, next) {
    try {
      const { id_publicacion } = req.params;
      const { id_usuario } = req.body;

      if (!id_publicacion || isNaN(id_publicacion) || !id_usuario || isNaN(id_usuario)) {
        return error(res, 'ID inválido', 400);
      }

      const result = await freelancerService.postularProyecto(id_publicacion, id_usuario);

      return created(res, result, 'Postulación exitosa');
    } catch (err) {
      logger.error('Error en postularProyecto:', err);
      if (err.message === 'Ya has aplicado a este proyecto') {
        return error(res, err.message, 400);
      }
      if (err.message === 'No se encontró el freelancer') {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Obtener postulaciones
  async getPostulaciones(req, res, next) {
    try {
      const { id_usuario } = req.params;

      if (!id_usuario || isNaN(id_usuario)) {
        return error(res, 'ID inválido', 400);
      }

      const postulaciones = await freelancerService.getPostulaciones(id_usuario);

      return success(res, postulaciones);
    } catch (err) {
      logger.error('Error en getPostulaciones:', err);
      if (err.message === 'No se encontró el freelancer') {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Eliminar postulación
  async deletePostulacion(req, res, next) {
    try {
      const { id_postulacion } = req.params;

      if (!id_postulacion || isNaN(id_postulacion)) {
        return error(res, 'ID inválido', 400);
      }

      await freelancerService.deletePostulacion(id_postulacion);

      return success(res, null, 'Postulación eliminada correctamente');
    } catch (err) {
      logger.error('Error en deletePostulacion:', err);
      if (err.message === 'Postulación no encontrada') {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Upload CV
  async uploadCV(req, res, next) {
    try {
      const file = req.file;
      const { id_usuario } = req.body;

      if (!file) {
        return error(res, 'No se ha proporcionado ningún archivo', 400);
      }

      const result = await freelancerService.uploadCV(file, id_usuario);

      return created(res, result, 'Perfil creado exitosamente');
    } catch (err) {
      logger.error('Error en uploadCV:', err);
      if (err.message === 'Formato de archivo no soportado') {
        return error(res, err.message, 400);
      }
      if (err.message === 'Freelancer no encontrado') {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Obtener CV
  async getCV(req, res, next) {
    try {
      const { id } = req.params;

      const result = await freelancerService.getCV(id);

      return success(res, result);
    } catch (err) {
      logger.error('Error en getCV:', err);
      if (err.message === 'Freelancer no encontrado') {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Agregar datos a perfil
  async addPerfilData(req, res, next) {
    try {
      const { id_usuario, itemType } = req.params;
      const data = req.body;

      if (!id_usuario || !itemType) {
        return error(res, 'El ID de usuario o el tipo de elemento no están definidos', 400);
      }

      await freelancerService.addPerfilData(id_usuario, itemType, data);

      return created(res, null, `${itemType} agregado correctamente`);
    } catch (err) {
      logger.error('Error en addPerfilData:', err);
      if (err.message === 'No se encontró el freelancer') {
        return notFound(res, err.message);
      }
      if (err.message === 'Tipo de elemento no reconocido') {
        return error(res, err.message, 400);
      }
      next(err);
    }
  }

  // Eliminar idioma o habilidad
  async deleteIdiomaHabilidad(req, res, next) {
    try {
      const { id_usuario, seccion, id } = req.params;

      await freelancerService.deleteIdiomaHabilidad(id_usuario, seccion, id);

      return success(res, null, `${seccion.slice(0, -1)} eliminado exitosamente`);
    } catch (err) {
      logger.error('Error en deleteIdiomaHabilidad:', err);
      if (err.message === 'Sección no válida') {
        return error(res, err.message, 400);
      }
      if (err.message === 'Dato no encontrado') {
        return notFound(res, err.message);
      }
      next(err);
    }
  }
}

module.exports = new FreelancerController();