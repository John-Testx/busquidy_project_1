const express = require("express");
const PaymentService = require("./paymentService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {verifyToken, validatePaymentData, validateUser, upload} = require("./middlewares/auth");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const router = express.Router();
const fs = require("fs");
const {procesarCV} = require("./services/cvService");
const {pool,
  insertarUsuario,
  getUserById,
  getEmpresaByUserId,
  getFreelancerByUserId,
  buscarEmpresaByUserId,
  buscarFreelancerByUserId,
  getRepresentanteByUserId,
  checkDuplicateProject,
  guardarPerfilEnDB,
} = require("./db");

const sendError = (res, status, message) => res.status(status).json({message});
const JWT_SECRET = process.env.JWT_SECRET;

// Registro de usuarios
router.post("/register", async (req, res) => {
  const {correo, contraseña, tipo_usuario} = req.body;

  try {
    // Verificar si el correo ya existe
    const [result] = await pool.query("SELECT * FROM usuario WHERE correo = ?", [correo]);
    if (result.length > 0) {
      return res.status(400).json({error: "Correo ya registrado"});
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    console.log("Contraseña hasheada:", hashedPassword);


    // Insertar usuario usando la función creada
    console.log("Correo:", correo, "Tipo de usuario:", tipo_usuario);
    const id_usuario = await insertarUsuario(correo, hashedPassword, tipo_usuario);
    console.log("ID Usuario insertado:", id_usuario);

    // Crear perfil dependiendo del tipo de usuario
    if (tipo_usuario === "empresa") {
      await pool.query("INSERT INTO empresa (id_usuario) VALUES (?)", [id_usuario]);
      res.status(201).json({message: "Usuario empresa registrado exitosamente"});
    } else if (tipo_usuario === "freelancer") {
      await pool.query("INSERT INTO freelancer (id_usuario) VALUES (?)", [id_usuario]);
      res.status(201).json({message: "Usuario freelancer registrado exitosamente"});
    } else {
      res.status(400).json({error: "Tipo de usuario no válido"});
    }
  } catch (error) {
    console.error("Error en /register:", error.message);
    res.status(500).json({error: "Error en el servidor"});
  }
});

// Inicio de sesión
router.post("/login", async (req, res) => {
  const {correo, contraseña} = req.body;
  console.log("Correo recibido:", correo);

  try {
    // Verificar si el correo existe
    const [result] = await pool.query("SELECT * FROM usuario WHERE correo = ?", [correo]);
    if (result.length === 0) {
      return res.status(404).json({error: "Usuario no encontrado"});
    }

    const user = result[0];
    console.log("Hash almacenado:", user.contraseña);

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
    console.log("¿Contraseña válida?", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({error: "Contraseña incorrecta"});
    }

    // Generar token JWT
    const token = jwt.sign({id_usuario: user.id_usuario, tipo_usuario: user.tipo_usuario}, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({message: "Inicio de sesión exitoso", token, tipo_usuario: user.tipo_usuario});
  } catch (error) {
    console.error("Error en /login:", error.message);
    res.status(500).json({error: "Error en el servidor"});
  }
});

// Ruta para traer los usuarios
router.get("/get/usuarios", async (req, res) => {
  try {
    const [usuarios] = await pool.query("SELECT * FROM usuario");

    if (usuarios.length === 0) {
      return res.status(404).json({error: "No se encontraron usuarios"});
    }

    const usuariosConDatos = await Promise.all(
        usuarios.map(async (usuario) => {
          const empresa = usuario.tipo_usuario === "empresa" ?
                    await buscarEmpresaByUserId(usuario.id_usuario) :
                    null;

          const freelancer = usuario.tipo_usuario === "freelancer" ?
                    await buscarFreelancerByUserId(usuario.id_usuario) :
                    null;

          // Procesar datos de rol y premium
          const idRol = usuario.tipo_usuario === "empresa" ?
                    (empresa ? empresa.id_empresa : null) :
                    (freelancer ? freelancer.id_freelancer : null);

          const premium = usuario.tipo_usuario === "empresa" ?
                    (empresa && empresa.premium === 1 ? "Sí" : "No") :
                    (freelancer && freelancer.premium === 1 ? "Sí" : "No");


          return {
            ...usuario,
            idRol,
            premium,
            empresa,
            freelancer,
          };
        }),
    );

    res.json(usuariosConDatos);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({error: "Error interno del servidor"});
  }
});

// Ruta para eliminar usuario
router.delete("/delete/:id_usuario", async (req, res) => {
  const id_usuario = req.params.id_usuario;

  // Validar que el id_usuario sea válido
  if (!id_usuario || isNaN(id_usuario)) {
    return res.status(400).json({error: "ID de usuario inválido"});
  }

  try {
    // Verificar usuario
    const usuario = await getUserById(id_usuario);
    if (usuario.length === 0) {
      return res.status(404).json({error: "No se encontró el usuario"});
    }

    const deleteUsuario = "DELETE FROM usuario WHERE id_usuario = ?";
    await pool.query(deleteUsuario, [id_usuario]);

    res.status(200).json({message: "Usuario eliminado exitosamente"});
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({error: "Error al eliminar el usuario"});
  }
});


module.exports = router;