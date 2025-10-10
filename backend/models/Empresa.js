const { pool } = require('../config/db');

class Empresa {
  // Crear empresa
  static async create(id_usuario) {
    try {
      const [result] = await pool.query(
        'INSERT INTO empresa (id_usuario) VALUES (?)',
        [id_usuario]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Obtener empresa por ID de usuario
  static async findByUserId(id_usuario) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM empresa WHERE id_usuario = ?',
        [id_usuario]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener empresa por ID
  static async findById(id_empresa) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM empresa WHERE id_empresa = ?',
        [id_empresa]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar perfil de empresa
  static async updatePerfil(id_empresa, empresaData) {
    try {
      const [result] = await pool.query(
        `UPDATE empresa SET 
          nombre_empresa = ?, 
          identificacion_fiscal = ?, 
          direccion = ?, 
          telefono_contacto = ?, 
          correo_empresa = ?, 
          pagina_web = ?, 
          descripcion = ?, 
          sector_industrial = ?
        WHERE id_empresa = ?`,
        [
          empresaData.nombre_empresa,
          empresaData.identificacion_fiscal,
          empresaData.direccion,
          empresaData.telefono_contacto,
          empresaData.correo_empresa,
          empresaData.pagina_web,
          empresaData.descripcion,
          empresaData.sector_industrial,
          id_empresa
        ]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar estado premium
  static async updatePremium(id_usuario, premium) {
    try {
      const [result] = await pool.query(
        'UPDATE empresa SET premium = ? WHERE id_usuario = ?',
        [premium, id_usuario]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Obtener representante de empresa
  static async getRepresentante(id_empresa) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM representante_empresa WHERE id_empresa = ?',
        [id_empresa]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Crear representante de empresa
  static async createRepresentante(id_empresa, representanteData) {
    try {
      const [result] = await pool.query(
        `INSERT INTO representante_empresa 
        (id_empresa, nombre_completo, cargo, correo_representante, telefono_representante)
        VALUES (?, ?, ?, ?, ?)`,
        [
          id_empresa,
          representanteData.nombre_completo,
          representanteData.cargo,
          representanteData.correo_representante,
          representanteData.telefono_representante
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Empresa;