const pool = require("../../db");

/**
 * Insertar un pago en la tabla pago
 * @param {Object} connection - Conexión de base de datos
 * @param {Object} data - Datos del pago
 * @returns {Promise<number>} ID del pago insertado
 */
const insertPago = async (connection, { idUsuario, monto, estadoPago, metodoPago, referenciaExterna, tipoPago }) => {
  const [result] = await connection.query(
    `INSERT INTO pago (id_usuario, monto, estado_pago, metodo_pago, referencia_externa, tipo_pago, fecha_pago)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [idUsuario, monto, estadoPago, metodoPago, referenciaExterna, tipoPago]
  );
  return result.insertId;
};

/**
 * Insertar detalle de pago de proyecto
 * @param {Object} connection - Conexión de base de datos
 * @param {number} idPago - ID del pago
 * @param {number} idProyecto - ID del proyecto
 */
const insertPagoDetalleProyecto = async (connection, idPago, idProyecto) => {
  await connection.query(
    `INSERT INTO pago_detalle_proyecto (id_pago, id_proyecto) VALUES (?, ?)`,
    [idPago, idProyecto]
  );
};

/**
 * Insertar detalle de pago de suscripción
 * @param {Object} connection - Conexión de base de datos
 * @param {number} idPago - ID del pago
 * @param {number} idSuscripcion - ID de la suscripción
 */
const insertPagoDetalleSuscripcion = async (connection, idPago, idSuscripcion) => {
  await connection.query(
    `INSERT INTO pago_detalle_suscripcion (id_pago, id_suscripcion) VALUES (?, ?)`,
    [idPago, idSuscripcion]
  );
};

/**
 * Obtener historial de pagos de proyectos
 * @returns {Promise<Array>} Lista de pagos de proyectos
 */
const getPagosProyectos = async () => {
  const [rows] = await pool.query(`
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
  return rows;
};

/**
 * Obtener historial de pagos de suscripciones
 * @returns {Promise<Array>} Lista de pagos de suscripciones
 */
const getPagosSuscripciones = async () => {
  const [rows] = await pool.query(`
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
  return rows;
};

module.exports = {
  insertPago,
  insertPagoDetalleProyecto,
  insertPagoDetalleSuscripcion,
  getPagosProyectos,
  getPagosSuscripciones,
};