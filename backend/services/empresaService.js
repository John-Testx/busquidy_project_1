const Empresa = require('../models/Empresa');
const User = require('../models/User');
const { pool } = require('../config/db');

class EmpresaService {
  // Verificar si existe perfil completo
  async checkPerfilExists(id_usuario) {
    // Verificar usuario
    const users = await User.findById(id_usuario);
    if (users.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const tipo_usuario = users[0].tipo_usuario;
    if (tipo_usuario !== 'empresa') {
      throw new Error('Acceso no autorizado');
    }

    // Obtener datos de la empresa
    const [empresaResults] = await pool.query(
      `SELECT nombre_empresa, identificacion_fiscal, direccion, telefono_contacto, 
              correo_empresa, pagina_web, descripcion, sector_industrial 
       FROM empresa WHERE id_usuario = ?`,
      [id_usuario]
    );

    if (empresaResults.length === 0) {
      throw new Error('Datos no encontrados');
    }

    const perfilEmpresa = empresaResults[0];
    const isPerfilIncompleto = Object.values(perfilEmpresa).some(value => !value);

    return { isPerfilIncompleto };
  }

  // Crear perfil de empresa
  async createPerfilEmpresa(empresaData, representanteData, id_usuario) {
    // Verificar usuario
    const users = await User.findById(id_usuario);
    if (users.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    // Obtener id_empresa
    const empresaResults = await Empresa.findByUserId(id_usuario);
    if (empresaResults.length === 0) {
      throw new Error('Empresa no encontrada');
    }

    const id_empresa = empresaResults[0].id_empresa;

    // Actualizar empresa
    await Empresa.updatePerfil(id_empresa, empresaData);

    // Crear representante
    await Empresa.createRepresentante(id_empresa, representanteData);

    return { id_empresa };
  }

  // Obtener perfil completo de empresa
  async getPerfilEmpresa(id_usuario) {
    // Verificar usuario
    const perfilUsuario = await User.findById(id_usuario);
    if (perfilUsuario.length === 0) {
      throw new Error('No se encontró el perfil usuario');
    }

    // Obtener empresa
    const perfilEmpresa = await Empresa.findByUserId(id_usuario);
    if (perfilEmpresa.length === 0) {
      throw new Error('No se encontró el perfil de la empresa');
    }

    const id_empresa = perfilEmpresa[0].id_empresa;

    // Obtener representante
    const perfilRepresentante = await Empresa.getRepresentante(id_empresa);
    if (perfilRepresentante.length === 0) {
      throw new Error('No se encontró el perfil representante');
    }

    return {
      perfilUsuario: perfilUsuario[0],
      perfilEmpresa: perfilEmpresa[0],
      perfilRepresentante: perfilRepresentante[0]
    };
  }

  // Agregar reseña
  async addReview(id_usuario, calificacion, comentario, id_identificador) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Determinar tipo de usuario que reseña
      const [usuarioResena] = await connection.query(
        'SELECT tipo_usuario FROM usuario WHERE id_usuario = ?',
        [id_usuario]
      );

      if (!usuarioResena || usuarioResena.length === 0) {
        throw new Error('El usuario que reseña no existe');
      }

      const tipoUsuario = usuarioResena[0].tipo_usuario;
      let tipo_calificado;
      let id_calificado;

      if (tipoUsuario === 'freelancer') {
        // Freelancer reseña empresa
        const [proyecto] = await connection.query(
          `SELECT p.id_empresa FROM proyecto p 
           INNER JOIN publicacion_proyecto pp ON p.id_proyecto = pp.id_proyecto 
           WHERE pp.id_publicacion = ?`,
          [id_identificador]
        );

        if (!proyecto || proyecto.length === 0) {
          throw new Error('No se encontró una empresa asociada a la publicación');
        }

        id_calificado = proyecto[0].id_empresa;

        const empresaResults = await connection.query(
          'SELECT id_usuario FROM empresa WHERE id_empresa = ?',
          [id_calificado]
        );

        if (empresaResults.length === 0) {
          throw new Error('No se encontró el usuario de la empresa');
        }

        const id_usuario_empresa = empresaResults[0][0].id_usuario;
        const usuarioResults = await User.findById(id_usuario_empresa);
        
        if (usuarioResults.length === 0) {
          throw new Error('No se encontró el usuario');
        }

        tipo_calificado = usuarioResults[0].tipo_usuario;
      } else if (tipoUsuario === 'empresa') {
        // Empresa reseña freelancer
        const [freelancer] = await connection.query(
          'SELECT id_freelancer FROM freelancer WHERE id_freelancer = ?',
          [id_identificador]
        );

        if (!freelancer || freelancer.length === 0) {
          throw new Error('No puedes reseñar a un usuario del mismo tipo');
        }

        id_calificado = id_identificador;
        tipo_calificado = 'freelancer';
      } else {
        throw new Error('El tipo de usuario que reseña no es válido');
      }

      // Validar tipos
      if (tipoUsuario === tipo_calificado) {
        throw new Error('No puedes reseñar a un usuario del mismo tipo');
      }

      // Verificar reseña existente
      const [existingReview] = await connection.query(
        'SELECT id_resena FROM resena WHERE id_usuario = ? AND id_calificado = ?',
        [id_usuario, id_calificado]
      );

      if (existingReview && existingReview.length > 0) {
        throw new Error('Ya has realizado una reseña a este usuario');
      }

      // Insertar reseña
      await connection.query(
        `INSERT INTO resena 
         (id_usuario, tipo_calificado, id_calificado, calificacion, comentario, fecha_resena) 
         VALUES (?, ?, ?, ?, ?, CURDATE())`,
        [id_usuario, tipo_calificado, id_calificado, calificacion, comentario]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new EmpresaService();