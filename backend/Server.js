require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const routes = require("./routes");
const { testDbConnection, ensureUploadDirectories } = require("./dbTest");

const app = express();
const port = process.env.PORT || 3001;

// ==================== CONFIGURACIÓN DE CORS ====================
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://localhost:3000",
      process.env.DB_TEST_HOST,
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// ==================== MIDDLEWARES ====================
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ==================== RUTAS ====================
app.use("/api", routes);

// ==================== VERIFICACIONES INICIALES ====================
(async () => {
  await testDbConnection();
  ensureUploadDirectories();
})();

// ==================== MANEJO DE ERRORES ====================
app.use((err, req, res, next) => {
  console.error("Error Stack:", err.stack);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ==================== CONFIGURACIÓN DE SOCKET.IO ====================
const httpServer = http.createServer(app);
const io = socketIo(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://localhost:3000",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  },
});

let connectedUsers = 0;

io.on("connection", (socket) => {
  console.log("✅ Nuevo cliente conectado:", socket.id);
  connectedUsers++;
  io.emit("usersCount", connectedUsers);

  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado:", socket.id);
    connectedUsers--;
    io.emit("usersCount", connectedUsers);
  });
});

// ==================== INICIAR SERVIDOR ====================
httpServer.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Servidor Express y Socket.IO iniciado en el puerto ${port}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;