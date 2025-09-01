const express = require("express");
const PaymentService = require("./paymentService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {verifyToken, validatePaymentData, validateUser, upload} = require("./middlewares/auth");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const router = express.Router();
const fs = require("fs");
const {procesarCV} = require("./cvService");
const {pool,
  insertarUsuario,
  getUserById,
  getEmpresaByUserId,
  getFreelancerByUserId,
  buscarEmpresaByUserId,
  buscarFreelancerByUserId,
  getRepresentanteByUserId,
  checkDuplicateProject,
  guardarPerfilEnDB,
} = require("./db");
const sendError = (res, status, message) => res.status(status).json({message});

// Crear transacción para suscripciones
router.post("/create_transaction_suscription", async (req, res) => {
  try {
    // Destructurar todos los datos de la solicitud, incluyendo returnUrl si está presente
    const {
      amount,
      buyOrder,
      sessionId,
      plan,
      tipoUsuario,
      metodoPago,
      returnUrl: requestReturnUrl,
    } = req.body;

    // Verificar datos obligatorios
    if (!amount || !buyOrder || !sessionId || !plan || !tipoUsuario || !metodoPago) {
      return res.status(400).json({error: "Datos incompletos o inválidos"});
    }

    // Usar el returnUrl de la solicitud o generar uno predeterminado
    const returnUrl = requestReturnUrl ||
            (process.env.FRONTEND_URL ?
                `${process.env.FRONTEND_URL}/freelancer` :
                "http://localhost:3000/freelancer");

    // Verificar que returnUrl no esté vacío
    if (!returnUrl) {
      return res.status(500).json({error: "URL de retorno no configurada"});
    }

    // Validación adicional de plan
    if (!["mensual", "anual"].includes(plan)) {
      return res.status(400).json({error: "Plan de suscripción inválido"});
    }

    console.log("Datos para PaymentService:", {
      amount,
      buyOrder,
      sessionId,
      plan,
      tipoUsuario,
      metodoPago,
      returnUrl,
    });

    const response = await PaymentService.createTransaction({
      amount,
      buyOrder,
      sessionId,
      plan,
      tipoUsuario,
      metodoPago,
      returnUrl,
    });

    res.json(response);
  } catch (error) {
    console.error("Error en create_transaction_suscription:", error);
    res.status(500).json({error: error.message});
  }
});
// Crear transacción para proyectos
router.post("/create_transaction_project", async (req, res) => {
  try {
    const {amount, buyOrder, sessionId} = req.body;
    if (!amount || !buyOrder || !sessionId) {
      return res.status(400).json({error: "Datos incompletos"});
    }

    const returnUrl = `${process.env.FRONTEND_URL}/myprojects`;
    const response = await PaymentService.createTransaction({
      amount,
      buyOrder,
      sessionId,
      plan: "mensual",
      returnUrl,
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});


// Ruta para traer tabla pagos proyectos
router.get("/pagos-proyectos", async (req, res) => {
  try {
    // Consulta para obtener pagos de proyectos y los datos del usuario relacionado
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
            INNER JOIN usuario u 
            ON pp.id_usuario = u.id_usuario
        `);

    if (pagosProyectos.length === 0) {
      return res.status(404).json({error: "No se encontraron pagos de proyectos"});
    }

    res.json(pagosProyectos);
  } catch (error) {
    console.error("Error al obtener pagos de proyectos:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      mensaje: error.message,
    });
  }
});

// Ruta para traer tabla pagos suscripciones
router.get("/pagos-suscripciones", async (req, res) => {
  try {
    // Consulta para obtener pagos de suscripciones y los datos del usuario relacionado
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
            INNER JOIN usuario u 
            ON ps.id_usuario = u.id_usuario
        `);

    if (pagosSuscripciones.length === 0) {
      return res.status(404).json({error: "No se encontraron pagos de suscripciones"});
    }

    res.json(pagosSuscripciones);
  } catch (error) {
    console.error("Error al obtener pagos de suscripciones:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      mensaje: error.message,
    });
  }
});


// Confirmar transacción
router.post("/commit_transaction", async (req, res) => {
  const {token} = req.body;
  if (!token) {
    return res.status(400).json({
      status: "ERROR",
      error: "Token no proporcionado",
      code: "INVALID_TOKEN",
    });
  }

  let connection;
  try {
    const response = await PaymentService.commitTransaction(token);

    // Añade más logging para depuración
    console.log("Respuesta completa de commitTransaction:", response);

    const status = response.status === "AUTHORIZED" ? "APPROVED" : "REJECTED";
    connection = await pool.getConnection();

    const buyOrder = response.buy_order;
    const sessionId = response.session_id;
    const monto = response.amount;

    // Extrae los datos de originalData de manera más segura
    const plan = response.originalData?.plan || response.plan;
    const metodoPago = response.originalData?.metodoPago || response.metodoPago;

    console.log("Plan recibido:", plan);
    console.log("Método de pago recibido:", metodoPago);

    // Identificar tipo de transacción
    if (buyOrder.startsWith("BO-")) {
      // Transacción de publicación de proyecto
      const idProyecto = buyOrder.split("-")[1];
      const idUsuario = sessionId.split("-")[1];

      if (status === "APPROVED") {
        await connection.beginTransaction();
        console.log("Procesando transacción aprobada:", {buyOrder, sessionId, monto});
        const fechaPago = new Date();
        const horaPago = fechaPago.toTimeString().split(" ")[0];
        const newFechaPago = new Date(fechaPago);

        // Formatear fechas para MySQL
        const fechaPagoFinal = newFechaPago.toISOString().split("T")[0];
        try {
          // Insertar registro de pago
          await connection.query(
              `INSERT INTO pago_proyecto 
                        (id_proyecto, id_usuario, monto, fecha_pago, hora_pago, estado_pago, metodo_pago, referencia_pago)
                        VALUES (?, ?, ?, ?, ?, 'completado', ?, ?)`,
              [idProyecto, idUsuario, monto, fechaPagoFinal, horaPago, "Webpay", token],
          );

          // Actualizar estado de la publicación
          await connection.query(
              `UPDATE publicacion_proyecto
                        SET fecha_creacion = CURDATE(), estado_publicacion = 'activo'
                        WHERE id_proyecto = ?`,
              [idProyecto],
          );

          // Confirmar transacción
          await connection.commit();

          console.log("Pago registrado exitosamente");
          return res.json({
            status: "APPROVED",
            token: token,
            buyOrder: response.buy_order,
            amount: monto,
            type: "PROJECT_PUBLICATION",
            projectId: idProyecto,
            message: "Pago de publicación de proyecto procesado exitosamente",
          });
        } catch (dbError) {
          await connection.rollback();
          console.error("Error en la base de datos:", dbError);
          return res.status(500).json({
            status: "ERROR",
            error: "Error al procesar el pago del proyecto",
            code: "PROJECT_PAYMENT_ERROR",
            details: dbError.message,
          });
        }
      } else if (status === "REJECTED") {
        const fechaPago = new Date();
        const horaPago = fechaPago.toTimeString().split(" ")[0];
        const newFechaPago = new Date(fechaPago);

        // Formatear fechas para MySQL
        const fechaPagoFinal = newFechaPago.toISOString().split("T")[0];
        await connection.beginTransaction();

        try {
          // Verificar si el pago ya fue registrado
          const [existingPayment] = await connection.query(
              "SELECT id_pago FROM pago_proyecto WHERE referencia_pago = ?",
              [token],
          );

          if (existingPayment.length) {
            // Actualizar el registro existente
            await connection.query(
                `UPDATE pago_proyecto 
                            SET estado_pago = 'fallido', monto = ?, fecha_pago = ?, hora_pago = ?
                            WHERE referencia_pago = ?`,
                [monto, fechaPagoFinal, horaPago, token],
            );
          } else {
            // Insertar nuevo registro de pago fallido
            await connection.query(
                `INSERT INTO pago_proyecto 
                            (id_proyecto, id_usuario, monto, fecha_pago, hora_pago, estado_pago, metodo_pago, referencia_pago)
                            VALUES (?, ?, ?, ?, ?, 'fallido', ?, ?)`,
                [idProyecto, idUsuario, monto, fechaPago, horaPago, "Webpay", token],
            );
          }

          // Actualizar estado de la publicación a 'sin publicar'
          await connection.query(
              `UPDATE publicacion_proyecto
                        SET estado_publicacion = 'sin publicar'
                        WHERE id_proyecto = ?`,
              [idProyecto],
          );

          // Confirmar transacción
          await connection.commit();

          console.log("Pago rechazado registrado correctamente");

          return res.status(400).json({
            status: "REJECTED",
            token: token,
            buyOrder: response.buy_order,
            amount: monto,
            type: "PROJECT_PUBLICATION",
            projectId: idProyecto,
            message: "Pago de publicación de proyecto rechazado",
            reason: "Transaction not authorized",
          });
        } catch (dbError) {
          await connection.rollback();
          console.error("Error en la base de datos:", dbError);
          return res.status(500).json({
            status: "ERROR",
            error: "Error al procesar el pago rechazado del proyecto",
            code: "PROJECT_PAYMENT_REJECT_ERROR",
            details: dbError.message,
          });
        }
      }
    } else if (buyOrder.startsWith("SUB-")) {
      // Transacción de suscripción
      const idUsuario = sessionId.split("-")[1];

      if (status === "APPROVED") {
        await connection.beginTransaction();

        try {
          // Verificar si ya existe una suscripción activa
          const [existingSubscription] = await connection.query(
              `SELECT id_pago FROM pago_suscripcion WHERE id_usuario = ? AND estado_suscripcion = 'activa'`,
              [idUsuario],
          );

          if (!existingSubscription.length) {
            // Obtener la fecha actual y hora del pago
            const fechaPago = new Date();
            const horaPago = fechaPago.toTimeString().split(" ")[0];

            // Determinar el plan de suscripción (mensual o anual)
            const diasDuracion = plan === "mensual" ? 30 : 360;

            // Calcular fechas de inicio y fin
            const fechaInicio = new Date(fechaPago);
            const fechaFin = new Date(fechaInicio);
            fechaFin.setDate(fechaFin.getDate() + diasDuracion);

            // Formatear fechas para MySQL
            const fechaInicioFormatted = fechaInicio.toISOString().split("T")[0];
            const fechaFinFormatted = fechaFin.toISOString().split("T")[0];

            // Insertar en la tabla `pago_suscripcion`
            const [insertResult] = await connection.query(
                `INSERT INTO pago_suscripcion 
                            (id_usuario, monto, fecha_pago, hora_pago, estado_pago, metodo_pago, referencia_pago, plan_suscripcion, fecha_inicio, fecha_fin, estado_suscripcion)
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
                  fechaFinFormatted,
                ],
            );

            // Buscar `tipo_usuario` en la tabla `usuario`
            const userCheckResults = await getUserById(idUsuario);
            if (userCheckResults.length === 0) {
              return res.status(404).json({
                status: "ERROR",
                error: "Usuario no encontrado",
                code: "USER_NOT_FOUND",
              });
            }

            const tipo_usuario = userCheckResults[0].tipo_usuario;
            if (tipo_usuario == "freelancer") {
              // Actualizar `premium` en la tabla `freelancer`
              await connection.query(
                  `UPDATE freelancer SET premium = 1 WHERE id_usuario = ?`, [idUsuario],
              );
            } else if (tipo_usuario == "empresa") {
              // Actualizar `premium` en la tabla `empresa`
              await connection.query(
                  `UPDATE empresa SET premium = 1 WHERE id_usuario = ?`, [idUsuario],
              );
            } else {
              return res.status(400).json({
                status: "ERROR",
                error: "Tipo de usuario no permitido",
                code: "INVALID_USER_TYPE",
              });
            }

            // Confirmar la transacción en la base de datos
            await connection.commit();

            return res.json({
              status: "APPROVED",
              token: token,
              buyOrder: response.buy_order,
              amount: monto,
              type: "SUBSCRIPTION",
              userId: idUsuario,
              plan: plan,
              subscriptionStart: fechaInicioFormatted,
              subscriptionEnd: fechaFinFormatted,
              message: "Suscripción procesada exitosamente",
            });
          } else {
            // Ya existe una suscripción activa
            return res.status(409).json({
              status: "ERROR",
              error: "Ya existe una suscripción activa",
              code: "ACTIVE_SUBSCRIPTION_EXISTS",
              userId: idUsuario,
            });
          }
        } catch (dbError) {
          // Revertir en caso de error
          await connection.rollback();
          return res.status(500).json({
            status: "ERROR",
            error: `Error en la base de datos: ${dbError.message}`,
            code: "SUBSCRIPTION_PROCESSING_ERROR",
            details: dbError.message,
          });
        }
      } else {
        // Manejo de pagos rechazados para suscripciones
        try {
          await connection.query(
              `INSERT INTO pago_suscripcion 
                        (id_usuario, monto, fecha_pago, hora_pago, estado_pago, metodo_pago, referencia_pago, plan_suscripcion, estado_suscripcion)
                        VALUES (?, ?, CURDATE(), CURTIME(), 'fallido', ?, ?, ?, 'pendiente')`,
              [idUsuario, monto, metodoPago, token, plan],
          );

          return res.status(400).json({
            status: "REJECTED",
            token: token,
            buyOrder: response.buy_order,
            amount: monto,
            type: "SUBSCRIPTION",
            userId: idUsuario,
            plan: plan,
            message: "Pago de suscripción rechazado",
            reason: "Transaction not authorized",
          });
        } catch (dbError) {
          return res.status(500).json({
            status: "ERROR",
            error: "Error al registrar pago de suscripción rechazado",
            code: "SUBSCRIPTION_REJECT_ERROR",
            details: dbError.message,
          });
        }
      }
    }
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Error al confirmar transacción:", error);

    const errorMessage = error.message.includes("Transacción en proceso") ?
            "La transacción está siendo procesada" :
            "Error al procesar el pago";

    return res.status(error.message.includes("Transacción en proceso") ? 409 : 500).json({
      status: "ERROR",
      error: errorMessage,
      code: error.message.includes("Transacción en proceso") ?
                "TRANSACTION_IN_PROGRESS" :
                "UNEXPECTED_ERROR",
      details: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;