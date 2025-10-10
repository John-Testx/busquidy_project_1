const socketIo = require('socket.io');
const config = require('./index');
const logger = require('../utils/logger');

let io;
let connectedUsers = 0;

function initializeSocket(httpServer) {
  io = socketIo(httpServer, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://localhost:3000',
        config.FRONTEND_URL
      ].filter(Boolean),
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Nuevo cliente conectado: ${socket.id}`);
    connectedUsers++;
    io.emit('usersCount', connectedUsers);

    socket.on('disconnect', () => {
      logger.info(`Cliente desconectado: ${socket.id}`);
      connectedUsers--;
      io.emit('usersCount', connectedUsers);
    });
  });

  return io;
}

function getIo() {
  if (!io) {
    throw new Error('Socket.io no ha sido inicializado');
  }
  return io;
}

module.exports = {
  initializeSocket,
  getIo
};