const projectQueries = require("../../queries/project/projectQueries");
const publicationQueries = require("../../queries/project/publicationQueries");
const { getEmpresaByUserId } = require("../../queries/empresa/empresaQueries.js");

const {getUserById} = require("../../queries/user/userQueries");
const pool = require("../../db");

/**
 * Controlador de gestión de proyectos
 */

// Obtener todos los proyectos con publicaciones
const getAllProjects = async (req, res) => {
  try {
    const proyectos = await projectQueries.findAllProjectsWithPublications();

    if (proyectos.length === 0) {
      return res.status(404).json({ error: "No se encontraron proyectos" });
    }

    res.json(proyectos);
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      mensaje: error.message,
    });
  }
};

// Obtener proyecto por ID
const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await projectQueries.findProjectById(id);

    if (!project) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    res.json(project);
  } catch (error) {
    console.error("Error al obtener proyecto:", error);
    res.status(500).json({ 
      error: "Error interno del servidor", 
      mensaje: error.message 
    });
  }
};

// Actualizar proyecto
const updateProject = async (req, res) => {
  const { id } = req.params;
  const projectData = req.body;

  try {
    const updated = await projectQueries.updateProject(id, projectData);

    if (!updated) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    res.json({ message: "Proyecto actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar proyecto:", error);
    res.status(500).json({ 
      error: "Error interno del servidor", 
      mensaje: error.message 
    });
  }
};

// Crear proyecto
const createProject = async (req, res) => {
  const { projectData, id_usuario } = req.body;
  console.log("Datos recibidos para crear proyecto:", projectData, "ID usuario:", id_usuario);

  if (!id_usuario) {
    console.error("Error: id_usuario es undefined o null");
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Verificar usuario
    const userCheckResults = await getUserById(id_usuario);
    if (userCheckResults.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const tipo_usuario = userCheckResults[0].tipo_usuario;
    if (tipo_usuario !== "empresa") {
      await connection.rollback();
      return res.status(403).json({ error: "Acceso no autorizado" });
    }

    // Obtener `id_empresa`
    const empresaResults = await getEmpresaByUserId(id_usuario);
    if (empresaResults.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Empresa no encontrada" });
    }

    const id_empresa = empresaResults[0].id_empresa;

    // Verificar duplicados
    const projectCheckResults = await projectQueries.checkDuplicateProject(id_empresa, projectData);
    console.log("Resultado de duplicados:", projectCheckResults);
    if (projectCheckResults.length > 0) {
      await connection.rollback();
      return res.status(409).json({ error: "Proyecto duplicado encontrado" });
    }

    // Insertar proyecto
    const id_proyecto = await projectQueries.insertProject(projectData, id_empresa, connection);

    // Crear publicación
    await publicationQueries.insertProjectPublication(id_proyecto, connection);

    await connection.commit();
    console.log("Proyecto y publicación creados con éxito");
    res.status(200).json({
      message: "Proyecto y publicación creados con éxito",
      projectId: id_proyecto,
    });
  } catch (err) {
    console.error("Error al crear el proyecto:", err);
    if (connection) await connection.rollback();
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (connection) await connection.release();
  }
};

// Eliminar proyecto
const deleteProject = async (req, res) => {
  const { id_proyecto } = req.params;
  let connection;

  try {
    connection = await pool.getConnection();

    // Verificar si el proyecto existe
    const exists = await projectQueries.existsProject(id_proyecto, connection);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Proyecto no encontrado",
      });
    }

    // Iniciar transacción
    await connection.beginTransaction();

    try {
      // Eliminar publicación relacionada
      await publicationQueries.deletePublication(id_proyecto, connection);

      // Eliminar el proyecto
      await projectQueries.deleteProject(id_proyecto, connection);

      // Confirmar transacción
      await connection.commit();

      res.status(200).json({
        success: true,
        message: "Proyecto eliminado correctamente",
      });
    } catch (error) {
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
};

// Obtener proyectos por usuario
const getProjectsByUser = async (req, res) => {
  const { id_usuario } = req.params;
  console.log("id_usuario:", id_usuario);

  if (!id_usuario) {
    console.error("Error: id_usuario es undefined o null");
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  try {
    // Verificar usuario
    const userCheckResults = await getUserById(id_usuario);
    if (userCheckResults.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const tipo_usuario = userCheckResults[0].tipo_usuario;
    if (tipo_usuario !== "empresa") {
      return res.status(403).json({ error: "Acceso no autorizado" });
    }

    // Obtener `id_empresa`
    const empresaResults = await getEmpresaByUserId(id_usuario);
    if (empresaResults.length === 0) {
      console.error("Empresa no encontrada para el usuario:", id_usuario);
      return res.status(404).json({ error: "Empresa no encontrada" });
    }

    const id_empresa = empresaResults[0].id_empresa;

    // Obtener proyectos
    const projectResults = await projectQueries.findProjectsByEmpresaId(id_empresa);

    if (projectResults.length === 0) {
      console.log("No se encontraron proyectos");
      return res.status(404).json({ error: "No se encontraron proyectos" });
    }

    // Obtener estados de publicación
    const projectIds = projectResults.map((proyecto) => proyecto.id_proyecto);
    const publicationResults = await publicationQueries.findPublicationStatusByProjectIds(projectIds);

    // Mapear estados a proyectos
    const publicationMap = new Map(
      publicationResults.map((pub) => [pub.id_proyecto, pub.estado_publicacion])
    );
    const projectsWithStatus = projectResults.map((proyecto) => ({
      ...proyecto,
      estado_publicacion: publicationMap.get(proyecto.id_proyecto) || "Desconocido",
    }));

    res.json(projectsWithStatus);
  } catch (error) {
    console.error("Error al obtener proyectos:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  updateProject,
  createProject,
  deleteProject,
  getProjectsByUser
};