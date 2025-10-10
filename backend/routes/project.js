const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { verifyToken } = require('../middlewares/auth');

// Obtener todos los proyectos
router.get('/getProjects', projectController.getProjects);

// Crear proyecto
router.post('/create-project', verifyToken, projectController.createProject);

// Actualizar estado del proyecto
router.put('/api/proyecto/estado/:id_proyecto', projectController.updateEstadoProyecto);

// Eliminar proyecto
router.delete('/delete/:id_proyecto', projectController.deleteProject);

// Obtener proyectos por empresa
router.get('/get/:id_usuario', projectController.getProjectsByUser);

// Bajar publicación
router.put('/update-proyecto-state/:id_proyecto', projectController.updateProjectState);

// Obtener publicaciones
router.get('/publicacion', projectController.getPublicaciones);

module.exports = router;
