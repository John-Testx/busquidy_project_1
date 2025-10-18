const empresaQueries = require("../../queries/empresa/empresaQueries");
const representanteQueries = require("../../queries/empresa/representanteQueries");
const userQueries = require("../../queries/user/userQueries");
const pool = require("../../db");

/**
 * Controlador de perfil de empresa
 */

// Obtener perfil completo de empresa
const getPerfilEmpresa = async (req, res) => {
  const { id_usuario } = req.params;

  console.log("id_usuario:", id_usuario);

  if (!id_usuario) {
    console.log("Error: id_usuario es undefined o null");
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  try {
    // Verificar usuario
    const perfilUsuarioResults = await userQueries.findUserById(id_usuario);
    if (perfilUsuarioResults.length === 0) {
      return res.status(404).json({ error: "No se encontró el perfil usuario" });
    }

    // Obtener perfil de empresa
    const perfilEmpresaResults = await empresaQueries.findEmpresaByUserId(id_usuario);
    if (perfilEmpresaResults.length === 0) {
      return res.status(404).json({ error: "No se encontró el perfil de la empresa" });
    }

    const id_empresa = perfilEmpresaResults[0].id_empresa;
    console.log("id_empresa:", id_empresa);

    // Obtener representante
    const perfilRepresentanteResults = await representanteQueries.findRepresentanteByEmpresaId(id_empresa);
    if (perfilRepresentanteResults.length === 0) {
      return res.status(404).json({ error: "No se encontró el perfil representante" });
    }

    console.log("perfil:", perfilUsuarioResults[0], perfilEmpresaResults[0], perfilRepresentanteResults[0]);

    // Enviar respuesta consolidada
    res.json({
      perfilUsuario: perfilUsuarioResults[0],
      perfilEmpresa: perfilEmpresaResults[0],
      perfilRepresentante: perfilRepresentanteResults[0]
    });
  } catch (error) {
    console.error("Error al obtener los perfiles:", error);
    res.status(500).json({ error: "Error al obtener los perfiles" });
  }
};

// Verificar estado del perfil de empresa
const getEmpresaProfileStatus = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    // Verificar usuario
    const userCheckResults = await userQueries.findUserById(id_usuario);
    if (userCheckResults.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { tipo_usuario } = userCheckResults[0];
    if (tipo_usuario !== "empresa") {
      return res.status(403).json({ error: "Acceso no autorizado" });
    }

    // Obtener datos de empresa
    const empresaResults = await empresaQueries.findEmpresaProfileByUserId(id_usuario);
    if (empresaResults.length === 0) {
      return res.status(404).json({ error: "Datos no encontrados" });
    }

    const perfilEmpresa = empresaResults[0];
    const isPerfilIncompleto = Object.values(perfilEmpresa).some((value) => !value);

    return res.json({ isPerfilIncompleto });
  } catch (error) {
    console.error("Error al verificar el perfil de la empresa:", error);
    return res.status(500).json({ error: "Error al verificar el perfil de la empresa" });
  }
};

// Crear perfil completo de empresa (con transacción)
const createEmpresaProfile = async (req, res) => {
  const { empresaData, representanteData, id_usuario } = req.body;

  console.log("empresaData:", empresaData);
  console.log("representanteData:", representanteData);
  console.log("ID Usuario:", id_usuario);

  if (!id_usuario) {
    console.log("Error: id_usuario es undefined o null");
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Verificar usuario
    const userCheckResults = await userQueries.findUserById(id_usuario);
    if (userCheckResults.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    console.log("Usuario encontrado");

    // Obtener id_empresa
    const empresaResults = await empresaQueries.findEmpresaByUserId(id_usuario);
    if (empresaResults.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Empresa no encontrada" });
    }

    const id_empresa = empresaResults[0].id_empresa;
    console.log("ID de Empresa obtenido:", id_empresa);

    // Actualizar empresa
    await empresaQueries.updateEmpresaByEmpresaId(empresaData, id_empresa, connection);

    // Insertar representante
    await representanteQueries.insertRepresentante(id_empresa, representanteData, connection);

    await connection.commit();

    console.log("Perfil empresa creado exitosamente");
    res.status(201).json({ message: "Perfil de empresa creado exitosamente" });
  } catch (err) {
    console.error("Error al crear el perfil de la empresa:", err);
    if (connection) await connection.rollback();
    res.status(500).json({ error: "Error al crear el perfil de empresa" });
  } finally {
    if (connection) connection.release();
  }
};

// Actualizar perfil completo de empresa
const updateEmpresaProfile = async (req, res) => {
  const { id } = req.params; // id_usuario
  const { perfilEmpresa, perfilRepresentante, perfilUsuario } = req.body;
  
  console.log('Request Headers:', req.headers);

  try {
    let empresaId;

    // Actualizar datos de empresa
    if (perfilEmpresa) {
      const empresaRows = await empresaQueries.findEmpresaByUserId(id);
      if (!empresaRows.length) {
        return res.status(404).json({ error: "Empresa no encontrada" });
      }

      empresaId = empresaRows[0].id_empresa;
      await empresaQueries.updateEmpresaByUserId(perfilEmpresa, id);
    }

    // Actualizar representante
    if (perfilRepresentante) {
      if (!empresaId) {
        const empresaRows = await empresaQueries.findEmpresaByUserId(id);
        if (!empresaRows.length) {
          return res.status(404).json({ error: "Empresa no encontrada" });
        }
        empresaId = empresaRows[0].id_empresa;
      }

      await representanteQueries.updateRepresentante(perfilRepresentante, empresaId);
    }

    // Actualizar usuario
    if (perfilUsuario) {
      await userQueries.updateUserEmail(id, perfilUsuario.correo);
    }

    console.log("Empresa actualizada: ")

    return res.json({ message: "Perfil de empresa actualizado correctamente" });
  } catch (err) {
    console.error("Error actualizando perfil de empresa:", err);
    return res.status(500).json({ error: "Error actualizando perfil" });
  }
};

module.exports = {
  getPerfilEmpresa,
  getEmpresaProfileStatus,
  createEmpresaProfile,
  updateEmpresaProfile
};