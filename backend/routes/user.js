const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Registro de usuario
router.post('/register', userController.register);

// Login
router.post('/login', userController.login);

// Obtener usuarios
router.get('/get/usuarios', userController.getUsuarios);

// Eliminar usuario
router.delete('/delete/:id_usuario', userController.deleteUsuario);

module.exports = router;