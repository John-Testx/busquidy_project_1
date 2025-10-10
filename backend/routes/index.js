const express = require('express');
const router = express.Router();

const empresaRoutes = require('./empresa');
const freelancerRoutes = require('./freelancer');
const userRoutes = require('./user');
const projectRoutes = require('./project');
const paymentRoutes = require('./payment');

// Montar rutas
router.use('/empresa', empresaRoutes);
router.use('/freelancer', freelancerRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;