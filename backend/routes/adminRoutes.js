const express = require("express");
const router = express.Router();

// Importar controladores
const {
  getAdminPermissions
} = require("../controllers/admin/permissionController");

const {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole
} = require("../controllers/admin/roleController");

const {
  getAdminRoles,
  updateAdminRoles
} = require("../controllers/admin/adminRoleController");

// ============= RUTAS DE PERMISOS =============
router.get("/permissions/:userId", getAdminPermissions);

// ============= RUTAS DE ROLES =============
router.get("/role/get", getAllRoles);
router.post("/role/create", createRole);
router.put("/role/:id", updateRole);
router.delete("/role/:id", deleteRole);

// ============= RUTAS DE ASIGNACIÓN DE ROLES A ADMINS =============
router.get("/roles/:adminId", getAdminRoles);
router.patch("/:id/roles", updateAdminRoles);

module.exports = router;