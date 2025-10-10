require('dotenv').config();
const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');

const uploadsDir = path.join(__dirname, '..', config.UPLOADS_DIR);

async function testDbConnection() {
  logger.info('Probando conexión a la base de datos...');
  logger.info(`DB_HOST: ${config.DB_HOST}`);
  logger.info(`DB_USER: ${config.DB_USER}`);
  logger.info(`DB_NAME: ${config.DB_NAME}`);
  
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
    logger.info('✓ Conexión exitosa a la base de datos');
    return true;
  } catch (error) {
    logger.error('✗ Error al conectar a la base de datos:', error.message);
    return false;
  }
}

function cvDirectory() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    logger.info(`✓ Directorio creado: ${uploadsDir}`);
  } else {
    logger.info(`✓ El directorio ya existe: ${uploadsDir}`);
  }
}

module.exports = {
  testDbConnection,
  cvDirectory
};