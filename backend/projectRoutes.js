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

// Traer los proyectos y publicaciones de la base de datos
router.get("/getProjects", async (req, res) => {
  try {
    // Consulta para obtener proyectos con sus publicaciones
    const [proyectos] = await pool.query(`
            SELECT 
                p.id_proyecto,
                p.id_empresa,
                p.titulo,
                p.categoria,
                p.descripcion,
                pp.fecha_creacion,
                pp.fecha_publicacion,
                pp.estado_publicacion
            FROM proyecto p
            LEFT JOIN publicacion_proyecto pp 
            ON p.id_proyecto = pp.id_proyecto
        `);

    if (proyectos.length === 0) {
      return res.status(404).json({error: "No se encontraron proyectos"});
    }

    res.json(proyectos);
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      mensaje: error.message,
    });
  }
});

router.get("/getProject/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT 
          p.id_proyecto,
          p.id_empresa,
          p.titulo,
          p.categoria,
          p.descripcion,
          p.habilidades_requeridas,
          p.presupuesto,
          p.duracion_estimada,
          p.fecha_limite,
          p.ubicacion,
          p.tipo_contratacion,
          p.metodologia_trabajo
      FROM proyecto p
      WHERE p.id_proyecto = ?
      LIMIT 1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener proyecto:", error);
    res.status(500).json({ error: "Error interno del servidor", mensaje: error.message });
  }
});

