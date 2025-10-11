const express = require("express");
const router = express.Router();
const {pool,
  getUserById,
  getEmpresaByUserId,
  getRepresentanteByUserId,
} = require("./db");


router.get("/permissions/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [permissions] = await pool.query(`
      SELECT p.nombre_permiso
      FROM administrador a
      JOIN admin_rol ar ON a.id_administrador = ar.id_administrador
      JOIN rol_permiso rp ON ar.id_rol = rp.id_rol
      JOIN permiso p ON rp.id_permiso = p.id_permiso
      WHERE a.id_usuario = ?;
    `, [userId]);

    res.json({ permissions: permissions.map(p => p.nombre_permiso) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching permissions" });
  }
});


module.exports = router;