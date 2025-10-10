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
} = require("../db");


// helpers/payments.js
async function handleProjectPayment(connection, { idUsuario, idProyecto, monto, metodoPago, token, status }) {
  await connection.beginTransaction();
  try {
    const estadoPago = status === "APPROVED" ? "completado" : "fallido";
    const pubEstado = status === "APPROVED" ? "activo" : "sin publicar";

    const [pagoResult] = await connection.query(
      `INSERT INTO pago (id_usuario, monto, metodo_pago, referencia_externa, tipo_pago, estado_pago)
       VALUES (?, ?, ?, ?, 'proyecto', ?)`,
      [idUsuario, monto, metodoPago, token, estadoPago]
    );
    const pagoId = pagoResult.insertId;

    await connection.query(
      `INSERT INTO pago_detalle_proyecto (id_pago, id_proyecto) VALUES (?, ?)`,
      [pagoId, idProyecto]
    );

    if (status === "APPROVED") {
      await connection.query(
        `UPDATE publicacion_proyecto SET fecha_creacion = CURDATE(), fecha_publicacion = CURDATE(), estado_publicacion = ? WHERE id_proyecto = ?`,
        [pubEstado, idProyecto]
      );
    } else {
      await connection.query(
        `UPDATE publicacion_proyecto SET estado_publicacion = ? WHERE id_proyecto = ?`,
        [pubEstado, idProyecto]
      );
    }

    await connection.commit();
    return pagoId;
  } catch (err) {
    await connection.rollback();
    throw err;
  }
}

async function handleSubscriptionPayment(connection, { idUsuario, monto, metodoPago, token, status, planRaw }) {
  await connection.beginTransaction();
  try {
    // Check for existing active subscription
    if (status === "APPROVED") {
      const [existingSubs] = await connection.query(
        `SELECT id_suscripcion FROM suscripcion WHERE id_usuario = ? AND estado = 'activa' AND fecha_fin >= CURDATE()`,
        [idUsuario]
      );
      if (existingSubs.length) throw { code: "ACTIVE_SUBSCRIPTION_EXISTS" };
    }

    // Determine plan duration
    let planIdToUse = planRaw; // planRaw should be numeric
    let duracionDias = 30; // default monthly

    if (typeof planRaw === "number") {
      const [planRows] = await connection.query(
        "SELECT duracion_dias FROM plan WHERE id_plan = ? LIMIT 1",
        [planRaw]
      );
      if (!planRows.length) throw { code: "INVALID_PLAN" };
      duracionDias = planRows[0].duracion_dias;
    } else {
      throw { code: "INVALID_PLAN" };
    }

    // Calculate start and end dates
    const fechaInicio = new Date();
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + duracionDias);

    const formatDate = (d) => d.toISOString().split("T")[0];
    const fechaInicioFormatted = formatDate(fechaInicio);
    const fechaFinFormatted = formatDate(fechaFin);

    const estadoPago = status === "APPROVED" ? "completado" : "fallido";

    // Insert central pago
    const [pagoResult] = await connection.query(
      `INSERT INTO pago (id_usuario, monto, fecha_pago, estado_pago, metodo_pago, referencia_externa, tipo_pago)
       VALUES (?, ?, NOW(), ?, ?, ?, 'suscripcion')`,
      [idUsuario, monto, estadoPago, metodoPago, token]
    );
    const pagoId = pagoResult.insertId;

    // Create suscripcion
    const susEstado = status === "APPROVED" ? "activa" : "pendiente";
    const [susResult] = await connection.query(
      `INSERT INTO suscripcion (id_usuario, id_plan, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)`,
      [idUsuario, planIdToUse, fechaInicioFormatted, fechaFinFormatted, susEstado]
    );
    const suscripcionId = susResult.insertId;

    // Link pago_detalle_suscripcion
    await connection.query(
      `INSERT INTO pago_detalle_suscripcion (id_pago, id_suscripcion) VALUES (?, ?)`,
      [pagoId, suscripcionId]
    );

    // Update premium flag if approved
    if (status === "APPROVED") {
      const userCheckResults = await getUserById(idUsuario);
      if (!userCheckResults.length) throw { code: "USER_NOT_FOUND" };

      const tipo_usuario = userCheckResults[0].tipo_usuario;
      if (tipo_usuario === "freelancer") {
        await connection.query(`UPDATE freelancer SET premium = 1 WHERE id_usuario = ?`, [idUsuario]);
      } else if (tipo_usuario === "empresa") {
        await connection.query(`UPDATE empresa SET premium = 1 WHERE id_usuario = ?`, [idUsuario]);
      } else {
        throw { code: "INVALID_USER_TYPE" };
      }
    }

    await connection.commit();
    return {
      pagoId,
      suscripcionId,
      fechaInicio: fechaInicioFormatted,
      fechaFin: fechaFinFormatted,
      planId: planIdToUse, // return numeric plan ID
      duracionDias,
    };
  } catch (err) {
    await connection.rollback();
    throw err;
  }
}

module.exports = { handleProjectPayment, handleSubscriptionPayment };
