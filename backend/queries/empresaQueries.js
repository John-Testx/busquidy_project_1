const {pool} = require("../db");

// 🔹 Get empresa ID by user ID
async function getEmpresaByUserId(id_usuario) {
  try {
    const [rows] = await pool.query("SELECT * FROM empresa WHERE id_usuario = ?", [id_usuario]);
    return rows;
  } catch (error) {
    console.error(`Error al obtener empresa para id_usuario=${id_usuario}:`, error);
    throw new Error("Error al consultar la tabla empresa");
  }
}

// Función para obtener representante por id empresa
async function getRepresentanteByUserId(id_empresa) {
  const [rows] = await pool.query("SELECT * FROM representante_empresa WHERE id_empresa = ?", [id_empresa]);
  return rows;
}

async function getEmpresaProfileByUserId(idUsuario) {
  const [rows] = await pool.query(
    `SELECT nombre_empresa, identificacion_fiscal, direccion, telefono_contacto, 
            correo_empresa, pagina_web, descripcion, sector_industrial 
     FROM empresa 
     WHERE id_usuario = ?`,
    [idUsuario]
  );
  return rows;
}

// 🔹 Update empresa details
async function updateEmpresa(perfilEmpresa, idUsuario) {
  const query = `
    UPDATE empresa SET 
      nombre_empresa = ?, 
      identificacion_fiscal = ?, 
      direccion = ?, 
      telefono_contacto = ?, 
      correo_empresa = ?, 
      pagina_web = ?, 
      descripcion = ?, 
      sector_industrial = ? 
    WHERE id_usuario = ?`;
  const params = [
    perfilEmpresa.nombre_empresa,
    perfilEmpresa.identificacion_fiscal,
    perfilEmpresa.direccion,
    perfilEmpresa.telefono_contacto,
    perfilEmpresa.correo_empresa,
    perfilEmpresa.pagina_web,
    perfilEmpresa.descripcion,
    perfilEmpresa.sector_industrial,
    idUsuario,
  ];
  return pool.query(query, params);
}

// 🔹 Update representante info
async function updateRepresentante(perfilRepresentante, idEmpresa) {
  const query = `
    UPDATE representante_empresa SET 
      nombre_completo = ?, 
      cargo = ?, 
      correo_representante = ?, 
      telefono_representante = ? 
    WHERE id_empresa = ?`;
  const params = [
    perfilRepresentante.nombre_completo,
    perfilRepresentante.cargo,
    perfilRepresentante.correo_representante,
    perfilRepresentante.telefono_representante,
    idEmpresa,
  ];
  return pool.query(query, params);
}

// 🔹 Update usuario info
async function updateUsuario(perfilUsuario, idUsuario) {
  const query = `UPDATE usuario SET correo = ? WHERE id_usuario = ?`;
  const params = [perfilUsuario.correo, idUsuario];
  return pool.query(query, params);
}

module.exports = {
  getEmpresaByUserId,
  updateEmpresa,
  updateRepresentante,
  updateUsuario,
  getEmpresaProfileByUserId,
  getRepresentanteByUserId,
};
