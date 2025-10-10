require('dotenv').config();

const config = {
  // Database
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT || 3306,
  DB_TEST_HOST: process.env.DB_TEST_HOST,

  // Server
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,

  // Webpay/Payments
  WEBPAY_COMMERCE_CODE: process.env.WEBPAY_COMMERCE_CODE,
  WEBPAY_API_KEY: process.env.WEBPAY_API_KEY,

  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL,

  // Uploads
  UPLOADS_DIR: process.env.UPLOADS_DIR || 'uploads/cvs'
};

// Validación básica de variables críticas
const requiredVars = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
for (const varName of requiredVars) {
  if (!config[varName]) {
    console.warn(`WARNING: Variable de entorno ${varName} no está definida`);
  }
}

module.exports = config;