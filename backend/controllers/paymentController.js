const PaymentService = require('../services/paymentService');
const { pool } = require('../config/db');
const User = require('../models/User');
const Empresa = require('../models/Empresa');
const Freelancer = require('../models/Freelancer');
const Project = require('../models/Project');
const { success, error, created } = require('../utils/response');
const logger = require('../utils/logger');
const config = require('../config');

class PaymentController {
  // Crear transacción de suscripción
  async createTransactionSuscription(req, res, next) {
    try {
      const {
        amount,
        buyOrder,
        sessionId,
        plan,
        tipoUsuario,
        metodoPago,
        returnUrl: requestReturnUrl
      } = req.body;

      if (!amount || !buyOrder || !sessionId || !plan || !tipoUsuario || !metodoPago) {
        return error(res, 'Datos incompletos o inválidos', 400);
      }

      const returnUrl =
        requestReturnUrl ||
        (config.FRONTEND_URL
          ? `${config.FRONTEND_URL}/freelancer`
          : 'http://localhost:3000/freelancer');

      if (!returnUrl) {
        return error(res, 'URL de retorno no configurada', 500);
      }

      if (!['mensual', 'anual'].includes(plan)) {
        return error(res, 'Plan de suscripción inválido', 400);
      }

      const response = await PaymentService.createTransaction({
        amount,
        buyOrder,
        sessionId,
        plan,
        tipoUsuario,
        metodoPago,
        returnUrl
      });

      return success(res, response);
    } catch (err) {
      logger.error('Error en createTransactionSuscription:', err);
      next(err);
    }
  }

  // Crear transacción de proyecto
  async createTransactionProject(req, res, next) {
    try {
      const { amount, buyOrder, sessionId } = req.body;

      if (!amount || !buyOrder || !sessionId) {
        return error(res, 'Datos incompletos', 400);
      }

      const returnUrl = `${config.FRONTEND_URL}/myprojects`;
      
      const response = await PaymentService.createTransaction({
        amount,
        buyOrder,
        sessionId,
        plan: 'mensual',
        returnUrl
      });

      return success(res, response);
    } catch (err) {
      logger.error('Error en createTransactionProject:', err);
      next(err);
    }
  }

