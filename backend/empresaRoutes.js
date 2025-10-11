const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {verifyToken, validatePaymentData, validateUser, upload} = require("./middlewares/auth");
const sendError = (res, status, message) => res.status(status).json({message});
const router = express.Router();
const {pool,
  getUserById,
  getEmpresaByUserId,
  getRepresentanteByUserId,
} = require("./db");

// Ruta para ver si existe perfil empresa
router.get("/get/:id_usuario", async (req, res) => {
  const {id_usuario} = req.params;

  try {
    // Verificar usuario
    const userCheckResults = await getUserById(id_usuario);
    if (userCheckResults.length === 0) {
      return res.status(404).json({error: "Usuario no encontrado"});
    }
    console.log("Usuario encontrado");

    const {tipo_usuario} = userCheckResults[0];
    if (tipo_usuario !== "empresa") {
      return res.status(403).json({error: "Acceso no autorizado"});
    }

    // Obtener datos de la empresa
    const [empresaResults] = await pool.query(
        `SELECT nombre_empresa, identificacion_fiscal, direccion, telefono_contacto, 
                    correo_empresa, pagina_web, descripcion, sector_industrial 
             FROM empresa 
             WHERE id_usuario = ?`,
        [id_usuario],
    );

    if (empresaResults.length === 0) {
      return res.status(404).json({error: "Datos no encontrados"});
    }

    const perfilEmpresa = empresaResults[0];
    const isPerfilIncompleto = Object.values(perfilEmpresa).some((value) => !value);

    res.json({isPerfilIncompleto});
  } catch (error) {
    console.error("Error al verificar el perfil de la empresa:", error);
    res.status(500).json({error: "Error al verificar el perfil de la empresa"});
  }
});

// Ruta para crear el perfil empresa
router.post("/create-perfil-empresa", verifyToken, async (req, res) => {
  const {empresaData, representanteData, id_usuario} = req.body;

  console.log("empresaData:", empresaData);
  console.log("representanteData:", representanteData);
  console.log("ID Usuario:", id_usuario);

  if (!id_usuario) {
    console.log("Error: id_usuario es undefined o null");
    return res.status(400).json({error: "ID de usuario inválido"});
  }

  try {
    // Verificar usuario
    const userCheckResults = await getUserById(id_usuario);
    if (userCheckResults.length === 0) {
      return res.status(404).json({error: "Usuario no encontrado"});
    }
    console.log("Usuario encontrado");

    // Obtener `id_empresa`
    const empresaResults = await getEmpresaByUserId(id_usuario);
    if (empresaResults.length === 0) {
      return res.status(404).json({error: "Empresa no encontrada"});
    }

    const id_empresa = empresaResults[0].id_empresa;
    console.log("ID de Empresa obtenido:", id_empresa);

    // Actualizar descripción en la tabla empresa
    const updateEmpresaQuery = `
        UPDATE empresa
        SET nombre_empresa = ?, 
            identificacion_fiscal = ?, 
            direccion = ?, 
            telefono_contacto = ?, 
            correo_empresa = ?, 
            pagina_web = ?, 
            descripcion = ?, 
            sector_industrial = ?
        WHERE id_empresa = ?;
      `;
    await pool.query(updateEmpresaQuery, [
      empresaData.nombre_empresa, empresaData.identificacion_fiscal,
      empresaData.direccion, empresaData.telefono_contacto, empresaData.correo_empresa,
      empresaData.pagina_web, empresaData.descripcion, empresaData.sector_industrial, id_empresa,
    ]);

    const insertRepresentanteQuery = `
        INSERT INTO representante_empresa (id_empresa, nombre_completo, cargo, correo_representante, telefono_representante)
        VALUES (?, ?, ?, ?, ?)
      `;
    await pool.query(insertRepresentanteQuery, [
      id_empresa, representanteData.nombre_completo, representanteData.cargo,
      representanteData.correo_representante, representanteData.telefono_representante,
    ]);

    console.log("Perfil empresa creado exitosamente");
    res.status(201).json({message: "Perfil de empresa creado exitosamente"});
  } catch (err) {
    console.error("Error al crear el perfil de la empresa:", err);
    res.status(500).json({error: "Error al crear el perfil de empresa"});
  }
});

