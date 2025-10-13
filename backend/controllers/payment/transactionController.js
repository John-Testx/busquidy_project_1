const pool = require("../../db");
const webpayService = require("../../services/payment/webpayService");
const { processProjectPayment } = require("../../services/payment/projectPaymentService");
const { processSubscriptionPayment } = require("../../services/payment/subscriptionPaymentService");
const { getPlanById } = require("../../queries/payment/planQueries");

/**
 * Crear transacción de suscripción
 */
const createSubscriptionTransaction = async (req, res) => {
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
    const planRow = await getPlanById(plan);

    if (!planRow) {
      return res.status(400).json({ error: "Plan de suscripción inválido" });
    }

    // Map nombre/duration to WebpayService compatible string
    let planNombre;
    const nombreLower = planRow.nombre.toLowerCase();
    if (nombreLower.includes("mensual") || planRow.duracion_dias === 30) {
      planNombre = "mensual";
    } else if (nombreLower.includes("anual") || planRow.duracion_dias === 365) {
      planNombre = "anual";
    } else {
      return res.status(400).json({ error: "Plan de suscripción inválido" });
    }

    console.log("Plan received (raw ID):", plan);
    console.log("Plan mapped for WebpayService:", planNombre);

    const response = await webpayService.createTransaction({
      amount,
      buyOrder,
      sessionId,
      plan: planNombre,       // name used internally for duration
      tipoUsuario,
      metodoPago,
      returnUrl,
      planIdToUse: plan,      // numeric plan id stored for DB
    });

    console.log("[WebpayService] Transaction response:", response);
    res.json(response);
  } catch (error) {
    console.error("Error en create_transaction_suscription:", error);
    res.status(500).json({ error: "Error al crear la transacción: " + error.message });
  } finally {
    if (connection) {
      try { 
        connection.release(); 
      } catch (e) { 
        console.warn("Failed to release connection:", e); 
      }
    }
  }
};

/**
 * Crear transacción de proyecto
 */
const createProjectTransaction = async (req, res) => {
  try {
    const { amount, buyOrder, sessionId, returnUrl: requestReturnUrl, projectId, companyId } = req.body;

    if (!amount || !buyOrder || !sessionId) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const returnUrl = requestReturnUrl || `${process.env.FRONTEND_URL || "http://localhost:3000"}/myprojects`;

    const response = await webpayService.createProjectTransaction({
      amount,
      buyOrder,
      sessionId,
      returnUrl,
      projectId,
      companyId,
    });

    res.json(response);
  } catch (error) {
    console.error("Error en create_transaction_project:", error);
    res.status(500).json({ error: "Error al crear la transacción: " + error.message });
  }
};

/**
 * Confirmar transacción (commit)
 */
const commitTransaction = async (req, res) => {
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
    const response = await webpayService.commitTransaction(token);
    const status = response.status === "AUTHORIZED" ? "APPROVED" : "REJECTED";
    const buyOrder = response.buy_order;
    const sessionId = response.session_id;
    const monto = Number(response.amount) || 0;
    const metodoPago = response.originalData?.metodoPago || "Webpay";
    const idUsuario = String(sessionId).includes("-") ? sessionId.split("-")[1] : sessionId;

    connection = await pool.getConnection();

    // Procesamiento de pago de proyecto
    if (buyOrder.startsWith("BO-")) {
      console.log("Processing project publication payment for buyOrder:", buyOrder);
      const idProyecto = response.originalData?.projectId || parseInt(buyOrder.split("-")[1], 10);

      if (!idProyecto || isNaN(idProyecto)) {
        throw new Error("ID de proyecto inválido");
      }

      const pagoId = await processProjectPayment(connection, {
        idUsuario,
        idProyecto,
        monto,
        metodoPago,
        token,
        status,
      });

      await connection.commit();
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

    // Procesamiento de pago de suscripción
    if (buyOrder.startsWith("SUB-")) {
      const planRaw = response.originalData?.planIdToUse || response.planId || null;
      
      if (!planRaw) {
        throw { code: "INVALID_PLAN", message: "No se proporcionó plan válido" };
      }

      const subResult = await processSubscriptionPayment(connection, {
        idUsuario,
        monto,
        metodoPago,
        token,
        status,
        planRaw,
      });

      await connection.commit();
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
};

module.exports = {
  createSubscriptionTransaction,
  createProjectTransaction,
  commitTransaction,
};