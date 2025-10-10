const express = require('express');
const router = express.Router();
const freelancerController = require('../controllers/freelancerController');
const { verifyToken, upload } = require('../middlewares/auth');

// Verificar si existe perfil freelancer
router.get('/get/:id_usuario', freelancerController.checkPerfilExists);

// Crear perfil freelancer
router.post('/create-perfil-freelancer', verifyToken, freelancerController.createPerfilFreelancer);

// Obtener perfil freelancer
router.get('/perfil-freelancer/:id_usuario', freelancerController.getPerfilFreelancer);

// Actualizar sección de perfil
router.put('/update-freelancer/:id_usuario/:section', freelancerController.updatePerfilSection);

// Listar freelancers
router.get('/list', freelancerController.listFreelancers);

// Obtener perfil público de freelancer
router.get('/freelancer-perfil/:id', freelancerController.getPublicPerfil);

// Postular a proyecto
router.post('/postulacion/:id_publicacion', freelancerController.postularProyecto);

// Obtener postulaciones del freelancer
router.get('/postulaciones/:id_usuario', freelancerController.getPostulaciones);

// Eliminar postulación
router.delete('/delete-postulacion/:id_postulacion', freelancerController.deletePostulacion);

// Upload CV
router.post('/upload-cv', upload.single('cv'), freelancerController.uploadCV);

// Obtener CV
router.get('/freelancer/:id/cv', freelancerController.getCV);

// Agregar datos a perfil
router.post('/add-freelancer/:id_usuario/:itemType', freelancerController.addPerfilData);

// Eliminar idioma o habilidad
router.delete('/delete-idioma-habilidad/:id_usuario/:seccion/:id', freelancerController.deleteIdiomaHabilidad);

module.exports = router;