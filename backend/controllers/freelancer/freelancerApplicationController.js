const { pool } = require("../../db");

// ============================================
// CREAR POSTULACIÓN A UN PROYECTO
// ============================================
const createApplication = async (req, res) => {
  const { id_publicacion } = req.params;
  const { id_usuario } = req.body;

  console.log("id_publicacion:", id_publicacion);
  console.log("id_usuario:", id_usuario);

  if (!id_publicacion || isNaN(id_publicacion) || !id_usuario || isNaN(id_usuario)) {
    return res.status(400).json({ error: "ID invalido" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Verificar si el freelancer ya aplicó a este proyecto
    const [existingApplications] = await connection.query(
      `SELECT * FROM postulacion 
       JOIN freelancer ON postulacion.id_freelancer = freelancer.id_freelancer
       WHERE postulacion.id_publicacion = ? AND freelancer.id_usuario = ?`,
      [id_publicacion, id_usuario]
    );

    if (existingApplications.length > 0) {
      await connection.rollback();
      return res.status(400).json({ error: "Ya has aplicado a este proyecto" });
    }

    // Obtener freelancer
    const [perfilFreelancerResults] = await connection.query(
      "SELECT id_freelancer FROM freelancer WHERE id_usuario = ?",
      [id_usuario]
    );

    if (perfilFreelancerResults.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "No se encontró el freelancer" });
    }

    const id_freelancer = perfilFreelancerResults[0].id_freelancer;

    // Insertar postulación
    await connection.query(
      `INSERT INTO postulacion (id_publicacion, id_freelancer, fecha_postulacion, estado_postulacion)
       VALUES (?, ?, CURDATE(), 'postulado')`,
      [id_publicacion, id_freelancer]
    );

    await connection.commit();
    res.status(201).json({
      message: "Postulación exitosa",
      id_publicacion: id_publicacion,
    });
  } catch (error) {
    console.error("Error al intentar postular:", error);
    if (connection) await connection.rollback();
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (connection) connection.release();
  }
};

// ============================================
// OBTENER POSTULACIONES DEL FREELANCER
// ============================================
const getApplications = async (req, res) => {
  const { id_usuario } = req.params;

  if (!id_usuario || isNaN(id_usuario)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    // Obtener ID del freelancer asociado al usuario
    const [perfilFreelancerResults] = await pool.query(
      "SELECT id_freelancer FROM freelancer WHERE id_usuario = ?",
      [id_usuario]
    );

    if (perfilFreelancerResults.length === 0) {
      return res.status(404).json({ error: "No se encontró el freelancer" });
    }

    const id_freelancer = perfilFreelancerResults[0].id_freelancer;

    // Obtener postulaciones del freelancer
    const [postulaciones] = await pool.query(
      `SELECT 
        p.id_postulacion,
        p.fecha_postulacion,
        p.estado_postulacion,
        pr.titulo AS titulo,
        e.nombre_empresa,
        e.correo_empresa,
        e.telefono_contacto,
        pp.fecha_publicacion,
        pp.estado_publicacion
       FROM postulacion AS p
       INNER JOIN publicacion_proyecto AS pp ON p.id_publicacion = pp.id_publicacion
       INNER JOIN proyecto AS pr ON pp.id_proyecto = pr.id_proyecto
       INNER JOIN empresa AS e ON pr.id_empresa = e.id_empresa
       WHERE p.id_freelancer = ?`,
      [id_freelancer]
    );

    res.json(postulaciones);
  } catch (error) {
    console.error("Error al obtener las postulaciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ============================================
// ELIMINAR POSTULACIÓN
// ============================================
const deleteApplication = async (req, res) => {
  const { id_postulacion } = req.params;

  if (!id_postulacion || isNaN(id_postulacion)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Verificar si la postulación existe
    const [postulacionExists] = await connection.query(
      "SELECT COUNT(*) as count FROM postulacion WHERE id_postulacion = ?",
      [id_postulacion]
    );

    if (postulacionExists[0].count === 0) {
      return res.status(404).json({
        success: false,
        message: "Postulación no encontrada",
      });
    }

    // Eliminar postulación
    await connection.query(`DELETE FROM postulacion WHERE id_postulacion = ?`, [id_postulacion]);

    res.status(200).json({
      success: true,
      message: "Postulación eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar la postulación:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la postulación",
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createApplication,
  getApplications,
  deleteApplication,
};