// Update an existing project
router.put("/updateProject/:id", async (req, res) => {
  const { id } = req.params;
  const {
    titulo,
    categoria,
    descripcion,
    habilidades_requeridas,
    presupuesto,
    duracion_estimada,
    fecha_limite,
    ubicacion,
    tipo_contratacion,
    metodologia_trabajo,
  } = req.body;

  try {
    const [result] = await pool.query(
      `
      UPDATE proyecto
      SET
        titulo = ?,
        categoria = ?,
        descripcion = ?,
        habilidades_requeridas = ?,
        presupuesto = ?,
        duracion_estimada = ?,
        fecha_limite = ?,
        ubicacion = ?,
        tipo_contratacion = ?,
        metodologia_trabajo = ?
      WHERE id_proyecto = ?
      `,
      [
        titulo,
        categoria,
        descripcion,
        habilidades_requeridas,
        presupuesto,
        duracion_estimada,
        fecha_limite,
        ubicacion,
        tipo_contratacion,
        metodologia_trabajo,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    res.json({ message: "Proyecto actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar proyecto:", error);
    res.status(500).json({ error: "Error interno del servidor", mensaje: error.message });
  }
});


// Crear proyecto
router.post("/create-project", verifyToken, async (req, res) => {
  const {projectData, id_usuario} = req.body;
  console.log("Datos recibidos para crear proyecto:", projectData, "ID usuario:", id_usuario);  

  if (!id_usuario) {
    console.error("Error: id_usuario es undefined o null");
    return res.status(400).json({error: "ID de usuario inválido"});
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction(); // Inicia la transacción

    // Verificar usuario
    const userCheckResults = await getUserById(id_usuario);
    if (userCheckResults.length === 0) {
      return res.status(404).json({error: "Usuario no encontrado"});
    }


    const tipo_usuario = userCheckResults[0].tipo_usuario;
    if (tipo_usuario !== "empresa") {
      await connection.rollback();
      return res.status(403).json({error: "Acceso no autorizado"});
    }

    // Obtener `id_empresa`
    const empresaResults = await getEmpresaByUserId(id_usuario);
    if (empresaResults.length === 0) {
      await connection.rollback();
      return res.status(404).json({error: "Empresa no encontrada"});
    }

    const id_empresa = empresaResults[0].id_empresa;

    // Verificar duplicados
    const projectCheckResults = await checkDuplicateProject(id_empresa, projectData);
    console.log("Resultado de duplicados:", projectCheckResults);
    if (projectCheckResults.length > 0) {
      await connection.rollback();
      return res.status(409).json({error: "Proyecto duplicado encontrado"});
    }

    // Insertar proyecto
    const [insertProjectResult] = await connection.query(
        `INSERT INTO proyecto 
            (id_empresa, titulo, descripcion, categoria, habilidades_requeridas, presupuesto, 
                duracion_estimada, fecha_limite, ubicacion, tipo_contratacion, metodologia_trabajo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id_empresa,
          projectData.titulo,
          projectData.descripcion,
          projectData.categoria,
          projectData.habilidades_requeridas,
          projectData.presupuesto,
          projectData.duracion_estimada,
          projectData.fecha_limite,
          projectData.ubicacion,
          projectData.tipo_contratacion,
          projectData.metodologia_trabajo,
        ],
    );

    const id_proyecto = insertProjectResult.insertId;

    // Crear publicación
    await connection.query(
        `INSERT INTO publicacion_proyecto (id_proyecto, fecha_creacion, fecha_publicacion, estado_publicacion)
            VALUES (?, CURDATE(), NULL, 'sin publicar')`,
        [id_proyecto],
    );

    await connection.commit(); // Confirma la transacción
    console.log("Proyecto y publicación creados con éxito");
    res.status(200).json({
      message: "Proyecto y publicación creados con éxito",
      projectId: id_proyecto,
    });
  } catch (err) {
    console.error("Error al crear el proyecto:", err);
    if (connection) await connection.rollback();
    res.status(500).json({error: "Error interno del servidor"});
  } finally {
    if (connection) await connection.release();
  }
});

// Ruta para Editar estado proyecto
router.put("/api/proyecto/estado/:id_proyecto", async (req, res) => {
  const {id_proyecto} = req.params;
  const {nuevoEstado} = req.body; // El estado al que se desea cambiar

  try {
    await pool.query("UPDATE proyectos SET estado_publicacion = ? WHERE id_proyecto = ?", [nuevoEstado, id_proyecto]);
    res.status(200).json({message: "Estado del proyecto actualizado con éxito"});
  } catch (error) {
    console.error("Error al actualizar el estado:", error);
    res.status(500).json({message: "Error al actualizar el estado del proyecto"});
  }
});

// Ruta para eliminar proyecto
router.delete("/delete/:id_proyecto", async (req, res) => {
  const {id_proyecto} = req.params;
  let connection;

  try {
    connection = await pool.getConnection();

    // Verificar si el proyecto existe
    const [projectExists] = await connection.query(
        "SELECT COUNT(*) as count FROM proyecto WHERE id_proyecto = ?",
        [id_proyecto],
    );

    if (projectExists[0].count === 0) {
      return res.status(404).json({
        success: false,
        message: "Proyecto no encontrado",
      });
    }

    // Iniciar transacción
    await connection.beginTransaction();

    try {
      // Eliminar registros relacionados
      await connection.query(
          "DELETE FROM publicacion_proyecto WHERE id_proyecto = ?",
          [id_proyecto],
      );

      // Eliminar el proyecto
      await connection.query(
          "DELETE FROM proyecto WHERE id_proyecto = ?",
          [id_proyecto],
      );

      // Confirmar transacción
      await connection.commit();

      res.status(200).json({
        success: true,
        message: "Proyecto eliminado correctamente",
      });
    } catch (error) {
      // Revertir transacción en caso de error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error al eliminar proyecto:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el proyecto",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Ruta para traer los proyectos con su estado de publicación
router.get("/get/:id_usuario", async (req, res) => {
  const {id_usuario} = req.params;
  console.log("id_usuario:", id_usuario);

  if (!id_usuario) {
    console.error("Error: id_usuario es undefined o null");
    return res.status(400).json({error: "ID de usuario inválido"});
  }

  try {
    // Verificar usuario
    const userCheckResults = await getUserById(id_usuario);
    if (userCheckResults.length === 0) {
      return res.status(404).json({error: "Usuario no encontrado"});
    }

    const tipo_usuario = userCheckResults[0].tipo_usuario;
    if (tipo_usuario !== "empresa") {
      return res.status(403).json({error: "Acceso no autorizado"});
    }

    // Obtener `id_empresa`
    const empresaResults = await getEmpresaByUserId(id_usuario);
    if (empresaResults.length === 0) {
      console.error("Empresa no encontrada para el usuario:", id_usuario);
      return res.status(404).json({error: "Empresa no encontrada"});
    }

    const id_empresa = empresaResults[0].id_empresa;

    // Obtener los proyectos asociados a la empresa
    const [projectResults] = await pool.query(
        "SELECT * FROM proyecto WHERE id_empresa = ?",
        [id_empresa],
    );

    if (projectResults.length === 0) {
      console.log("No se encontraron proyectos");
      return res.status(404).json({error: "No se encontraron proyectos"});
    }

    // Obtener los estados de publicación de los proyectos
    const projectIds = projectResults.map((proyecto) => proyecto.id_proyecto);
    const [publicationResults] = await pool.query(
        "SELECT id_proyecto, estado_publicacion FROM publicacion_proyecto WHERE id_proyecto IN (?)",
        [projectIds],
    );

    // Mapear los estados de publicación a sus respectivos proyectos
    const publicationMap = new Map(publicationResults.map((pub) => [pub.id_proyecto, pub.estado_publicacion]));
    const projectsWithStatus = projectResults.map((proyecto) => ({
      ...proyecto,
      estado_publicacion: publicationMap.get(proyecto.id_proyecto) || "Desconocido",
    }));

    res.json(projectsWithStatus);
  } catch (error) {
    console.error("Error al obtener proyectos:", error.message);
    res.status(500).json({error: "Error interno del servidor"});
  }
});

// Ruta para bajar publicación
router.put("/update-proyecto-state/:id_proyecto", async (req, res) => {
  const {id_proyecto} = req.params;

  if (!id_proyecto || isNaN(id_proyecto)) {
    return res.status(400).json({error: "ID de usuario inválido"});
  }

  try {
    const [results] = await pool.query(`
            UPDATE publicacion_proyecto SET estado_publicacion = 'cancelado'
            WHERE id_proyecto = ?`, [id_proyecto],
    );

    // Verificar si se actualizaron registros
    if (results.affectedRows === 0) {
      return res.status(404).json({error: "No se encontro publicación para bajar"});
    }

    res.json({mensaje: "Actualización exitosa"});
  } catch (error) {
    console.error("Error al intentar bajar la publicación", error);
    res.status(500).json({error: "Error al bajar publicación", detalles: error.message});
  }
});

// Ruta para traer las publicaciones con sus proyectos
router.get("/publicacion", async (req, res) => {
  try {
    // Consulta combinada de proyectos y publicaciones
    const getProjectsWithPublicationsQuery = `
            SELECT 
                p.id_proyecto, 
                p.id_empresa, 
                p.titulo, 
                p.descripcion, 
                p.categoria, 
                p.habilidades_requeridas, 
                p.presupuesto, 
                p.duracion_estimada, 
                p.fecha_limite, 
                p.ubicacion, 
                p.tipo_contratacion, 
                p.metodologia_trabajo, 
                pub.id_publicacion, 
                pub.fecha_creacion, 
                pub.fecha_publicacion, 
                pub.estado_publicacion
            FROM 
                proyecto p
            LEFT JOIN 
                publicacion_proyecto pub 
            ON 
                p.id_proyecto = pub.id_proyecto;
        `;

    // Ejecutar la consulta
    const [results] = await pool.query(getProjectsWithPublicationsQuery);

    if (results.length === 0) {
      return res.status(404).json({error: "No se encontraron proyectos ni publicaciones."});
    }

    // Mapear los resultados para incluir un estado predeterminado
    const projectsWithStatus = results.map((row) => ({
      id_proyecto: row.id_proyecto,
      id_empresa: row.id_empresa,
      titulo: row.titulo,
      descripcion: row.descripcion,
      categoria: row.categoria,
      habilidades_requeridas: row.habilidades_requeridas,
      presupuesto: row.presupuesto,
      duracion_estimada: row.duracion_estimada,
      fecha_limite: row.fecha_limite,
      ubicacion: row.ubicacion,
      tipo_contratacion: row.tipo_contratacion,
      metodologia_trabajo: row.metodologia_trabajo,
      estado_publicacion: row.estado_publicacion || "sin publicar", // Valor predeterminado si no hay publicación
      fecha_creacion: row.fecha_creacion || null,
      fecha_publicacion: row.fecha_publicacion || null,
      id_publicacion: row.id_publicacion || null,
    }));

    res.json(projectsWithStatus);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    res.status(500).json({error: "Error al obtener los datos"});
  }
});


module.exports = router;