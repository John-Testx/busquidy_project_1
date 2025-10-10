const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { validatePaymentData } = require('../middlewares/validate');

// Crear transacción de suscripción
router.post('/create_transaction_suscription', paymentController.createTransactionSuscription);

// Crear transacción de proyecto
router.post('/create_transaction_project', paymentController.createTransactionProject);

// Confirmar transacción
router.post('/commit_transaction', paymentController.commitTransaction);

// Obtener pagos de proyectos
router.get('/pagos-proyectos', paymentController.getPagosProyectos);

// Obtener pagos de suscripciones
router.get('/pagos-suscripciones', paymentController.getPagosSuscripciones);

module.exports = router;