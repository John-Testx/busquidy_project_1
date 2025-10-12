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
const { addReview } = require("./controllers/reviewController");
const { updateEmpresaProfile, getEmpresaProfileStatus, getPerfilEmpresa } = require("./controllers/empresaController");

// Ruta para ver si existe perfil empresa ||  GET /api/empresa/get/:id_usuario
router.get("/get/:id_usuario", getEmpresaProfileStatus);

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
router.get("/get/perfil-empresa/:id_usuario", getPerfilEmpresa);

// Ruta para agregar reseña
router.post("/reviews", addReview);

// Update Empresa profile
router.put("/update/:id", updateEmpresaProfile);




module.exports = router;