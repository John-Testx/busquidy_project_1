const {pool} = require("../db");

// Función para obtener usuario por id
async function getUserById(id_usuario) {
  try {
    const [rows] = await pool.query("SELECT * FROM usuario WHERE id_usuario = ?", [id_usuario]);
    return rows;
  } catch (error) {
    console.error(`Error al obtener usuario para id_usuario=${id_usuario}:`, error);
    throw new Error("Error al consultar la tabla usuario");
  }
}

module.exports = {
    getUserById,
}