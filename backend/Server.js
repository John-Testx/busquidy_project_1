require("dotenv").config(); // Carga variables de entorno

const express = require("express"); // Framework Express
const cors = require("cors"); // Permitir solicitudes de diferentes orígenes
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser"); // Procesar solicitudes HTTP
const routes = require("./routes");
const tests = require('./tests'); 
const app = express();
const port = process.env.PORT || 3001;

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://localhost:3000',
      process.env.DB_TEST_HOST,
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin', 
    'X-Requested-With', 
    'Content-Type', 
    'Accept', 
    'Authorization'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Use the cors middleware before your routes
app.use(cors(corsOptions));
app.use(express.static("public")); // Archivos estáticos
app.use(bodyParser.urlencoded({extended: true})); // Formularios
app.use(bodyParser.json()); // JSON
app.use("/api", routes);// Usar las rutas en la aplicación

// Verificar la conexión con la base de datos
tests.testDbConnection();

// verificar el directorio para subir archivos de CV
tests.cvDirectory();

// Middleware de manejo de errores general
// Para verificar errores y ver en que entorno estamos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const httpServer = http.createServer(app);
const io = socketIo(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://localhost:3000',
      process.env.FRONTEND_URL
    ],
    credentials: true
  }
});

let connectedUsers = 0;

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado:", socket.id);
  connectedUsers++;
  io.emit("usersCount", connectedUsers);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
    connectedUsers--;
    io.emit("usersCount", connectedUsers);
  });
});

httpServer.listen(port,"0.0.0.0",() => {
  console.log(`Servidor Express y Socket.IO iniciado en el puerto ${port}`);
});


module.exports = app;
