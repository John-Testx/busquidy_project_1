const { pool } = require('../config/db');

class Project {
  // Crear proyecto
  static async create(id_empresa, projectData) {
    try {
      const [result] = await pool.query(
        `INSERT INTO proyecto 
        (id_empresa, titulo, descripcion, categoria, habilidades_requeridas, 
         presupuesto, duracion_estimada, fecha_limite, ubicacion, 
         tipo_contratacion, metodologia_trabajo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id_empresa,
          projectData.titulo,
          projectData.descripcion,
          projectData.categoria,
          projectData.habilidades_requeridas,
          projectData.presupuesto,
          projectData.duracion_estimada,
          projectData.fecha_limite,
          projectData.ubicacion,
          projectData.tipo_contratacion,
          projectData.metodologia_trabajo
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Obtener proyecto por ID
  static async findById(id_proyecto) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM proyecto WHERE id_proyecto = ?',
        [id_proyecto]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Obtener proyectos por empresa
  static async findByEmpresa(id_empresa) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM proyecto WHERE id_empresa = ?',
        [id_empresa]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener todos los proyectos con publicaciones
  static async findAllWithPublications() {
    try {
      const [rows] = await pool.query(`
        SELECT 
          p.id_proyecto,
          p.id_empresa,
          p.titulo,
          p.categoria,
          p.descripcion,
          pp.fecha_creacion,
          pp.fecha_publicacion,
          pp.estado_publicacion
        FROM proyecto p
        LEFT JOIN publicacion_proyecto pp ON p.id_proyecto = pp.id_proyecto
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Verificar proyecto duplicado
  static async checkDuplicate(id_empresa, projectData) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM proyecto 
         WHERE id_empresa = ? AND titulo = ? AND descripcion = ? 
         AND categoria = ? AND habilidades_requeridas = ? 
         AND presupuesto = ? AND duracion_estimada = ? 
         AND fecha_limite = ? AND ubicacion = ? 
         AND tipo_contratacion = ? AND metodologia_trabajo = ?`,
        [
          id_empresa,
          projectData.titulo,
          projectData.descripcion,
          projectData.categoria,
          projectData.habilidades_requeridas,
          projectData.presupuesto,
          projectData.duracion_estimada,
          projectData.fecha_limite,
          projectData.ubicacion,
          projectData.tipo_contratacion,
          projectData.metodologia_trabajo
        ]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar proyecto
  static async delete(id_proyecto) {
    try {
      const [result] = await pool.query(
        'DELETE FROM proyecto WHERE id_proyecto = ?',
        [id_proyecto]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Crear publicación
  static async createPublication(id_proyecto) {
    try {
      const [result] = await pool.query(
        `INSERT INTO publicacion_proyecto 
        (id_proyecto, fecha_creacion, fecha_publicacion, estado_publicacion)
        VALUES (?, CURDATE(), NULL, 'sin publicar')`,
        [id_proyecto]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Obtener publicación por proyecto
  static async getPublication(id_proyecto) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM publicacion_proyecto WHERE id_proyecto = ?',
        [id_proyecto]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar estado de publicación
  static async updatePublicationStatus(id_proyecto, estado) {
    try {
      const [result] = await pool.query(
        `UPDATE publicacion_proyecto 
         SET estado_publicacion = ? 
         WHERE id_proyecto = ?`,
        [estado, id_proyecto]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Activar publicación
  static async activatePublication(id_proyecto) {
    try {
      const [result] = await pool.query(
        `UPDATE publicacion_proyecto
         SET fecha_creacion = CURDATE(), estado_publicacion = 'activo'
         WHERE id_proyecto = ?`,
        [id_proyecto]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar publicación
  static async deletePublication(id_proyecto) {
    try {
      const [result] = await pool.query(
        'DELETE FROM publicacion_proyecto WHERE id_proyecto = ?',
        [id_proyecto]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Obtener publicaciones con proyectos
  static async getPublicationsWithProjects() {
    try {
      const [rows] = await pool.query(`
        SELECT 
          p.id_proyecto, 
          p.id_empresa, 
          p.titulo, 
          p.descripcion, 
          p.categoria, 
          p.habilidades_requeridas, 
          p.presupuesto, 
          p.duracion_estimada, 
          p.fecha_limite, 
          p.ubicacion, 
          p.tipo_contratacion, 
          p.metodologia_trabajo, 
          pub.id_publicacion, 
          pub.fecha_creacion, 
          pub.fecha_publicacion, 
          pub.estado_publicacion
        FROM proyecto p
        LEFT JOIN publicacion_proyecto pub ON p.id_proyecto = pub.id_proyecto
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Crear postulación
  static async createPostulacion(id_publicacion, id_freelancer) {
    try {
      const [result] = await pool.query(
        `INSERT INTO postulacion 
        (id_publicacion, id_freelancer, fecha_postulacion, estado_postulacion)
        VALUES (?, ?, CURDATE(), 'postulado')`,
        [id_publicacion, id_freelancer]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Verificar postulación existente
  static async checkExistingPostulacion(id_publicacion, id_usuario) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM postulacion 
         JOIN freelancer ON postulacion.id_freelancer = freelancer.id_freelancer
         WHERE postulacion.id_publicacion = ? AND freelancer.id_usuario = ?`,
        [id_publicacion, id_usuario]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener postulaciones por freelancer
  static async getPostulacionesByFreelancer(id_freelancer) {
    try {
      const [rows] = await pool.query(
        `SELECT 
          p.id_postulacion,
          p.fecha_postulacion,
          p.estado_postulacion,
          pr.titulo,
          e.nombre_empresa,
          e.correo_empresa,
          e.telefono_contacto,
          pp.fecha_publicacion,
          pp.estado_publicacion
        FROM postulacion AS p
        INNER JOIN publicacion_proyecto AS pp ON p.id_publicacion = pp.id_publicacion
        INNER JOIN proyecto AS pr ON pp.id_proyecto = pr.id_proyecto
        INNER JOIN empresa AS e ON pr.id_empresa = e.id_empresa
        WHERE p.id_freelancer = ?`,
        [id_freelancer]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar postulación
  static async deletePostulacion(id_postulacion) {
    try {
      const [result] = await pool.query(
        'DELETE FROM postulacion WHERE id_postulacion = ?',
        [id_postulacion]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Verificar si existe postulación
  static async postulacionExists(id_postulacion) {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM postulacion WHERE id_postulacion = ?',
        [id_postulacion]
      );
      return rows[0].count > 0;
    } catch (error) {
      throw error;
    }
  }

  // Verificar si existe proyecto
  static async exists(id_proyecto) {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM proyecto WHERE id_proyecto = ?',
        [id_proyecto]
      );
      return rows[0].count > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Project;