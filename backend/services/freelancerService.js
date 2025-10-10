const Freelancer = require('../models/Freelancer');
const User = require('../models/User');
const Project = require('../models/Project');
const { pool } = require('../config/db');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { procesarCV } = require('./cvService');

class FreelancerService {
  // Verificar si existe perfil
  async checkPerfilExists(id_usuario) {
    const users = await User.findById(id_usuario);
    if (users.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const freelancerResults = await Freelancer.findByUserId(id_usuario);
    if (freelancerResults.length === 0) {
      throw new Error('Freelancer no encontrado');
    }

    const id_freelancer = freelancerResults[0].id_freelancer;

    const antecedentes = await Freelancer.getAntecedentesPersonales(id_freelancer);
    const isPerfilIncompleto = !antecedentes;

    return { isPerfilIncompleto };
  }

  // Crear perfil completo de freelancer
  async createPerfilFreelancer(data, id_usuario) {
    const users = await User.findById(id_usuario);
    if (users.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const freelancerResults = await Freelancer.findByUserId(id_usuario);
    if (freelancerResults.length === 0) {
      throw new Error('Freelancer no encontrado');
    }

    const id_freelancer = freelancerResults[0].id_freelancer;

    // Actualizar información básica
    await pool.query(
      `UPDATE freelancer SET correo_contacto = ?, telefono_contacto = ?, 
       linkedin_link = ?, descripcion = ? WHERE id_freelancer = ?`,
      [
        data.freelancer.correo_contacto,
        data.freelancer.telefono_contacto,
        data.freelancer.linkedin_link,
        data.freelancer.descripcion_freelancer,
        id_freelancer
      ]
    );

    // Insertar antecedentes personales
    await Freelancer.createAntecedentesPersonales(id_freelancer, data.antecedentes_personales);

    // Insertar inclusión laboral
    await pool.query(
      `INSERT INTO inclusion_laboral 
       (id_freelancer, discapacidad, registro_nacional, pension_invalidez, ajuste_entrevista, tipo_discapacidad)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id_freelancer,
        data.inclusion_laboral.discapacidad,
        data.inclusion_laboral.registro_nacional,
        data.inclusion_laboral.pension_invalidez,
        data.inclusion_laboral.ajuste_entrevista,
        data.inclusion_laboral.tipo_discapacidad
      ]
    );

    // Insertar emprendimiento
    await pool.query(
      `INSERT INTO emprendimiento 
       (id_freelancer, emprendedor, interesado, ano_inicio, mes_inicio, sector_emprendimiento)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id_freelancer,
        data.emprendimiento.emprendedor,
        data.emprendimiento.interesado,
        data.emprendimiento.ano_inicio_emprendimiento,
        data.emprendimiento.mes_inicio_emprendimiento,
        data.emprendimiento.sector_emprendimiento
      ]
    );

    // Insertar trabajo/práctica
    await pool.query(
      `INSERT INTO trabajo_practica 
       (id_freelancer, experiencia_laboral, experiencia, empresa, cargo, area_trabajo, 
        tipo_cargo, ano_inicio, mes_inicio, descripcion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_freelancer,
        data.trabajo_practica.experiencia_laboral,
        data.trabajo_practica.experiencia,
        data.trabajo_practica.empresa,
        data.trabajo_practica.cargo,
        data.trabajo_practica.area_trabajo,
        data.trabajo_practica.tipo_cargo,
        data.trabajo_practica.ano_inicio_trabajo,
        data.trabajo_practica.mes_inicio_trabajo,
        data.trabajo_practica.descripcion_trabajo
      ]
    );

    // Insertar nivel educacional
    await pool.query(
      `INSERT INTO nivel_educacional (id_freelancer, nivel_academico, estado)
       VALUES (?, ?, ?)`,
      [
        id_freelancer,
        data.nivel_educacional.nivel_academico,
        data.nivel_educacional.estado_educacional
      ]
    );

    // Insertar educación superior
    await pool.query(
      `INSERT INTO educacion_superior 
       (id_freelancer, institucion, carrera, carrera_afin, estado, ano_inicio, ano_termino)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id_freelancer,
        data.educacion_superior.institucion_superior,
        data.educacion_superior.carrera,
        data.educacion_superior.carrera_afin,
        data.educacion_superior.estado_superior,
        data.educacion_superior.ano_inicio_superior,
        data.educacion_superior.ano_termino_superior
      ]
    );

    // Insertar educación básica/media
    await pool.query(
      `INSERT INTO educacion_basica_media 
       (id_freelancer, institucion, tipo, pais, ciudad, ano_inicio, ano_termino)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id_freelancer,
        data.educacion_basica_media.institucion_basica_media,
        data.educacion_basica_media.tipo,
        data.educacion_basica_media.pais,
        data.educacion_basica_media.ciudad_basica_media,
        data.educacion_basica_media.ano_inicio_basica_media,
        data.educacion_basica_media.ano_termino_basica_media
      ]
    );

    // Insertar idiomas
    const idiomaPromises = data.idiomas.map(idioma =>
      pool.query(
        'INSERT INTO idiomas (id_freelancer, idioma, nivel) VALUES (?, ?, ?)',
        [id_freelancer, idioma.idioma, idioma.nivel_idioma]
      )
    );
    await Promise.all(idiomaPromises);

    // Insertar habilidades
    const habilidadPromises = data.habilidades.map(habilidad =>
      pool.query(
        'INSERT INTO habilidades (id_freelancer, categoria, habilidad, nivel) VALUES (?, ?, ?, ?)',
        [id_freelancer, habilidad.categoria, habilidad.habilidad, habilidad.nivel_habilidad]
      )
    );
    await Promise.all(habilidadPromises);

    // Insertar curso
    await pool.query(
      `INSERT INTO curso (id_freelancer, nombre_curso, institucion, ano_inicio, mes_inicio)
       VALUES (?, ?, ?, ?, ?)`,
      [
        id_freelancer,
        data.curso.nombre_curso,
        data.curso.institucion_curso,
        data.curso.ano_inicio_curso,
        data.curso.mes_inicio_curso
      ]
    );

    // Insertar pretensiones
    await pool.query(
      `INSERT INTO pretensiones (id_freelancer, disponibilidad, renta_esperada)
       VALUES (?, ?, ?)`,
      [
        id_freelancer,
        data.pretensiones.disponibilidad,
        data.pretensiones.renta_esperada
      ]
    );

    return { id_freelancer };
  }

  // Obtener perfil completo de freelancer
  async getPerfilFreelancer(id_usuario) {
    const perfilUsuario = await User.findById(id_usuario);
    if (perfilUsuario.length === 0) {
      throw new Error('No se encontró el usuario');
    }

    const perfilFreelancer = await Freelancer.findByUserId(id_usuario);
    if (perfilFreelancer.length === 0) {
      throw new Error('No se encontró el freelancer');
    }

    const id_freelancer = perfilFreelancer[0].id_freelancer;

    // Consultar datos relacionados
    const [antecedentes] = await pool.query(
      'SELECT * FROM antecedentes_personales WHERE id_freelancer = ?',
      [id_freelancer]
    );

    const [inclusionLaboral] = await pool.query(
      'SELECT * FROM inclusion_laboral WHERE id_freelancer = ?',
      [id_freelancer]
    );

    const [emprendimiento] = await pool.query(
      'SELECT * FROM emprendimiento WHERE id_freelancer = ?',
      [id_freelancer]
    );

    const [trabajoPractica] = await pool.query(
      'SELECT * FROM trabajo_practica WHERE id_freelancer = ?',
      [id_freelancer]
    );

    const [nivelEducacional] = await pool.query(
      'SELECT * FROM nivel_educacional WHERE id_freelancer = ?',
      [id_freelancer]
    );

    const [educacionSuperior] = await pool.query(
      'SELECT * FROM educacion_superior WHERE id_freelancer = ?',
      [id_freelancer]
    );

    const [educacionBasica] = await pool.query(
      'SELECT * FROM educacion_basica_media WHERE id_freelancer = ?',
      [id_freelancer]
    );

    const [idiomas] = await pool.query(
      'SELECT * FROM idiomas WHERE id_freelancer = ?',
      [id_freelancer]
    );

    const [habilidades] = await pool.query(
      'SELECT * FROM habilidades WHERE id_freelancer = ?',
      [id_freelancer]
    );

    const [cursos] = await pool.query(
      'SELECT * FROM curso WHERE id_freelancer = ?',
      [id_freelancer]
    );

    const [pretensiones] = await pool.query(
      'SELECT * FROM pretensiones WHERE id_freelancer = ?',
      [id_freelancer]
    );

    return {
      usuario: perfilUsuario[0],
      freelancer: perfilFreelancer[0],
      antecedentesPersonales: antecedentes[0] || {},
      inclusionLaboral: inclusionLaboral[0] || {},
      emprendimiento: emprendimiento || [],
      trabajoPractica: trabajoPractica || [],
      nivelEducacional: nivelEducacional[0] || {},
      educacionSuperior: educacionSuperior || {},
      educacionBasicaMedia: educacionBasica || {},
      idiomas: idiomas || [],
      habilidades: habilidades || [],
      curso: cursos || [],
      pretensiones: pretensiones[0] || {}
    };
  }

  // Actualizar sección de perfil
  async updatePerfilSection(id_usuario, section, updatedData) {
    const perfilFreelancer = await Freelancer.findByUserId(id_usuario);
    if (perfilFreelancer.length === 0) {
      throw new Error('No se encontró el freelancer');
    }

    const id_freelancer = perfilFreelancer[0].id_freelancer;

    switch (section) {
      case 'informacionGeneral':
        const fecha_nacimiento = new Date(updatedData.fecha_nacimiento)
          .toISOString()
          .split('T')[0];

        await pool.query(
          `UPDATE antecedentes_personales SET
           nombres = ?, apellidos = ?, fecha_nacimiento = ?,
           identificacion = ?, nacionalidad = ?, direccion = ?, 
           region = ?, ciudad = ?, comuna = ?
           WHERE id_freelancer = ?`,
          [
            updatedData.nombres,
            updatedData.apellidos,
            fecha_nacimiento,
            updatedData.identificacion,
            updatedData.nacionalidad,
            updatedData.direccion,
            updatedData.region,
            updatedData.ciudad,
            updatedData.comuna,
            id_freelancer
          ]
        );

        await pool.query(
          `UPDATE freelancer SET correo_contacto = ?, telefono_contacto = ?
           WHERE id_freelancer = ?`,
          [updatedData.correo_contacto, updatedData.telefono_contacto, id_freelancer]
        );
        break;

      case 'presentacion':
        await pool.query(
          'UPDATE freelancer SET descripcion = ? WHERE id_freelancer = ?',
          [updatedData.descripcion, id_freelancer]
        );
        break;

      case 'formacion':
        await pool.query(
          `UPDATE nivel_educacional SET nivel_academico = ?, estado = ?
           WHERE id_freelancer = ?`,
          [updatedData.nivel_academico, updatedData.estado, id_freelancer]
        );
        break;

      case 'pretensiones':
        await pool.query(
          `UPDATE pretensiones SET disponibilidad = ?, renta_esperada = ?
           WHERE id_freelancer = ?`,
          [updatedData.disponibilidad, updatedData.renta_esperada, id_freelancer]
        );
        break;

      default:
        throw new Error('Sección no válida');
    }

    return updatedData;
  }

  // Listar todos los freelancers
  async listFreelancers() {
    const freelancers = await Freelancer.findAllWithDetails();
    
    return freelancers.map(freelancer => ({
      id_freelancer: freelancer.id_freelancer,
      nombre: freelancer.nombres,
      apellido: freelancer.apellidos,
      nacionalidad: freelancer.nacionalidad,
      ciudad: freelancer.ciudad,
      comuna: freelancer.comuna,
      correo_contacto: freelancer.correo_contacto,
      telefono_contacto: freelancer.telefono_contacto,
      calificacion_promedio: freelancer.calificacion_promedio,
      descripcion: freelancer.descripcion
    }));
  }

  // Obtener perfil público de freelancer
  async getPublicPerfil(id_freelancer) {
    const [perfilFreelancer] = await pool.query(
      'SELECT * FROM freelancer WHERE id_freelancer = ?',
      [id_freelancer]
    );

    if (perfilFreelancer.length === 0) {
      throw new Error('No se encontró el freelancer');
    }

    const id_usuario = perfilFreelancer[0].id_usuario;

    const [usuario] = await pool.query(
      'SELECT * FROM usuario WHERE id_usuario = ?',
      [id_usuario]
    );

    if (usuario.length === 0) {
      throw new Error('No se encontró el usuario');
    }

    // Obtener datos completos del perfil (similar a getPerfilFreelancer)
    const perfil = await this.getPerfilFreelancer(id_usuario);

    return perfil;
  }

  // Postular a proyecto
  async postularProyecto(id_publicacion, id_usuario) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Verificar si ya postuló
      const existingApplications = await Project.checkExistingPostulacion(
        id_publicacion,
        id_usuario
      );

      if (existingApplications.length > 0) {
        throw new Error('Ya has aplicado a este proyecto');
      }

      // Obtener freelancer
      const perfilFreelancer = await Freelancer.findByUserId(id_usuario);
      if (perfilFreelancer.length === 0) {
        throw new Error('No se encontró el freelancer');
      }

      const id_freelancer = perfilFreelancer[0].id_freelancer;

      // Crear postulación
      await Project.createPostulacion(id_publicacion, id_freelancer);

      await connection.commit();
      return { id_publicacion };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Obtener postulaciones
  async getPostulaciones(id_usuario) {
    const perfilFreelancer = await Freelancer.findByUserId(id_usuario);
    if (perfilFreelancer.length === 0) {
      throw new Error('No se encontró el freelancer');
    }

    const id_freelancer = perfilFreelancer[0].id_freelancer;
    const postulaciones = await Project.getPostulacionesByFreelancer(id_freelancer);

    return postulaciones;
  }

  // Eliminar postulación
  async deletePostulacion(id_postulacion) {
    const exists = await Project.postulacionExists(id_postulacion);
    if (!exists) {
      throw new Error('Postulación no encontrada');
    }

    await Project.deletePostulacion(id_postulacion);
    return true;
  }

  // Upload CV
  async uploadCV(file, id_usuario) {
    if (!file) {
      throw new Error('No se ha proporcionado ningún archivo');
    }

    const cv_url = `/uploads/cvs/${file.filename}`;
    let extractedText = '';

    try {
      // Procesar archivo según tipo
      if (file.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(file.path);
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
      } else if (
        file.mimetype ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'application/msword'
      ) {
        const dataBuffer = fs.readFileSync(file.path);
        const docData = await mammoth.extractRawText({ buffer: dataBuffer });
        extractedText = docData.value;
      } else {
        fs.unlinkSync(file.path);
        throw new Error('Formato de archivo no soportado');
      }

      // Obtener freelancer
      const freelancerResults = await Freelancer.findByUserId(id_usuario);
      if (freelancerResults.length === 0) {
        throw new Error('Freelancer no encontrado');
      }

      const id_freelancer = freelancerResults[0].id_freelancer;

      // Procesar CV
      const perfilData = await procesarCV(extractedText);
      perfilData.cv_url = cv_url;
      perfilData.id_freelancer = id_freelancer;

      // Guardar en DB usando función del archivo original
      const { guardarPerfilEnDB } = require('../config/db');
      await guardarPerfilEnDB(perfilData);

      return { cv_url };
    } catch (error) {
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  // Obtener CV
  async getCV(id_freelancer) {
    const cv_url = await Freelancer.getCvUrl(id_freelancer);
    if (!cv_url) {
      throw new Error('Freelancer no encontrado');
    }
    return { cv_url };
  }

  // Agregar datos a perfil
  async addPerfilData(id_usuario, itemType, data) {
    const perfilFreelancer = await Freelancer.findByUserId(id_usuario);
    if (perfilFreelancer.length === 0) {
      throw new Error('No se encontró el freelancer');
    }

    const id_freelancer = perfilFreelancer[0].id_freelancer;
    let tableName, columns, values;

    switch (itemType) {
      case 'inclusionLaboral':
        tableName = 'inclusion_laboral';
        columns = [
          'id_freelancer',
          'discapacidad',
          'registro_nacional',
          'pension_invalidez',
          'ajuste_entrevista',
          'tipo_discapacidad'
        ];
        values = [
          id_freelancer,
          data.discapacidad,
          data.registro_nacional,
          data.pension_invalidez,
          data.ajuste_entrevista,
          data.tipo_discapacidad
        ];
        break;

      case 'experienciaLaboral':
        tableName = 'emprendimiento';
        columns = [
          'id_freelancer',
          'emprendedor',
          'interesado',
          'ano_inicio',
          'mes_inicio',
          'sector_emprendimiento'
        ];
        values = [
          id_freelancer,
          data.emprendedor,
          data.interesado,
          data.ano_inicio_emp,
          data.mes_inicio_emp,
          data.sector_emprendimiento
        ];
        break;

      case 'trabajoPractica':
        tableName = 'trabajo_practica';
        columns = [
          'id_freelancer',
          'experiencia_laboral',
          'experiencia',
          'empresa',
          'cargo',
          'area_trabajo',
          'tipo_cargo',
          'ano_inicio',
          'mes_inicio',
          'descripcion'
        ];
        values = [
          id_freelancer,
          data.experiencia_laboral,
          data.experiencia,
          data.empresa,
          data.cargo,
          data.area_trabajo,
          data.tipo_cargo,
          data.ano_inicio_tra,
          data.mes_inicio_tra,
          data.descripcion
        ];
        break;

      case 'formacion':
        tableName = 'nivel_educacional';
        columns = ['id_freelancer', 'nivel_academico', 'estado'];
        values = [id_freelancer, data.nivel_academico, data.estado];
        break;

      case 'educacionSuperior':
        tableName = 'educacion_superior';
        columns = [
          'id_freelancer',
          'institucion',
          'carrera',
          'carrera_afin',
          'estado',
          'ano_inicio',
          'ano_termino'
        ];
        values = [
          id_freelancer,
          data.institucion,
          data.carrera,
          data.carrera_afin,
          data.estado_carrera,
          data.ano_inicio_su,
          data.ano_termino_su
        ];
        break;

      case 'educacionBasicaMedia':
        tableName = 'educacion_basica_media';
        columns = [
          'id_freelancer',
          'institucion',
          'tipo',
          'pais',
          'ciudad',
          'ano_inicio',
          'ano_termino'
        ];
        values = [
          id_freelancer,
          data.institucion,
          data.tipo,
          data.pais,
          data.ciudad,
          data.ano_inicio_ba,
          data.ano_termino_ba
        ];
        break;

      case 'conocimientos':
        tableName = 'curso';
        columns = [
          'id_freelancer',
          'nombre_curso',
          'institucion',
          'ano_inicio',
          'mes_inicio'
        ];
        values = [
          id_freelancer,
          data.nombre_curso,
          data.institucion,
          data.ano_inicio_cur,
          data.mes_inicio_cur
        ];
        break;

      case 'idiomas':
        tableName = 'idiomas';
        columns = ['id_freelancer', 'idioma', 'nivel'];
        values = [id_freelancer, data.idioma, data.nivel];
        break;

      case 'habilidades':
        tableName = 'habilidades';
        columns = ['id_freelancer', 'categoria', 'habilidad', 'nivel'];
        values = [id_freelancer, data.categoria, data.habilidad, data.nivel];
        break;

      default:
        throw new Error('Tipo de elemento no reconocido');
    }

    const placeholders = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;

    await pool.execute(sql, values);
    return true;
  }

  // Eliminar idioma o habilidad
  async deleteIdiomaHabilidad(id_usuario, seccion, id) {
    let query, values;

    switch (seccion) {
      case 'idiomas':
        query = `DELETE FROM idiomas WHERE id_idioma = ? 
                 AND id_freelancer = (SELECT id_freelancer FROM freelancer WHERE id_usuario = ?)`;
        values = [id, id_usuario];
        break;

      case 'habilidades':
        query = `DELETE FROM habilidades WHERE id_habilidad = ? 
                 AND id_freelancer = (SELECT id_freelancer FROM freelancer WHERE id_usuario = ?)`;
        values = [id, id_usuario];
        break;

      default:
        throw new Error('Sección no válida');
    }

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      throw new Error('Dato no encontrado');
    }

    return true;
  }
}

module.exports = new FreelancerService();