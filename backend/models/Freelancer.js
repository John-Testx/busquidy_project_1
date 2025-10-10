const { pool } = require('../config/db');

class Freelancer {
  // Crear freelancer
  static async create(id_usuario) {
    try {
      const [result] = await pool.query(
        'INSERT INTO freelancer (id_usuario) VALUES (?)',
        [id_usuario]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Obtener freelancer por ID
  static async findById(id_freelancer) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM freelancer WHERE id_freelancer = ?',
        [id_freelancer]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar información básica
  static async updateBasicInfo(id_freelancer, data) {
    try {
      const [result] = await pool.query(
        `UPDATE freelancer SET 
          correo_contacto = ?, 
          telefono_contacto = ?, 
          linkedin_link = ?, 
          descripcion = ?
        WHERE id_freelancer = ?`,
        [
          data.correo_contacto,
          data.telefono_contacto,
          data.linkedin_link,
          data.descripcion,
          id_freelancer
        ]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar CV URL
  static async updateCvUrl(id_freelancer, cv_url) {
    try {
      const [result] = await pool.query(
        'UPDATE freelancer SET cv_url = ? WHERE id_freelancer = ?',
        [cv_url, id_freelancer]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Obtener CV URL
  static async getCvUrl(id_freelancer) {
    try {
      const [result] = await pool.query(
        'SELECT cv_url FROM freelancer WHERE id_freelancer = ?',
        [id_freelancer]
      );
      return result.length > 0 ? result[0].cv_url : null;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar estado premium
  static async updatePremium(id_usuario, premium) {
    try {
      const [result] = await pool.query(
        'UPDATE freelancer SET premium = ? WHERE id_usuario = ?',
        [premium, id_usuario]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Listar todos los freelancers con antecedentes personales
  static async findAllWithDetails() {
    try {
      const [rows] = await pool.query(`
        SELECT 
          f.id_freelancer,
          ap.nombres,
          ap.apellidos,
          ap.nacionalidad,
          ap.ciudad,
          ap.comuna,
          f.correo_contacto,
          f.telefono_contacto,
          f.calificacion_promedio,
          f.descripcion
        FROM freelancer AS f
        JOIN antecedentes_personales AS ap ON f.id_freelancer = ap.id_freelancer
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener antecedentes personales
  static async getAntecedentesPersonales(id_freelancer) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM antecedentes_personales WHERE id_freelancer = ?',
        [id_freelancer]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Crear antecedentes personales
  static async createAntecedentesPersonales(id_freelancer, data) {
    try {
      const [result] = await pool.query(
        `INSERT INTO antecedentes_personales 
        (id_freelancer, nombres, apellidos, fecha_nacimiento, identificacion, 
         nacionalidad, direccion, region, ciudad, comuna, estado_civil)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id_freelancer,
          data.nombres,
          data.apellidos,
          data.fecha_nacimiento,
          data.identificacion,
          data.nacionalidad,
          data.direccion,
          data.region,
          data.ciudad,
          data.comuna,
          data.estado_civil
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar antecedentes personales
  static async updateAntecedentesPersonales(id_freelancer, data) {
    try {
      const [result] = await pool.query(
        `UPDATE antecedentes_personales SET
          nombres = ?,
          apellidos = ?,
          fecha_nacimiento = ?,
          identificacion = ?,
          nacionalidad = ?,
          direccion = ?,
          region = ?,
          ciudad = ?,
          comuna = ?
        WHERE id_freelancer = ?`,
        [
          data.nombres,
          data.apellidos,
          data.fecha_nacimiento,
          data.identificacion,
          data.nacionalidad,
          data.direccion,
          data.region,
          data.ciudad,
          data.comuna,
          id_freelancer
        ]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Freelancer;