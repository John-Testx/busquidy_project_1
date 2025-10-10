const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const { verifyToken } = require('../middlewares/auth');

// Verificar si existe perfil empresa
router.get('/get/:id_usuario', empresaController.checkPerfilExists);

// Crear perfil empresa
router.post('/create-perfil-empresa', verifyToken, empresaController.createPerfilEmpresa);

// Obtener perfil empresa completo
router.get('/get/perfil-empresa/:id_usuario', empresaController.getPerfilEmpresa);

// Agregar reseña
router.post('/reviews', empresaController.addReview);

module.exports = router;