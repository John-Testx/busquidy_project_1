const Project = require('../models/Project');
const Empresa = require('../models/Empresa');
const User = require('../models/User');
const { pool } = require('../config/db');

class ProjectService {
  // Obtener todos los proyectos con publicaciones
  async getProjects() {
    const proyectos = await Project.findAllWithPublications();
    if (proyectos.length === 0) {
      throw new Error('No se encontraron proyectos');
    }
    return proyectos;
  }

  // Crear proyecto
  async createProject(projectData, id_usuario) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Verificar usuario
      const users = await User.findById(id_usuario);
      if (users.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      const tipo_usuario = users[0].tipo_usuario;
      if (tipo_usuario !== 'empresa') {
        throw new Error('Acceso no autorizado');
      }

      // Obtener empresa
      const empresaResults = await Empresa.findByUserId(id_usuario);
      if (empresaResults.length === 0) {
        throw new Error('Empresa no encontrada');
      }

      const id_empresa = empresaResults[0].id_empresa;

      // Verificar duplicados
      const duplicates = await Project.checkDuplicate(id_empresa, projectData);
      if (duplicates.length > 0) {
        throw new Error('Proyecto duplicado encontrado');
      }

      // Crear proyecto
      const id_proyecto = await Project.create(id_empresa, projectData);

      // Crear publicación
      await Project.createPublication(id_proyecto);

      await connection.commit();
      return { id_proyecto };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Actualizar estado del proyecto
  async updateEstadoProyecto(id_proyecto, nuevoEstado) {
    await pool.query(
      'UPDATE proyectos SET estado_publicacion = ? WHERE id_proyecto = ?',
      [nuevoEstado, id_proyecto]
    );
    return true;
  }

  // Eliminar proyecto
  async deleteProject(id_proyecto) {
    const connection = await pool.getConnection();

    try {
      // Verificar si existe
      const exists = await Project.exists(id_proyecto);
      if (!exists) {
        throw new Error('Proyecto no encontrado');
      }

      await connection.beginTransaction();

      // Eliminar publicación
      await Project.deletePublication(id_proyecto);

      // Eliminar proyecto
      await Project.delete(id_proyecto);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Obtener proyectos por usuario
  async getProjectsByUser(id_usuario) {
    // Verificar usuario
    const users = await User.findById(id_usuario);
    if (users.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const tipo_usuario = users[0].tipo_usuario;
    if (tipo_usuario !== 'empresa') {
      throw new Error('Acceso no autorizado');
    }

    // Obtener empresa
    const empresaResults = await Empresa.findByUserId(id_usuario);
    if (empresaResults.length === 0) {
      throw new Error('Empresa no encontrada');
    }

    const id_empresa = empresaResults[0].id_empresa;

    // Obtener proyectos
    const projectResults = await Project.findByEmpresa(id_empresa);
    if (projectResults.length === 0) {
      throw new Error('No se encontraron proyectos');
    }

    // Obtener estados de publicación
    const projectIds = projectResults.map(proyecto => proyecto.id_proyecto);
    const [publicationResults] = await pool.query(
      'SELECT id_proyecto, estado_publicacion FROM publicacion_proyecto WHERE id_proyecto IN (?)',
      [projectIds]
    );

    // Mapear estados
    const publicationMap = new Map(
      publicationResults.map(pub => [pub.id_proyecto, pub.estado_publicacion])
    );

    const projectsWithStatus = projectResults.map(proyecto => ({
      ...proyecto,
      estado_publicacion: publicationMap.get(proyecto.id_proyecto) || 'Desconocido'
    }));

    return projectsWithStatus;
  }

  // Actualizar estado de publicación
  async updateProjectState(id_proyecto) {
    const [results] = await pool.query(
      `UPDATE publicacion_proyecto SET estado_publicacion = 'cancelado'
       WHERE id_proyecto = ?`,
      [id_proyecto]
    );

    if (results.affectedRows === 0) {
      throw new Error('No se encontró publicación para bajar');
    }

    return true;
  }

  // Obtener publicaciones con proyectos
  async getPublicaciones() {
    const results = await Project.getPublicationsWithProjects();

    if (results.length === 0) {
      throw new Error('No se encontraron proyectos ni publicaciones');
    }

    const projectsWithStatus = results.map(row => ({
      id_proyecto: row.id_proyecto,
      id_empresa: row.id_empresa,
      titulo: row.titulo,
      descripcion: row.descripcion,
      categoria: row.categoria,
      habilidades_requeridas: row.habilidades_requeridas,
      presupuesto: row.presupuesto,
      duracion_estimada: row.duracion_estimada,
      fecha_limite: row.fecha_limite,
      ubicacion: row.ubicacion,
      tipo_contratacion: row.tipo_contratacion,
      metodologia_trabajo: row.metodologia_trabajo,
      estado_publicacion: row.estado_publicacion || 'sin publicar',
      fecha_creacion: row.fecha_creacion || null,
      fecha_publicacion: row.fecha_publicacion || null,
      id_publicacion: row.id_publicacion || null
    }));

    return projectsWithStatus;
  }
}

module.exports = new ProjectService();