const projectService = require('../services/projectService');
const { success, error, created, notFound, forbidden } = require('../utils/response');
const logger = require('../utils/logger');

class ProjectController {
  // Obtener todos los proyectos
  async getProjects(req, res, next) {
    try {
      const proyectos = await projectService.getProjects();
      return success(res, proyectos);
    } catch (err) {
      logger.error('Error en getProjects:', err);
      if (err.message === 'No se encontraron proyectos') {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Crear proyecto
  async createProject(req, res, next) {
    try {
      const { projectData, id_usuario } = req.body;

      if (!id_usuario) {
        return error(res, 'ID de usuario inválido', 400);
      }

      const result = await projectService.createProject(projectData, id_usuario);

      return created(res, result, 'Proyecto y publicación creados con éxito');
    } catch (err) {
      logger.error('Error en createProject:', err);
      if (err.message === 'Usuario no encontrado') {
        return notFound(res, err.message);
      }
      if (err.message === 'Acceso no autorizado') {
        return forbidden(res, err.message);
      }
      if (err.message === 'Empresa no encontrada') {
        return notFound(res, err.message);
      }
      if (err.message === 'Proyecto duplicado encontrado') {
        return error(res, err.message, 409);
      }
      next(err);
    }
  }

  // Actualizar estado del proyecto
  async updateEstadoProyecto(req, res, next) {
    try {
      const { id_proyecto } = req.params;
      const { nuevoEstado } = req.body;

      await projectService.updateEstadoProyecto(id_proyecto, nuevoEstado);

      return success(res, null, 'Estado del proyecto actualizado con éxito');
    } catch (err) {
      logger.error('Error en updateEstadoProyecto:', err);
      next(err);
    }
  }

  // Eliminar proyecto
  async deleteProject(req, res, next) {
    try {
      const { id_proyecto } = req.params;

      await projectService.deleteProject(id_proyecto);

      return success(res, null, 'Proyecto eliminado correctamente');
    } catch (err) {
      logger.error('Error en deleteProject:', err);
      if (err.message === 'Proyecto no encontrado') {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Obtener proyectos por usuario
  async getProjectsByUser(req, res, next) {
    try {
      const { id_usuario } = req.params;

      if (!id_usuario) {
        return error(res, 'ID de usuario inválido', 400);
      }

      const projects = await projectService.getProjectsByUser(id_usuario);

      return success(res, projects);
    } catch (err) {
      logger.error('Error en getProjectsByUser:', err);
      if (err.message === 'Usuario no encontrado') {
        return notFound(res, err.message);
      }
      if (err.message === 'Acceso no autorizado') {
        return forbidden(res, err.message);
      }
      if (err.message === 'Empresa no encontrada') {
        return notFound(res, err.message);
      }
      if (err.message === 'No se encontraron proyectos') {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Actualizar estado de publicación
  async updateProjectState(req, res, next) {
    try {
      const { id_proyecto } = req.params;

      if (!id_proyecto || isNaN(id_proyecto)) {
        return error(res, 'ID de proyecto inválido', 400);
      }

      await projectService.updateProjectState(id_proyecto);

      return success(res, null, 'Actualización exitosa');
    } catch (err) {
      logger.error('Error en updateProjectState:', err);
      if (err.message === 'No se encontró publicación para bajar') {
        return notFound(res, err.message);
      }
      next(err);
    }
  }

  // Obtener publicaciones
  async getPublicaciones(req, res, next) {
    try {
      const publicaciones = await projectService.getPublicaciones();
      return success(res, publicaciones);
    } catch (err) {
      logger.error('Error en getPublicaciones:', err);
      if (err.message === 'No se encontraron proyectos ni publicaciones') {
        return notFound(res, err.message);
      }
      next(err);
    }
  }
}

module.exports = new ProjectController();