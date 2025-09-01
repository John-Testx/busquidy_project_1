const express = require("express");
const PaymentService = require("./paymentService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {verifyToken, validatePaymentData, validateUser, upload} = require("./middlewares/auth");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const router = express.Router();
const fs = require("fs");
const {procesarCV} = require("./cvService");
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

const empresaRoutes = require("./empresaRoutes");
const userRoutes = require("./userRoutes");
const projectRoutes = require("./projectRoutes");
const paymentRoutes = require("./paymentRoutes");
const freelancerRoutes = require("./freelancerRoutes");

router.use("/empresa", empresaRoutes);
router.use("/freelancer", freelancerRoutes);
router.use("/users", userRoutes );
router.use("/projects", projectRoutes);
router.use("/payments", paymentRoutes);

module.exports = router;