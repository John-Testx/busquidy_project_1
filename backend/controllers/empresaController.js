const {
  getEmpresaByUserId,
  updateEmpresa,
  updateRepresentante,
  updateUsuario,
  getEmpresaProfileByUserId,
  getRepresentanteByUserId
} = require("../queries/empresaQueries");

const { getUserById } = require("../queries/userQueries"); 

/**
 * Update empresa profile, representative, and user info.
 */

async function updateEmpresaProfile(req, res) {
  const { id } = req.params; // id_usuario
  const { perfilEmpresa, perfilRepresentante, perfilUsuario } = req.body;

  try {
    let empresaId;

    // 🔹 Empresa section
    if (perfilEmpresa) {
      const empresaRows = await getEmpresaByUserId(id);
      if (!empresaRows.length) {
        return res.status(404).json({ error: "Empresa no encontrada" });
      }

      empresaId = empresaRows[0].id_empresa;
      await updateEmpresa(perfilEmpresa, id);
    }

    // 🔹 Representante section
    if (perfilRepresentante) {
      if (!empresaId) {
        const empresaRows = await getEmpresaByUserId(id);
        if (!empresaRows.length) {
          return res.status(404).json({ error: "Empresa no encontrada" });
        }
        empresaId = empresaRows[0].id_empresa;
      }

      await updateRepresentante(perfilRepresentante, empresaId);
    }

    // 🔹 Usuario section
    if (perfilUsuario) {
      await updateUsuario(perfilUsuario, id);
      // Password updates should be handled separately (with hashing)
    }

    return res.json({ message: "Perfil de empresa actualizado correctamente" });
  } catch (err) {
    console.error("Error actualizando perfil de empresa:", err);
    return res.status(500).json({ error: "Error actualizando perfil" });
  }
}

/**
 * Check if a company profile exists and if it’s incomplete.
 */
async function getEmpresaProfileStatus(req, res) {
  const { id_usuario } = req.params;

  try {
    // 🔹 Verify user exists
    const userCheckResults = await getUserById(id_usuario);
    if (userCheckResults.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { tipo_usuario } = userCheckResults[0];
    if (tipo_usuario !== "empresa") {
      return res.status(403).json({ error: "Acceso no autorizado" });
    }

    // 🔹 Get empresa data
    const empresaResults = await getEmpresaProfileByUserId(id_usuario);
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
}

async function getPerfilEmpresa (req, res) {
  const { id_usuario } = req.params;
  console.log("id_usuario:", id_usuario);

  if (!id_usuario) {
    console.log("Error: id_usuario es undefined o null");
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  try {
    // Verificar usuario
    const perfilUsuarioResults = await getUserById(id_usuario);
    if (perfilUsuarioResults.length === 0) {
      return res.status(404).json({ error: "No se encontró el perfil usuario" });
    }

    // Obtener el perfil de la empresa
    const perfilEmpresaResults = await getEmpresaByUserId(id_usuario);
    if (perfilEmpresaResults.length === 0) {
      return res.status(404).json({ error: "No se encontró el perfil de la empresa" });
    }

    const id_empresa = perfilEmpresaResults[0].id_empresa;
    console.log("id_empresa:", id_empresa);

    // Obtener el perfil del representante
    const perfilRepresentanteResults = await getRepresentanteByUserId(id_empresa);
    if (perfilRepresentanteResults.length === 0) {
      return res.status(404).json({ error: "No se encontró el perfil representante" });
    }

    console.log("perfil:", perfilUsuarioResults[0], perfilEmpresaResults[0], perfilRepresentanteResults[0]);

    // Enviar ambos perfiles en la respuesta
    res.json({
      perfilUsuario: perfilUsuarioResults[0],
      perfilEmpresa: perfilEmpresaResults[0],
      perfilRepresentante: perfilRepresentanteResults[0],
    });
  } catch (error) {
    console.error("Error al obtener los perfiles:", error);
    res.status(500).json({ error: "Error al obtener los perfiles" });
  }
};



module.exports = { 
    updateEmpresaProfile,
    getEmpresaProfileStatus,
    getPerfilEmpresa
 };
