const userService = require('../services/userService');
const { success, error, created } = require('../utils/response');
const logger = require('../utils/logger');

class UserController {
  // Registro de usuario
  async register(req, res, next) {
    try {
      const { correo, contraseña, tipo_usuario } = req.body;

      const result = await userService.register(correo, contraseña, tipo_usuario);

      const message =
        tipo_usuario === 'empresa'
          ? 'Usuario empresa registrado exitosamente'
          : 'Usuario freelancer registrado exitosamente';

      return created(res, result, message);
    } catch (err) {
      logger.error('Error en register:', err);
      if (err.message === 'Correo ya registrado') {
        return error(res, err.message, 400);
        }
      }
      next(err);
    }

  // Login
  async login(req, res, next) {
    try {
      const { correo, contraseña } = req.body;

      logger.info('Intento de login:', { correo });

      const result = await userService.login(correo, contraseña);

      logger.info('Login exitoso:', { id_usuario: result.id_usuario, tipo_usuario: result.tipo_usuario });

      // Respuesta en formato compatible con el frontend anterior
      return res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        token: result.token,
        tipo_usuario: result.tipo_usuario,
        id_usuario: result.id_usuario
      });
    } catch (err) {
      logger.error('Error en login:', err);
      if (err.message === 'Usuario no encontrado') {
        return error(res, err.message, 404);
      }
      if (err.message === 'Contraseña incorrecta') {
        return error(res, err.message, 401);
      }
      next(err);
    }
  }

  // Obtener todos los usuarios
  async getUsuarios(req, res, next) {
    try {
      const usuarios = await userService.getAllUsuarios();
      return success(res, usuarios);
    } catch (err) {
      logger.error('Error en getUsuarios:', err);
      next(err);
    }
  }

  // Eliminar usuario
  async deleteUsuario(req, res, next) {
    try {
      const { id_usuario } = req.params;

      if (!id_usuario || isNaN(id_usuario)) {
        return error(res, 'ID de usuario inválido', 400);
      }

      await userService.deleteUsuario(id_usuario);

      return success(res, null, 'Usuario eliminado exitosamente');
    } catch (err) {
      logger.error('Error en deleteUsuario:', err);
      if (err.message === 'Usuario no encontrado') {
        return error(res, err.message, 404);
      }
      next(err);
    }
  }
}

module.exports = new UserController();
