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

// Get all roles
router.get("/role/get", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM rol");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching roles" });
  }
});

// Create a new role
router.post("/role/create", async (req, res) => {
  const { nombre_rol, descripcion } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO rol (nombre_rol, descripcion) VALUES (?, ?)",
      [nombre_rol, descripcion]
    );
    res.json({ id_rol: result.insertId, nombre_rol, descripcion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating role" });
  }
});

// Update an existing role
router.put("/role/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre_rol, descripcion } = req.body;
  try {
    await pool.query(
      "UPDATE rol SET nombre_rol = ?, descripcion = ? WHERE id_rol = ?",
      [nombre_rol, descripcion, id]
    );
    res.json({ id_rol: id, nombre_rol, descripcion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating role" });
  }
});

// Delete a role
router.delete("/role/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM rol WHERE id_rol = ?", [id]);
    res.json({ message: "Role deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting role" });
  }
});

router.get("/roles/:adminId", async (req, res) => {
  const { adminId } = req.params;
  try {
    // Get all roles
    const [allRoles] = await pool.execute("SELECT * FROM rol");

    // Get roles assigned to this admin
    const [assignedRoles] = await pool.execute(
      "SELECT id_rol FROM admin_rol WHERE id_administrador = ?",
      [adminId]
    );

    const assignedRoleIds = assignedRoles.map(r => r.id_rol);

    // Mark which roles are selected
    const rolesWithSelected = allRoles.map(r => ({
      ...r,
      selected: assignedRoleIds.includes(r.id_rol),
    }));

    res.json(rolesWithSelected);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching admin roles" });
  }
});

// Update admin roles
router.patch("/:id/roles", async (req, res) => {
  const { id } = req.params;
  const { roles } = req.body; // array of role ids
  try {
    await pool.query("DELETE FROM admin_rol WHERE id_administrador=?", [id]);
    if (roles && roles.length) {
      const values = roles.map(roleId => [id, roleId]);
      await pool.query("INSERT INTO admin_rol (id_administrador, id_rol) VALUES ?", [values]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;