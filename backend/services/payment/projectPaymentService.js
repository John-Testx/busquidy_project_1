const { insertPago, insertPagoDetalleProyecto } = require("../../queries/payment/transactionQueries");

/**
 * Procesar pago de publicación de proyecto
 * @param {Object} connection - Conexión de base de datos
 * @param {Object} data - Datos del pago
 * @returns {Promise<number>} ID del pago creado
 */
const processProjectPayment = async (connection, { idUsuario, idProyecto, monto, metodoPago, token, status }) => {
  await connection.beginTransaction();
  
  try {
    const estadoPago = status === "APPROVED" ? "completado" : "fallido";
    const pubEstado = status === "APPROVED" ? "activo" : "sin publicar";

    // Insertar pago
    const pagoId = await insertPago(connection, {
      idUsuario,
      monto,
      estadoPago,
      metodoPago,
      referenciaExterna: token,
      tipoPago: "proyecto"
    });

    // Insertar detalle de pago de proyecto
    await insertPagoDetalleProyecto(connection, pagoId, idProyecto);

    // Actualizar estado de publicación del proyecto
    if (status === "APPROVED") {
      await connection.query(
        `UPDATE publicacion_proyecto 
         SET fecha_creacion = CURDATE(), 
             fecha_publicacion = CURDATE(), 
             estado_publicacion = ? 
         WHERE id_proyecto = ?`,
        [pubEstado, idProyecto]
      );
    } else {
      await connection.query(
        `UPDATE publicacion_proyecto 
         SET estado_publicacion = ? 
         WHERE id_proyecto = ?`,
        [pubEstado, idProyecto]
      );
    }

    await connection.commit();
    return pagoId;
  } catch (err) {
    await connection.rollback();
    throw err;
  }
};

module.exports = {
  processProjectPayment,
};