  // Confirmar transacción
  async commitTransaction(req, res, next) {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        status: 'ERROR',
        error: 'Token no proporcionado',
        code: 'INVALID_TOKEN'
      });
    }

    let connection;
    try {
      const response = await PaymentService.commitTransaction(token);

      const status = response.status === 'AUTHORIZED' ? 'APPROVED' : 'REJECTED';
      connection = await pool.getConnection();

      const buyOrder = response.buy_order;
      const sessionId = response.session_id;
      const monto = response.amount;

      const plan = response.originalData?.plan || response.plan;
      const metodoPago = response.originalData?.metodoPago || response.metodoPago;

      // Identificar tipo de transacción
      if (buyOrder.startsWith('BO-')) {
        // Transacción de publicación de proyecto
        return await this.handleProjectPayment(
          connection,
          status,
          buyOrder,
          sessionId,
          monto,
          token,
          res
        );
      } else if (buyOrder.startsWith('SUB-')) {
        // Transacción de suscripción
        return await this.handleSubscriptionPayment(
          connection,
          status,
          buyOrder,
          sessionId,
          monto,
          plan,
          metodoPago,
          token,
          res
        );
      }
    } catch (err) {
      if (connection) await connection.rollback();
      logger.error('Error en commitTransaction:', err);

      const errorMessage = err.message.includes('Transacción en proceso')
        ? 'La transacción está siendo procesada'
        : 'Error al procesar el pago';

      return res
        .status(err.message.includes('Transacción en proceso') ? 409 : 500)
        .json({
          status: 'ERROR',
          error: errorMessage,
          code: err.message.includes('Transacción en proceso')
            ? 'TRANSACTION_IN_PROGRESS'
            : 'UNEXPECTED_ERROR',
          details: err.message
        });
    } finally {
      if (connection) connection.release();
    }
  }

  // Manejar pago de proyecto
  async handleProjectPayment(connection, status, buyOrder, sessionId, monto, token, res) {
    const idProyecto = buyOrder.split('-')[1];
    const idUsuario = sessionId.split('-')[1];

    if (status === 'APPROVED') {
      await connection.beginTransaction();

      try {
        const fechaPago = new Date();
        const horaPago = fechaPago.toTimeString().split(' ')[0];
        const fechaPagoFinal = fechaPago.toISOString().split('T')[0];

        await connection.query(
          `INSERT INTO pago_proyecto 
           (id_proyecto, id_usuario, monto, fecha_pago, hora_pago, estado_pago, metodo_pago, referencia_pago)
           VALUES (?, ?, ?, ?, ?, 'completado', ?, ?)`,
          [idProyecto, idUsuario, monto, fechaPagoFinal, horaPago, 'Webpay', token]
        );

        await connection.query(
          `UPDATE publicacion_proyecto
           SET fecha_creacion = CURDATE(), estado_publicacion = 'activo'
           WHERE id_proyecto = ?`,
          [idProyecto]
        );

        await connection.commit();

        return res.json({
          status: 'APPROVED',
          token: token,
          buyOrder: buyOrder,
          amount: monto,
          type: 'PROJECT_PUBLICATION',
          projectId: idProyecto,
          message: 'Pago de publicación de proyecto procesado exitosamente'
        });
      } catch (dbError) {
        await connection.rollback();
        logger.error('Error en handleProjectPayment:', dbError);
        return res.status(500).json({
          status: 'ERROR',
          error: 'Error al procesar el pago del proyecto',
          code: 'PROJECT_PAYMENT_ERROR',
          details: dbError.message
        });
      }
    } else {
      // Pago rechazado
      await connection.beginTransaction();

      try {
        const fechaPago = new Date();
        const horaPago = fechaPago.toTimeString().split(' ')[0];
        const fechaPagoFinal = fechaPago.toISOString().split('T')[0];

        const [existingPayment] = await connection.query(
          'SELECT id_pago FROM pago_proyecto WHERE referencia_pago = ?',
          [token]
        );

        if (existingPayment.length) {
          await connection.query(
            `UPDATE pago_proyecto 
             SET estado_pago = 'fallido', monto = ?, fecha_pago = ?, hora_pago = ?
             WHERE referencia_pago = ?`,
            [monto, fechaPagoFinal, horaPago, token]
          );
        } else {
          await connection.query(
            `INSERT INTO pago_proyecto 
             (id_proyecto, id_usuario, monto, fecha_pago, hora_pago, estado_pago, metodo_pago, referencia_pago)
             VALUES (?, ?, ?, ?, ?, 'fallido', ?, ?)`,
            [idProyecto, idUsuario, monto, fechaPagoFinal, horaPago, 'Webpay', token]
          );
        }

        await connection.query(
          `UPDATE publicacion_proyecto SET estado_publicacion = 'sin publicar'
           WHERE id_proyecto = ?`,
          [idProyecto]
        );

        await connection.commit();

        return res.status(400).json({
          status: 'REJECTED',
          token: token,
          buyOrder: buyOrder,
          amount: monto,
          type: 'PROJECT_PUBLICATION',
          projectId: idProyecto,
          message: 'Pago de publicación de proyecto rechazado',
          reason: 'Transaction not authorized'
        });
      } catch (dbError) {
        await connection.rollback();
        logger.error('Error en handleProjectPayment (reject):', dbError);
        return res.status(500).json({
          status: 'ERROR',
          error: 'Error al procesar el pago rechazado del proyecto',
          code: 'PROJECT_PAYMENT_REJECT_ERROR',
          details: dbError.message
        });
      }
    }
  }

  // Manejar pago de suscripción
  async handleSubscriptionPayment(
    connection,
    status,
    buyOrder,
    sessionId,
    monto,
    plan,
    metodoPago,
    token,
    res
  ) {
    const idUsuario = sessionId.split('-')[1];

    if (status === 'APPROVED') {
      await connection.beginTransaction();

      try {
        const [existingSubscription] = await connection.query(
          `SELECT id_pago FROM pago_suscripcion 
           WHERE id_usuario = ? AND estado_suscripcion = 'activa'`,
          [idUsuario]
        );

        if (existingSubscription.length) {
          return res.status(409).json({
            status: 'ERROR',
            error: 'Ya existe una suscripción activa',
            code: 'ACTIVE_SUBSCRIPTION_EXISTS',
            userId: idUsuario
          });
        }

        const fechaPago = new Date();
        const horaPago = fechaPago.toTimeString().split(' ')[0];
        const diasDuracion = plan === 'mensual' ? 30 : 360;

        const fechaInicio = new Date(fechaPago);
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + diasDuracion);

        const fechaInicioFormatted = fechaInicio.toISOString().split('T')[0];
        const fechaFinFormatted = fechaFin.toISOString().split('T')[0];

        await connection.query(
          `INSERT INTO pago_suscripcion 
           (id_usuario, monto, fecha_pago, hora_pago, estado_pago, metodo_pago, 
            referencia_pago, plan_suscripcion, fecha_inicio, fecha_fin, estado_suscripcion)
           VALUES (?, ?, ?, ?, 'completado', ?, ?, ?, ?, ?, 'activa')`,
          [
            idUsuario,
            monto,
            fechaInicioFormatted,
            horaPago,
            metodoPago,
            token,
            plan,
            fechaInicioFormatted,
            fechaFinFormatted
          ]
        );

        const userCheckResults = await User.findById(idUsuario);
        if (userCheckResults.length === 0) {
          return res.status(404).json({
            status: 'ERROR',
            error: 'Usuario no encontrado',
            code: 'USER_NOT_FOUND'
          });
        }

        const tipo_usuario = userCheckResults[0].tipo_usuario;
        
        if (tipo_usuario === 'freelancer') {
          await Freelancer.updatePremium(idUsuario, 1);
        } else if (tipo_usuario === 'empresa') {
          await Empresa.updatePremium(idUsuario, 1);
        } else {
          return res.status(400).json({
            status: 'ERROR',
            error: 'Tipo de usuario no permitido',
            code: 'INVALID_USER_TYPE'
          });
        }

        await connection.commit();

        return res.json({
          status: 'APPROVED',
          token: token,
          buyOrder: buyOrder,
          amount: monto,
          type: 'SUBSCRIPTION',
          userId: idUsuario,
          plan: plan,
          subscriptionStart: fechaInicioFormatted,
          subscriptionEnd: fechaFinFormatted,
          message: 'Suscripción procesada exitosamente'
        });
      } catch (dbError) {
        await connection.rollback();
        logger.error('Error en handleSubscriptionPayment:', dbError);
        return res.status(500).json({
          status: 'ERROR',
          error: `Error en la base de datos: ${dbError.message}`,
          code: 'SUBSCRIPTION_PROCESSING_ERROR',
          details: dbError.message
        });
      }
    } else {
      // Pago rechazado
      try {
        await connection.query(
          `INSERT INTO pago_suscripcion 
           (id_usuario, monto, fecha_pago, hora_pago, estado_pago, metodo_pago, 
            referencia_pago, plan_suscripcion, estado_suscripcion)
           VALUES (?, ?, CURDATE(), CURTIME(), 'fallido', ?, ?, ?, 'pendiente')`,
          [idUsuario, monto, metodoPago, token, plan]
        );

        return res.status(400).json({
          status: 'REJECTED',
          token: token,
          buyOrder: buyOrder,
          amount: monto,
          type: 'SUBSCRIPTION',
          userId: idUsuario,
          plan: plan,
          message: 'Pago de suscripción rechazado',
          reason: 'Transaction not authorized'
        });
      } catch (dbError) {
        logger.error('Error en handleSubscriptionPayment (reject):', dbError);
        return res.status(500).json({
          status: 'ERROR',
          error: 'Error al registrar pago de suscripción rechazado',
          code: 'SUBSCRIPTION_REJECT_ERROR',
          details: dbError.message
        });
      }
    }
  }

  // Obtener pagos de proyectos
  async getPagosProyectos(req, res, next) {
    try {
      const [pagosProyectos] = await pool.query(`
        SELECT 
          pp.id_pago,
          pp.id_proyecto,
          pp.id_usuario,
          pp.monto,
          pp.fecha_pago,
          pp.estado_pago,
          pp.metodo_pago,
          pp.referencia_pago,
          u.correo,
          u.tipo_usuario
        FROM pago_proyecto pp
        INNER JOIN usuario u ON pp.id_usuario = u.id_usuario
      `);

      if (pagosProyectos.length === 0) {
        return res.status(404).json({ error: 'No se encontraron pagos de proyectos' });
      }

      return success(res, pagosProyectos);
    } catch (err) {
      logger.error('Error en getPagosProyectos:', err);
      next(err);
    }
  }

  // Obtener pagos de suscripciones
  async getPagosSuscripciones(req, res, next) {
    try {
      const [pagosSuscripciones] = await pool.query(`
        SELECT 
          ps.id_pago,
          ps.id_usuario,
          ps.monto,
          ps.fecha_pago,
          ps.estado_pago,
          ps.metodo_pago,
          ps.referencia_pago,
          ps.plan_suscripcion,
          ps.fecha_inicio,
          ps.fecha_fin,
          u.correo,
          u.tipo_usuario
        FROM pago_suscripcion ps
        INNER JOIN usuario u ON ps.id_usuario = u.id_usuario
      `);

      if (pagosSuscripciones.length === 0) {
        return res.status(404).json({ error: 'No se encontraron pagos de suscripciones' });
      }

      return success(res, pagosSuscripciones);
    } catch (err) {
      logger.error('Error en getPagosSuscripciones:', err);
      next(err);
    }
  }
}

module.exports = new PaymentController();