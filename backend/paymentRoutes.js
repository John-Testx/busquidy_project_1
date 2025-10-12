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

// routes/payments.js
router.post("/create_transaction_project", async (req, res) => {
  let connection;
  try {
    const { amount, buyOrder, sessionId, returnUrl: requestReturnUrl, projectId, companyId } = req.body;

    if (!amount || !buyOrder || !sessionId) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const returnUrl = requestReturnUrl || `${process.env.FRONTEND_URL || "http://localhost:3000"}/myprojects`;

    // No DB connection needed here for just creating the transaction
    const response = await PaymentService.createProjectTransaction({
      amount,
      buyOrder,
      sessionId,
      returnUrl,
      projectId,
      companyId,
    });

    // Response contains url and token_ws
    res.json(response);
  } catch (error) {
    console.error("Error en create_transaction_project:", error);
    res.status(500).json({ error: "Error al crear la transacción: " + error.message });
  } finally {
    if (connection) {
      try { await connection.release(); } catch (e) { console.warn("Failed to release connection:", e); }
    }
  }
});


// GET /pagos-proyectos
router.get("/pagos-proyectos", async (req, res) => {
  try {
    const [pagosProyectos] = await pool.query(`
      SELECT
        p.id_pago,
        p.id_usuario,
        p.monto,
        p.fecha_pago,
        p.estado_pago,
        p.metodo_pago,
        p.referencia_externa AS referencia_pago,
        p.tipo_pago,

        pdp.id_proyecto,
        pr.titulo AS nombre_proyecto,
        pr.descripcion AS descripcion_proyecto,
        pr.categoria,
        pr.presupuesto,
        pr.duracion_estimada,
        pr.ubicacion,
        pr.tipo_contratacion,
        pr.metodologia_trabajo,

        pp.fecha_creacion,
        pp.fecha_publicacion,
        pp.estado_publicacion,

        u.correo,
        u.tipo_usuario AS tipo_usuario

      FROM pago p
      INNER JOIN pago_detalle_proyecto pdp ON p.id_pago = pdp.id_pago
      INNER JOIN proyecto pr ON pdp.id_proyecto = pr.id_proyecto
      LEFT JOIN publicacion_proyecto pp ON pr.id_proyecto = pp.id_proyecto
      INNER JOIN usuario u ON p.id_usuario = u.id_usuario
      WHERE p.tipo_pago = 'proyecto'
      ORDER BY p.fecha_pago DESC
    `);

    if (pagosProyectos.length === 0) {
      return res.status(404).json({ error: "No se encontraron pagos de proyectos" });
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
    // Obtener pagos relacionados con suscripciones (no proyectos)
    const [pagosSuscripciones] = await pool.query(`
      SELECT 
        p.id_pago,
        p.id_usuario,
        p.monto,
        p.fecha_pago,
        p.estado_pago,
        p.metodo_pago,
        p.referencia_externa AS referencia_pago,
        p.tipo_pago,
        
        s.id_suscripcion,
        s.fecha_inicio,
        s.fecha_fin,
        s.estado AS estado_suscripcion,
        
        pl.id_plan,
        pl.nombre AS nombre_plan,
        pl.descripcion AS descripcion_plan,
        pl.duracion_dias,
        pl.precio AS precio_plan,
        pl.tipo_usuario AS tipo_plan_usuario,
        
        u.correo,
        u.tipo_usuario AS tipo_usuario
        
      FROM pago p
      INNER JOIN pago_detalle_suscripcion pds ON p.id_pago = pds.id_pago
      INNER JOIN suscripcion s ON pds.id_suscripcion = s.id_suscripcion
      INNER JOIN plan pl ON s.id_plan = pl.id_plan
      INNER JOIN usuario u ON p.id_usuario = u.id_usuario
      WHERE p.tipo_pago = 'suscripcion'
      ORDER BY p.fecha_pago DESC
    `);

    if (pagosSuscripciones.length === 0) {
      return res.status(404).json({ error: "No se encontraron pagos de suscripciones" });
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
      const metodoPago = response.originalData?.metodoPago || "Webpay";
      const idUsuario = String(sessionId).includes("-") ? sessionId.split("-")[1] : sessionId;

      connection = await pool.getConnection();

      if (buyOrder.startsWith("BO-")) {
        console.log("Processing project publication payment for buyOrder:", buyOrder);
        const idProyecto = response.originalData?.projectId || parseInt(buyOrder.split("-")[1], 10);

        if (!idProyecto || isNaN(idProyecto)) {
          throw new Error("ID de proyecto inválido");
        }

        const pagoId = await handleProjectPayment(connection, {
          idUsuario,
          idProyecto,
          monto,
          metodoPago,
          token,
          status,
        });

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
        const planRaw = response.originalData?.planIdToUse || response.planId || null;
        if (!planRaw) throw { code: "INVALID_PLAN", message: "No se proporcionó plan válido" };
        const subResult = await handleSubscriptionPayment(connection, {
          idUsuario,
          monto,
          metodoPago,
          token,
          status,
          planRaw,
        });
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

      if (error.message === "Transacción en proceso") {
        return res.status(202).json({
          status: "PENDING",
          message: "El pago se está confirmando, por favor espera unos segundos...",
          code: "TRANSACTION_IN_PROGRESS"
        });
      }

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