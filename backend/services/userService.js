const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Empresa = require('../models/Empresa');
const Freelancer = require('../models/Freelancer');
const config = require('../config');

class UserService {
  // Registrar usuario
  async register(correo, contraseña, tipo_usuario) {
    // Verificar si el correo ya existe
    const existingUser = await User.findByEmail(correo);
    if (existingUser.length > 0) {
      throw new Error('Correo ya registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar usuario
    const id_usuario = await User.create(correo, hashedPassword, tipo_usuario);

    // Crear perfil según tipo de usuario
    if (tipo_usuario === 'empresa') {
      await Empresa.create(id_usuario);
    } else if (tipo_usuario === 'freelancer') {
      await Freelancer.create(id_usuario);
    } else {
      throw new Error('Tipo de usuario no válido');
    }

    return { id_usuario, tipo_usuario };
  }

  // Login
  async login(correo, contraseña) {
    // Verificar si el usuario existe
    const users = await User.findByEmail(correo);
    if (users.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const user = users[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    // Generar token JWT
    const token = jwt.sign(
      { id_usuario: user.id_usuario, tipo_usuario: user.tipo_usuario },
      config.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return {
      token,
      tipo_usuario: user.tipo_usuario,
      id_usuario: user.id_usuario
    };
  }

  // Obtener todos los usuarios con datos
  async getAllUsuarios() {
    const usuarios = await User.findAll();

    const usuariosConDatos = await Promise.all(
      usuarios.map(async (usuario) => {
        let empresa = null;
        let freelancer = null;
        let idRol = null;
        let premium = 'No';

        if (usuario.tipo_usuario === 'empresa') {
          const empresaData = await Empresa.findByUserId(usuario.id_usuario);
          empresa = empresaData.length > 0 ? empresaData[0] : null;
          idRol = empresa ? empresa.id_empresa : null;
          premium = empresa && empresa.premium === 1 ? 'Sí' : 'No';
        } else if (usuario.tipo_usuario === 'freelancer') {
          const freelancerData = await Freelancer.findByUserId(usuario.id_usuario);
          freelancer = freelancerData.length > 0 ? freelancerData[0] : null;
          idRol = freelancer ? freelancer.id_freelancer : null;
          premium = freelancer && freelancer.premium === 1 ? 'Sí' : 'No';
        }

        return {
          ...usuario,
          idRol,
          premium,
          empresa,
          freelancer
        };
      })
    );

    return usuariosConDatos;
  }

  // Obtener usuario por ID
  async getUserById(id_usuario) {
    const users = await User.findById(id_usuario);
    if (users.length === 0) {
      throw new Error('Usuario no encontrado');
    }
    return users[0];
  }

  // Eliminar usuario
  async deleteUsuario(id_usuario) {
    const users = await User.findById(id_usuario);
    if (users.length === 0) {
      throw new Error('Usuario no encontrado');
    }
    await User.delete(id_usuario);
    return true;
  }
}

module.exports = new UserService();