const { pool } = require('../config/db');

// Middleware para validar usuario
const validateUser = async (req, res, next) => {
  const { id_usuario } = req.params;
  try {
    const [usuario] = await pool.query(
      'SELECT * FROM usuario WHERE id_usuario = ?',
      [id_usuario]
    );
    
    if (usuario.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    req.usuario = usuario[0];
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware de validación de datos de pago
function validatePaymentData(req, res, next) {
  const { amount, buyOrder, sessionId } = req.body;
  
  if (!amount || !buyOrder || !sessionId) {
    return res.status(400).json({
      error: 'Faltan datos obligatorios para el pago'
    });
  }
  
  if (isNaN(amount)) {
    return res.status(400).json({
      error: 'El monto debe ser un valor numérico'
    });
  }
  
  next();
}

module.exports = {
  validateUser,
  validatePaymentData
};