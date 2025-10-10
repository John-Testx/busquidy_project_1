const mysql = require('mysql2/promise');
const config = require('./index');
const logger = require('../utils/logger');

const pool = mysql.createPool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  port: config.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper para ejecutar queries
async function query(sql, params) {
  try {
    const [results] = await pool.query(sql, params);
    return results;
  } catch (error) {
    logger.error('Database query error:', error);
    throw error;
  }
}

// Función para guardar perfil desde CV (mantener compatibilidad con cvService)
async function guardarPerfilEnDB(data) {
  const {
    id_freelancer,
    cv_url,
    freelancer,
    antecedentesPersonales,
    pretensiones
  } = data;

  try {
    if (id_freelancer == null) {
      logger.error('id_freelancer es null');
      return;
    }

    // Actualizar freelancer
    await pool.query(
      `UPDATE freelancer SET 
       correo_contacto = ?, telefono_contacto = ?, linkedin_link = ?, 
       descripcion = ?, cv_url = ? 
       WHERE id_freelancer = ?`,
      [
        freelancer.correo,
        freelancer.telefono,
        freelancer.linkedIn,
        freelancer.descripcion,
        cv_url,
        id_freelancer
      ]
    );

    // Insertar antecedentes personales
    await pool.query(
      `INSERT INTO antecedentes_personales 
       (id_freelancer, nombres, apellidos, fecha_nacimiento, identificacion, 
        nacionalidad, direccion, region, ciudad, comuna, estado_civil)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_freelancer,
        antecedentesPersonales.nombres,
        antecedentesPersonales.apellidos,
        antecedentesPersonales.fecha_nacimiento,
        antecedentesPersonales.identificacion,
        antecedentesPersonales.nacionalidad,
        antecedentesPersonales.direccion,
        antecedentesPersonales.region,
        antecedentesPersonales.ciudad,
        antecedentesPersonales.comuna,
        antecedentesPersonales.estado_civil
      ]
    );

    // Insertar pretensiones
    await pool.query(
      `INSERT INTO pretensiones (id_freelancer, disponibilidad, renta_esperada)
       VALUES (?, ?, ?)`,
      [id_freelancer, pretensiones.disponibilidad, pretensiones.renta_esperada]
    );
  } catch (error) {
    logger.error('Error en guardarPerfilEnDB:', error);
    throw error;
  }
}

module.exports = {
  pool,
  query,
  guardarPerfilEnDB
};