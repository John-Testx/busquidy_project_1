const { pool } = require('../config/db');

class User {
  // Insertar usuario
  static async create(correo, hashedPassword, tipo_usuario) {
    try {
      const [result] = await pool.query(
        'INSERT INTO usuario (correo, contraseña, tipo_usuario) VALUES (?, ?, ?)',
        [correo, hashedPassword, tipo_usuario]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Obtener usuario por ID
  static async findById(id_usuario) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM usuario WHERE id_usuario = ?',
        [id_usuario]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener usuario por correo
  static async findByEmail(correo) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM usuario WHERE correo = ?',
        [correo]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtener todos los usuarios
  static async findAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM usuario');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar usuario
  static async delete(id_usuario) {
    try {
      const [result] = await pool.query(
        'DELETE FROM usuario WHERE id_usuario = ?',
        [id_usuario]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;