// Ruta para traer el perfil de la empresa y el representante
router.get("/get/perfil-empresa/:id_usuario", async (req, res) => {
  const {id_usuario} = req.params;
  console.log("id_usuario:", id_usuario);

  if (!id_usuario) {
    console.log("Error: id_usuario es undefined o null");
    return res.status(400).json({error: "ID de usuario inválido"});
  }

  try {
    // Verificar usuario
    const perfilUsuarioResults = await getUserById(id_usuario);
    if (perfilUsuarioResults.length === 0) {
      return res.status(404).json({error: "No se encontró el perfil usuario"});
    }

    // Obtener el perfil de la empresa
    const perfilEmpresaResults = await getEmpresaByUserId(id_usuario);
    if (perfilEmpresaResults.length === 0) {
      return res.status(404).json({error: "No se encontró el perfil de la empresa"});
    }

    const id_empresa = perfilEmpresaResults[0].id_empresa;
    console.log("id_empresa:", id_empresa);

    // Obtener el perfil del representante
    const perfilRepresentanteResults = await getRepresentanteByUserId(id_empresa);
    if (perfilRepresentanteResults.length === 0) {
      return res.status(404).json({error: "No se encontró el perfil representante"});
    }
    console.log("pefil:", perfilUsuarioResults[0], perfilEmpresaResults[0], perfilRepresentanteResults[0]);

    // Enviar ambos perfiles en la respuesta
    res.json({
      perfilUsuario: perfilUsuarioResults[0],
      perfilEmpresa: perfilEmpresaResults[0],
      perfilRepresentante: perfilRepresentanteResults[0],
    });
  } catch (error) {
    console.log("Error al obtener los perfiles:", error);
    res.status(500).json({error: "Error al obtener los perfiles"});
  }
});

// Ruta para agregar reseña
router.post("/reviews", async (req, res) => {
  const {id_usuario, calificacion, comentario, id_identificador} = req.body;

  if (!id_usuario || !calificacion || !id_identificador) {
    return sendError(res, 400, "Faltan campos requeridos.");
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Determinar el tipo de usuario que está realizando la reseña
    const [usuarioResena] = await connection.query(
        "SELECT tipo_usuario FROM usuario WHERE id_usuario = ?",
        [id_usuario],
    );

    if (!usuarioResena || usuarioResena.length === 0) {
      return sendError(res, 404, "El usuario que reseña no existe.");
    }

    const tipoUsuario = usuarioResena[0].tipo_usuario;

    let tipo_calificado; let id_calificado;

    if (tipoUsuario === "freelancer") {
      // El que reseña es freelancer => El calificado debe ser una empresa

      // Obtener la empresa asociada al proyecto
      const [proyecto] = await connection.query(
          "SELECT p.id_empresa FROM proyecto p " +
                "INNER JOIN publicacion_proyecto pp ON p.id_proyecto = pp.id_proyecto " +
                "WHERE pp.id_publicacion = ?",
          [id_identificador],
      );

      if (!proyecto || proyecto.length === 0) {
        return sendError(res, 404, "No se encontró una empresa asociada a la publicación.");
      }
      console.log('proyecto:', proyecto);

      id_calificado = proyecto[0].id_empresa;
      console.log('id_calificado:',id_calificado);

      // Obtener empresa
      const empresaResults = await connection.query(`
        SELECT id_usuario FROM empresa WHERE id_empresa = ?`, id_calificado);
      console.log('empresaResults:', empresaResults);
      if (empresaResults.length === 0) {
      }
      const id_usuario = empresaResults[0][0].id_usuario;
      console.log('id_usuario:', id_usuario);
      // Obtener usuario
      const usuarioResults = await getUserById(id_usuario);
      if (usuarioResults.length === 0) {
        return sendError(res, 404, "No se encontró el usuario.");
      }

      tipo_calificado = usuarioResults[0].tipo_usuario;
    } else if (tipoUsuario === "empresa") {
      // El que reseña es una empresa => El calificado debe ser un freelancer

      const [freelancer] = await connection.query(
          "SELECT id_freelancer FROM freelancer WHERE id_freelancer = ?",
          [id_identificador],
      );

      if (!freelancer || freelancer.length === 0) {
        return res.status(404).json({message: "No puedes reseñar a un usuario del mismo tipo."});
      }

      // Obtener usuario
      const usuarioResults = await getFreelancerByUserId(id_identificador);
      if (usuarioResults.length === 0) {
        return res.status(404).json({error: "No puedes reseñar a un usuario del mismo tipo."});
      }

      tipo_calificado = usuarioResults[0].tipo_usuario;
    } else {
      return sendError(res, 400, "El tipo de usuario que reseña no es válido.");
    }

    // Validar que el tipo calificado no sea el mismo que el tipo del usuario que reseña
    if (tipoUsuario === tipo_calificado) {
      return sendError(res, 400, "No puedes reseñar a un usuario del mismo tipo.");
    }

    // Verificar si ya existe una reseña del usuario a este reseñado
    const [existingReview] = await connection.query(
        "SELECT id_resena FROM resena WHERE id_usuario = ? AND id_calificado = ?",
        [id_usuario, id_calificado],
    );

    if (existingReview && existingReview.length > 0) {
      return sendError(res, 409, "Ya has realizado una reseña a este usuario.");
    }

    // Insertar la reseña en la tabla `resena`
    await connection.query(
        "INSERT INTO resena (id_usuario, tipo_calificado, id_calificado, calificacion, comentario, fecha_resena) VALUES (?, ?, ?, ?, ?, CURDATE())",
        [id_usuario, tipo_calificado, id_calificado, calificacion, comentario],
    );

    await connection.commit();

    res.status(201).json({message: "Reseña agregada exitosamente."});
  } catch (err) {
    // Detectar el tipo de error y responder usando sendError
    if (err.response) {
      // El servidor respondió con un error conocido
      return sendError(res, err.response.status, err.response.data.message || "Ocurrió un error desconocido.");
    } else if (err.request) {
      // No se recibió respuesta del servidor (problema de red)
      return sendError(res, 503, "No se pudo conectar con el servidor. Inténtalo más tarde.");
    } else {
      // Error inesperado o desconocido
      console.error("Error inesperado:", err);
      return sendError(res, 500, "Ocurrió un error inesperado.");
    }
  } finally {
    if (connection) connection.release(); // Liberar la conexión en cualquier caso
  }
});

