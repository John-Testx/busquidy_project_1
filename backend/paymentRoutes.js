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
const { handleProjectPayment, handleSubscriptionPayment } = require("./helpers/payments");
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


//GET PLANES
router.get("/plan", async (req, res) => {
    const { tipo_usuario } = req.query; // e.g. 'empresa' or 'freelancer'

    try {
        let query = "SELECT id_plan, nombre, precio, tipo_usuario FROM plan";
        const params = [];

        if (tipo_usuario) {
            query += " WHERE tipo_usuario = ?";
            params.push(tipo_usuario);
        }

        const [rows] = await pool.query(query, params);

        // Parse JSON if 'beneficios' is stored as JSON string
        const formattedPlans = rows.map(plan => ({
            ...plan,
            beneficios: (() => {
                try {
                    return JSON.parse(plan.beneficios);
                } catch {
                    return plan.beneficios ? plan.beneficios.split(",") : [];
                }
            })()
        }));

        res.status(200).json(formattedPlans);
    } catch (error) {
        console.error("❌ Error fetching plans:", error);
        res.status(500).json({ error: "Error al obtener los planes" });
    }
});



// Crear transacción para suscripciones
router.post("/create_transaction_suscription", async (req, res) => {
  let connection;
  try {
    const { amount, buyOrder, sessionId, plan, tipoUsuario, metodoPago, returnUrl: requestReturnUrl } = req.body;

    console.log("Received request body:", req.body);

    if (!amount || !buyOrder || !sessionId || !plan || !tipoUsuario || !metodoPago) {
      return res.status(400).json({ error: "Datos incompletos o inválidos" });
    }

    const returnUrl = requestReturnUrl || `${process.env.FRONTEND_URL || "http://localhost:3000"}/freelancer`;

    connection = await pool.getConnection();

    // Fetch plan from DB
    const [planRows] = await connection.query(
      "SELECT id_plan, nombre, duracion_dias, tipo_usuario FROM plan WHERE id_plan = ? LIMIT 1",
      [plan]
    );

    if (!planRows.length) return res.status(400).json({ error: "Plan de suscripción inválido" });

    const planRow = planRows[0];

    // Map nombre/duration to PaymentService compatible string
    let planNombre;
    const nombreLower = planRow.nombre.toLowerCase();
    if (nombreLower.includes("mensual") || planRow.duracion_dias === 30) planNombre = "mensual";
    else if (nombreLower.includes("anual") || planRow.duracion_dias === 365) planNombre = "anual";
    else return res.status(400).json({ error: "Plan de suscripción inválido" });

    console.log("Plan received (raw ID):", plan);
    console.log("Plan mapped for PaymentService:", planNombre);

    const response = await PaymentService.createTransaction({
      amount,
      buyOrder,
      sessionId,
      plan: planNombre,       // name used internally for duration
      tipoUsuario,
      metodoPago,
      returnUrl,
      planIdToUse: plan,      // numeric plan id stored for DB
    });

    console.log("[PaymentService] Transaction response:", response);
    res.json(response);
  } catch (error) {
    console.error("Error en create_transaction_suscription:", error);
    res.status(500).json({ error: "Error al crear la transacción: " + error.message });
  } finally {
    try { connection.release(); } catch (e) { console.warn("Failed to release connection:", e); }
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


// routes/payments.js
router.post("/commit_transaction", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({
      status: "ERROR",
      error: "Token no proporcionado",
      code: "INVALID_TOKEN",
    });
  }

  let connection;
  let responseSent = false;

  try {
    const response = await PaymentService.commitTransaction(token);
    const status = response.status === "AUTHORIZED" ? "APPROVED" : "REJECTED";
    const buyOrder = response.buy_order;
    const sessionId = response.session_id;
    const monto = Number(response.amount) || 0;
    const planRaw = response.originalData?.planIdToUse || response.planId || null; // numeric planId
    console.log("commitTransaction response:", response);
    const metodoPago = response.originalData?.metodoPago || response.metodoPago || "Webpay";

    connection = await pool.getConnection();
    const idUsuario = String(sessionId).includes("-") ? sessionId.split("-")[1] : sessionId;

    if (buyOrder.startsWith("BO-")) {
      const idProyecto = buyOrder.split("-")[1];
      const pagoId = await handleProjectPayment(connection, { idUsuario, idProyecto, monto, metodoPago, token, status });
      responseSent = true;
      return res.json({
        status,
        token,
        buyOrder,
        amount: monto,
        type: "PROJECT_PUBLICATION",
        projectId: idProyecto,
        pagoId,
      });
    }

    if (buyOrder.startsWith("SUB-")) {
      if (!planRaw) throw { code: "INVALID_PLAN", message: "No se proporcionó plan válido" };
      const subResult = await handleSubscriptionPayment(connection, { idUsuario, monto, metodoPago, token, status, planRaw });
      responseSent = true;
      return res.json({
        status,
        token,
        buyOrder,
        amount: monto,
        type: "SUBSCRIPTION",
        userId: idUsuario,
        planId: planRaw,
        ...subResult,
      });
    }

    responseSent = true;
    return res.status(400).json({
      status: "ERROR",
      error: "Tipo de transacción desconocido",
      code: "UNKNOWN_TRANSACTION_TYPE",
    });
  } catch (error) {
    console.error("Error al confirmar transacción:", error);

    if (!responseSent && connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.warn("Error during rollback:", rollbackErr);
      }
    }

    if (!responseSent) {
      const statusCode = error?.code === "ACTIVE_SUBSCRIPTION_EXISTS" ? 409 : 500;
      const errorMsg =
        error?.code === "ACTIVE_SUBSCRIPTION_EXISTS"
          ? "Ya existe una suscripción activa"
          : "Error al procesar el pago";
      return res.status(statusCode).json({
        status: "ERROR",
        error: errorMsg,
        code: error?.code || "UNEXPECTED_ERROR",
        details: error?.message,
      });
    }
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (releaseErr) {
        console.warn("Failed to release connection:", releaseErr);
      }
    }
  }
});


module.exports = router;