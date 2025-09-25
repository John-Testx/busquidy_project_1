const express = require("express");
const router = express.Router();
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