// Update Empresa profile
router.put("/update/:id", async (req, res) => {
  const { id } = req.params; // id_usuario
  const { perfilEmpresa, perfilRepresentante, perfilUsuario } = req.body;

  try {
    // Update empresa info
    let empresaId;
    if (perfilEmpresa) {
      const [empresaRows] = await pool.query(
        `SELECT id_empresa FROM empresa WHERE id_usuario = ?`,
        [id]
      );
      if (!empresaRows.length) return res.status(404).json({ error: "Empresa no encontrada" });
      empresaId = empresaRows[0].id_empresa;

      await pool.query(
        `UPDATE empresa SET 
          nombre_empresa = ?, 
          identificacion_fiscal = ?, 
          direccion = ?, 
          telefono_contacto = ?, 
          correo_empresa = ?, 
          pagina_web = ?, 
          descripcion = ?, 
          sector_industrial = ? 
         WHERE id_usuario = ?`,
        [
          perfilEmpresa.nombre_empresa,
          perfilEmpresa.identificacion_fiscal,
          perfilEmpresa.direccion,
          perfilEmpresa.telefono_contacto,
          perfilEmpresa.correo_empresa,
          perfilEmpresa.pagina_web,
          perfilEmpresa.descripcion,
          perfilEmpresa.sector_industrial,
          id,
        ]
      );
    }

    // Update representante info
    if (perfilRepresentante) {
      if (!empresaId) {
        const [empresaRows] = await pool.query(
          `SELECT id_empresa FROM empresa WHERE id_usuario = ?`,
          [id]
        );
        if (!empresaRows.length) return res.status(404).json({ error: "Empresa no encontrada" });
        empresaId = empresaRows[0].id_empresa;
      }

      await pool.query(
        `UPDATE representante_empresa SET 
          nombre_completo = ?, 
          cargo = ?, 
          correo_representante = ?, 
          telefono_representante = ? 
         WHERE id_empresa = ?`,
        [
          perfilRepresentante.nombre_completo,
          perfilRepresentante.cargo,
          perfilRepresentante.correo_representante,
          perfilRepresentante.telefono_representante,
          empresaId,
        ]
      );
    }

    // Update user access info
    if (perfilUsuario) {
      await pool.query(
        `UPDATE usuario SET correo = ? WHERE id_usuario = ?`,
        [perfilUsuario.correo, id]
      );
      // Password updates should be handled separately with hashing
    }

    res.json({ message: "Perfil de empresa actualizado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando perfil" });
  }
});




module.exports = router;