const express = require("express");
const PaymentService = require("./paymentService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {verifyToken, validatePaymentData, validateUser, upload} = require("./middlewares/auth");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const router = express.Router();
const fs = require("fs");
const {procesarCV} = require("./cvService");
const {pool,
  insertarUsuario,
  getUserById,
  getEmpresaByUserId,
  getFreelancerByUserId,
  buscarEmpresaByUserId,
  buscarFreelancerByUserId,
  getRepresentanteByUserId,
  checkDuplicateProject,
  guardarPerfilEnDB,
} = require("./db");

const sendError = (res, status, message) => res.status(status).json({message});

// Ruta para ver si existe perfil freelancer
router.get("/get/:id_usuario", async (req, res) => {
  const {id_usuario} = req.params;

  try {
    // Verificar usuario
    const userCheckResults = await getUserById(id_usuario);
    if (userCheckResults.length === 0) {
      return res.status(404).json({error: "Usuario no encontrado"});
    }

    // Obtener `id_freelancer`
    const freelancerResults = await getFreelancerByUserId(id_usuario);
    if (freelancerResults.length === 0) {
      return res.status(404).json({error: "Freelancer no encontrado"});
    }

    const id_freelancer = freelancerResults[0].id_freelancer;

    // Verificar antecedentes personales
    const [antecedentesResults] = await pool.query(
        "SELECT * FROM antecedentes_personales WHERE id_freelancer = ?",
        [id_freelancer],
    );

    const isPerfilIncompleto = antecedentesResults.length === 0;

    res.json({isPerfilIncompleto});
  } catch (error) {
    console.error("Error al verificar el perfil del freelancer:", error);
    res.status(500).json({error: "Error al verificar el perfil del freelancer"});
  }
});

//Update Freelancer profile
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { perfilFreelancer, perfilUsuario } = req.body;

  try {
    if (perfilFreelancer) {
      await db.query(
        `UPDATE freelancer SET 
          nombre_completo = ?, 
          habilidades = ?, 
          descripcion = ? 
         WHERE id_usuario = ?`,
        [
          perfilFreelancer.nombre_completo,
          perfilFreelancer.habilidades,
          perfilFreelancer.descripcion,
          id,
        ]
      );
    }

    if (perfilUsuario) {
      await db.query(
        `UPDATE usuario SET correo = ? WHERE id = ?`,
        [perfilUsuario.correo, id]
      );
      // Password updates should be handled securely
    }

    res.json({ message: "Perfil de freelancer actualizado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando perfil" });
  }
});


// Función para crear el perfil de freelancer en múltiples tablas
router.post("/create-perfil-freelancer", verifyToken, async (req, res) => {
  const {
    freelancer,
    antecedentes_personales,
    inclusion_laboral,
    emprendimiento,
    trabajo_practica,
    nivel_educacional,
    educacion_superior,
    educacion_basica_media,
    idiomas,
    habilidades,
    curso,
    pretensiones,
    id_usuario,
  } = req.body;

  console.log("Datos enviados al backend:", req.body);

  // Verificar que id_usuario no sea undefined o null
  if (!id_usuario) {
    console.log("Error: id_usuario es undefined o null");
    return res.status(400).json({error: "ID de usuario inválido"});
  }

  try {
    // Verificar usuario
    const userCheckResults = await getUserById(id_usuario);
    if (userCheckResults.length === 0) {
      return res.status(404).json({error: "Usuario no encontrado"});
    }

    console.log("Usuario encontrado");

    // Obtener id_freelancer
    const freelancerResults = await getFreelancerByUserId(id_usuario);
    if (freelancerResults.length === 0) {
      return res.status(404).json({error: "Freelancer no encontrado"});
    }

    const id_freelancer = freelancerResults[0].id_freelancer;
    console.log("ID de freelancer obtenido:", id_freelancer);

    // Actualizar descripción en la tabla freelancer
    await pool.query(`
            UPDATE freelancer SET correo_contacto = ?, telefono_contacto = ?, linkedin_link = ?, descripcion = ? WHERE id_freelancer = ?`
    , [
      freelancer.correo_contacto, freelancer.telefono_contacto, freelancer.linkedin_link,
      freelancer.descripcion_freelancer, id_freelancer,
    ]);

    // Insertar en la tabla 'antecedentes_personales'
    await pool.query(`
            INSERT INTO antecedentes_personales (id_freelancer, nombres, apellidos, fecha_nacimiento, identificacion, nacionalidad, direccion, region, ciudad, comuna, estado_civil)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    , [
      id_freelancer, antecedentes_personales.nombres, antecedentes_personales.apellidos,
      antecedentes_personales.fecha_nacimiento, antecedentes_personales.identificacion,
      antecedentes_personales.nacionalidad, antecedentes_personales.direccion,
      antecedentes_personales.region, antecedentes_personales.ciudad_freelancer,
      antecedentes_personales.comuna, antecedentes_personales.estado_civil,
    ]);

    // Insertar en la tabla 'inclusion_laboral'
    await pool.query(`
            INSERT INTO inclusion_laboral (id_freelancer, discapacidad, registro_nacional, pension_invalidez, ajuste_entrevista, tipo_discapacidad)
            VALUES (?, ?, ?, ?, ?, ?)`
    , [
      id_freelancer, inclusion_laboral.discapacidad, inclusion_laboral.registro_nacional,
      inclusion_laboral.pension_invalidez, inclusion_laboral.ajuste_entrevista,
      inclusion_laboral.tipo_discapacidad,
    ]);

    // Insertar en la tabla 'emprendimiento'
    await pool.query(`
            INSERT INTO emprendimiento (id_freelancer, emprendedor, interesado, ano_inicio, mes_inicio, sector_emprendimiento)
            VALUES (?, ?, ?, ?, ?, ?)`
    , [
      id_freelancer, emprendimiento.emprendedor, emprendimiento.interesado,
      emprendimiento.ano_inicio_emprendimiento, emprendimiento.mes_inicio_emprendimiento,
      emprendimiento.sector_emprendimiento,
    ]);

    // Insertar en la tabla 'trabajo_practica'
    await pool.query(`
            INSERT INTO trabajo_practica (id_freelancer, experiencia_laboral, experiencia, empresa, cargo, area_trabajo, tipo_cargo, ano_inicio, mes_inicio, descripcion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    , [
      id_freelancer, trabajo_practica.experiencia_laboral, trabajo_practica.experiencia,
      trabajo_practica.empresa, trabajo_practica.cargo, trabajo_practica.area_trabajo,
      trabajo_practica.tipo_cargo, trabajo_practica.ano_inicio_trabajo, trabajo_practica.mes_inicio_trabajo,
      trabajo_practica.descripcion_trabajo,
    ]);

    // Insertar en la tabla 'nivel_educacional'
    await pool.query(`
            INSERT INTO nivel_educacional (id_freelancer, nivel_academico, estado)
            VALUES (?, ?, ?)`
    , [
      id_freelancer, nivel_educacional.nivel_academico, nivel_educacional.estado_educacional,
    ]);

    // Insertar en la tabla 'educacion_superior'
    await pool.query(`
            INSERT INTO educacion_superior (id_freelancer, institucion, carrera, carrera_afin, estado, ano_inicio, ano_termino)
            VALUES (?, ?, ?, ?, ?, ?, ?)`
    , [
      id_freelancer, educacion_superior.institucion_superior, educacion_superior.carrera,
      educacion_superior.carrera_afin, educacion_superior.estado_superior,
      educacion_superior.ano_inicio_superior, educacion_superior.ano_termino_superior,
    ]);

    // Insertar en la tabla 'educacion_basica_media'
    await pool.query(`
            INSERT INTO educacion_basica_media (id_freelancer, institucion, tipo, pais, ciudad, ano_inicio, ano_termino)
            VALUES (?, ?, ?, ?, ?, ?, ?)`
    , [
      id_freelancer, educacion_basica_media.institucion_basica_media, educacion_basica_media.tipo,
      educacion_basica_media.pais, educacion_basica_media.ciudad_basica_media,
      educacion_basica_media.ano_inicio_basica_media, educacion_basica_media.ano_termino_basica_media,
    ]);

    // Insertar múltiples idiomas en la tabla 'idiomas'
    const idiomaPromises = idiomas.map((idioma) => {
      return pool.query(`INSERT INTO idiomas (id_freelancer, idioma, nivel) VALUES (?, ?, ?)`, [
        id_freelancer, idioma.idioma, idioma.nivel_idioma,
      ]);
    });
    await Promise.all(idiomaPromises);

    // Insertar múltiples habilidades en la tabla 'habilidades'
    const habilidadPromises = habilidades.map((habilidad) => {
      return pool.query(`INSERT INTO habilidades (id_freelancer, categoria, habilidad, nivel) VALUES (?, ?, ?, ?)`, [
        id_freelancer, habilidad.categoria, habilidad.habilidad, habilidad.nivel_habilidad,
      ]);
    });
    await Promise.all(habilidadPromises);

    // Insertar en la tabla 'curso'
    await pool.query(`
            INSERT INTO curso (id_freelancer, nombre_curso, institucion, ano_inicio, mes_inicio) VALUES (?, ?, ?, ?, ?)`, [
      id_freelancer, curso.nombre_curso, curso.institucion_curso, curso.ano_inicio_curso, curso.mes_inicio_curso,
    ]);

    // Insertar en la tabla 'pretensiones'
    await pool.query(`
            INSERT INTO pretensiones (id_freelancer, disponibilidad, renta_esperada) VALUES (?, ?, ?)`, [
      id_freelancer, pretensiones.disponibilidad, pretensiones.renta_esperada,
    ]);

    console.log("Perfil freelancer creado exitosamente");
    res.status(201).json({message: "Perfil de freelancer creado exitosamente"});
  } catch (err) {
    console.error("Error al crear el perfil:", err);
    res.status(500).json({error: "Error al crear el perfil de freelancer"});
  }
});

// Ruta para obtener el perfil del freelancer
router.get("/perfil-freelancer/:id_usuario", async (req, res) => {
  const {id_usuario} = req.params;

  // Validar que el id_usuario sea válido
  if (!id_usuario || isNaN(id_usuario)) {
    return res.status(400).json({error: "ID de usuario inválido"});
  }

  try {
    // Verificar usuario
    const perfilUsuarioResults = await getUserById(id_usuario);
    if (perfilUsuarioResults.length === 0) {
      return res.status(404).json({error: "No se encontró el usuario"});
    }

    // Obtener freelancer
    const perfilFreelancerResults = await getFreelancerByUserId(id_usuario);
    if (perfilFreelancerResults.length === 0) {
      return res.status(404).json({error: "No se encontró el freelancer"});
    }
    const id_freelancer = perfilFreelancerResults[0].id_freelancer;

    // Consultar datos adicionales de las tablas relacionadas (opcional)
    const [antecedentes] = await pool.query(`
            SELECT * FROM antecedentes_personales WHERE id_freelancer = ?
        `, [id_freelancer]);

    const [inclusionLaboral] = await pool.query(`
            SELECT * FROM inclusion_laboral WHERE id_freelancer = ?
        `, [id_freelancer]);

    const [emprendimiento] = await pool.query(`
            SELECT * FROM emprendimiento WHERE id_freelancer = ?
        `, [id_freelancer]);

    const [trabajoPractica] = await pool.query(`
            SELECT * FROM trabajo_practica WHERE id_freelancer = ?
        `, [id_freelancer]);

    const [nivelEducacional] = await pool.query(`
            SELECT * FROM nivel_educacional WHERE id_freelancer = ?
        `, [id_freelancer]);

    const [educacionSuperior] = await pool.query(`
            SELECT * FROM educacion_superior WHERE id_freelancer = ?
        `, [id_freelancer]);

    const [educacionBasica] = await pool.query(`
            SELECT * FROM educacion_basica_media WHERE id_freelancer = ?
        `, [id_freelancer]);

    const [idiomas] = await pool.query(`
            SELECT * FROM idiomas WHERE id_freelancer = ?
        `, [id_freelancer]);

    const [habilidades] = await pool.query(`
            SELECT * FROM habilidades WHERE id_freelancer = ?
        `, [id_freelancer]);

    const [cursos] = await pool.query(`
            SELECT * FROM curso WHERE id_freelancer = ?
        `, [id_freelancer]);

    const [pretensiones] = await pool.query(`
            SELECT * FROM pretensiones WHERE id_freelancer = ?
        `, [id_freelancer]);

    // Consolidar los datos en una sola respuesta
    res.json({
      usuario: perfilUsuarioResults[0],
      freelancer: perfilFreelancerResults[0],
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
      pretensiones: pretensiones[0] || {},
    });
  } catch (error) {
    console.error("Error al obtener el perfil del freelancer:", error);
    res.status(500).json({error: "Error al obtener el perfil del freelancer"});
  }
});

// Ruta para actualizar sección de perfil
router.put("/update-freelancer/:id_usuario/:section", async (req, res) => {
  const {id_usuario, section} = req.params;
  console.log("id_usuario:", id_usuario);
  console.log("seccion:", section);
  const updatedData = req.body;

  try {
    // Obtener freelancer
    const perfilFreelancerResults = await getFreelancerByUserId(id_usuario);
    if (perfilFreelancerResults.length === 0) {
      return res.status(404).json({error: "No se encontró el freelancer"});
    }
    const id_freelancer = perfilFreelancerResults[0].id_freelancer;

    switch (section) {
      case "informacionGeneral":
        const query1 = `
                    UPDATE antecedentes_personales
                    SET nombres = ?, apellidos = ?, fecha_nacimiento = ?,
                    identificacion = ?, nacionalidad = ?, direccion = ?, region = ?, ciudad = ?, comuna = ?
                    WHERE id_freelancer = ?
                `;
        const fecha_nacimiento = new Date(updatedData.fecha_nacimiento).toISOString().split("T")[0];
        const values1 = [
          updatedData.nombres,
          updatedData.apellidos,
          fecha_nacimiento,
          updatedData.identificacion,
          updatedData.nacionalidad,
          updatedData.direccion,
          updatedData.region,
          updatedData.ciudad,
          updatedData.comuna,
          id_freelancer,
        ];
        const query2 = `
                    UPDATE freelancer
                    SET correo_contacto = ?, telefono_contacto = ?
                    WHERE id_freelancer = ?
                `;
        const values2 = [
          updatedData.correo_contacto,
          updatedData.telefono_contacto,
          id_freelancer,
        ];
        const [result1] = await pool.query(query1, values1);
        const [result2] = await pool.query(query2, values2);

        // Verificar si se actualizaron registros
        if (result1.affectedRows === 0 && result2.affectedRows === 0) {
          return res.status(404).json({error: "No se encontraron datos para actualizar"});
        }
        break;

      case "presentacion":
        const query = `
                    UPDATE freelancer
                    SET descripcion = ?
                    WHERE id_freelancer = ?
                `;
        const values = [
          updatedData.descripcion,
          id_freelancer,
        ];
        const [presentacionResult] = await pool.query(query, values);

        // Verificar si se actualizaron registros
        if (presentacionResult.affectedRows === 0) {
          return res.status(404).json({error: "No se encontraron datos para actualizar"});
        }
        break;

      case "formacion":
        const query3 = `
                    UPDATE nivel_educacional
                    SET nivel_academico = ?, estado = ?
                    WHERE id_freelancer = ?
                `;
        const values3 = [
          updatedData.nivel_academico,
          updatedData.estado,
          id_freelancer,
        ];
        const [formacionResult] = await pool.query(query3, values3);

        // Verificar si se actualizaron registros
        if (formacionResult.affectedRows === 0) {
          return res.status(404).json({error: "No se encontraron datos para actualizar"});
        }
        break;
      case "pretensiones":
        const query4 = `
                    UPDATE pretensiones
                    SET disponibilidad  = ?, renta_esperada = ?
                    WHERE id_freelancer = ?
                `;
        const values4 = [
          updatedData.disponibilidad,
          updatedData.renta_esperada,
          id_freelancer,
        ];
        const [pretensionesResult] = await pool.query(query4, values4);

        // Verificar si se actualizaron registros
        if (pretensionesResult.affectedRows === 0) {
          return res.status(404).json({error: "No se encontraron datos para actualizar"});
        }
        break;

      default:
        return res.status(400).json({error: "Sección no válida"});
    }

    res.json({mensaje: "Actualización exitosa", datos: updatedData});
  } catch (error) {
    console.error(`Error al actualizar ${section}:`, error);
    res.status(500).json({error: "Error al actualizar perfil", detalles: error.message});
  }
});

// Ruta para buscar freelancers
router.get("/list", async (req, res) => {
  const getFreelancerQuery = `
        SELECT 
            f.id_freelancer AS id_freelancer,
            ap.nombres AS nombres,
            ap.apellidos AS apellidos,
            ap.nacionalidad AS nacionalidad,
            ap.ciudad AS ciudad,
            ap.comuna AS comuna,
            f.correo_contacto AS correo_contacto,
            f.telefono_contacto AS telefono_contacto,
            f.calificacion_promedio AS calificacion_promedio,
            f.descripcion AS descripcion
        FROM freelancer AS f
        JOIN antecedentes_personales AS ap ON f.id_freelancer = ap.id_freelancer
    `;

  try {
    // Usar el pool para ejecutar la consulta
    const [results] = await pool.query(getFreelancerQuery); // Cambié 'db' a 'pool'

    if (results.length === 0) {
      return res.status(404).json({error: "No se encontraron freelancers"});
    }

    // Procesar los resultados para solo enviar el primer nombre y apellido
    const freelancers = results.map((freelancer) => ({
      id_freelancer: freelancer.id_freelancer,
      nombre: freelancer.nombres,
      apellido: freelancer.apellidos,
      nacionalidad: freelancer.nacionalidad,
      ciudad: freelancer.ciudad,
      comuna: freelancer.comuna,
      correo_contacto: freelancer.correo_contacto,
      telefono_contacto: freelancer.telefono_contacto,
      calificacion_promedio: freelancer.calificacion_promedio,
      descripcion: freelancer.descripcion,
    }));

    res.json(freelancers);
  } catch (error) {
    console.log("Error al obtener los freelancers:", error);
    return res.status(500).json({error: "Error al obtener los freelancers"});
  }
});

// Ruta para obtener el perfil del freelancer seleccionado
router.get("/freelancer-perfil/:id", async (req, res) => {
  const {id} = req.params;

  // Validar que el id_usuario sea válido
  if (!id || isNaN(id)) {
    return res.status(400).json({error: "ID de usuario inválido"});
  }

  try {
    // Obtener freelancer
    const [perfilFreelancerResults] = await pool.query("SELECT * FROM freelancer WHERE id_freelancer = ?", [id]);
    if (perfilFreelancerResults.length === 0) {
      return res.status(404).json({error: "No se encontró el freelancer"});
    }
    const id_usuario = perfilFreelancerResults[0].id_usuario;

    // Obtener usuario
    const [usuarioResults] = await pool.query("SELECT * FROM usuario WHERE id_usuario = ?", [id_usuario]);
    if (usuarioResults.length === 0) {
      return res.status(404).json({error: "No se encontró el usuario"});
    }

    // Consultar datos adicionales de las tablas relacionadas (opcional)
    const [antecedentes] = await pool.query(`
            SELECT * FROM antecedentes_personales WHERE id_freelancer = ?
        `, [id]);

    const [inclusionLaboral] = await pool.query(`
            SELECT * FROM inclusion_laboral WHERE id_freelancer = ?
        `, [id]);

    const [emprendimiento] = await pool.query(`
            SELECT * FROM emprendimiento WHERE id_freelancer = ?
        `, [id]);

    const [trabajoPractica] = await pool.query(`
            SELECT * FROM trabajo_practica WHERE id_freelancer = ?
        `, [id]);

    const [nivelEducacional] = await pool.query(`
            SELECT * FROM nivel_educacional WHERE id_freelancer = ?
        `, [id]);

    const [educacionSuperior] = await pool.query(`
            SELECT * FROM educacion_superior WHERE id_freelancer = ?
        `, [id]);

    const [educacionBasica] = await pool.query(`
            SELECT * FROM educacion_basica_media WHERE id_freelancer = ?
        `, [id]);

    const [idiomas] = await pool.query(`
            SELECT * FROM idiomas WHERE id_freelancer = ?
        `, [id]);

    const [habilidades] = await pool.query(`
            SELECT * FROM habilidades WHERE id_freelancer = ?
        `, [id]);

    const [cursos] = await pool.query(`
            SELECT * FROM curso WHERE id_freelancer = ?
        `, [id]);

    const [pretensiones] = await pool.query(`
            SELECT * FROM pretensiones WHERE id_freelancer = ?
        `, [id]);

    console.log("perfilFreelancerResults:", perfilFreelancerResults);
    console.log("usuarioResults:", usuarioResults);

    // Consolidar los datos en una sola respuesta
    res.json({
      usuario: {
        id_usuario: usuarioResults[0].id_usuario,
        correo: usuarioResults[0].correo,
        tipo_usuario: usuarioResults[0].tipo_usuario,
      },
      freelancer: perfilFreelancerResults[0] || null,
      antecedentesPersonales: antecedentes[0] || {},
      inclusionLaboral: inclusionLaboral[0] || {},
      emprendimiento: emprendimiento || [],
      trabajoPractica: trabajoPractica || [],
      nivelEducacional: nivelEducacional[0] || {},
      educacionSuperior: educacionSuperior || [],
      educacionBasicaMedia: educacionBasica || [],
      idiomas: idiomas || [],
      habilidades: habilidades || [],
      curso: cursos || [],
      pretensiones: pretensiones[0] || {},
    });
  } catch (error) {
    console.error("Error al obtener el perfil del freelancer:", error);
    res.status(500).json({error: "Error al obtener el perfil del freelancer"});
  }
});

// Ruta para insertar postulacion de freelancer
router.post("/postulacion/:id_publicacion", async (req, res) => {
  const {id_publicacion} = req.params;
  const {id_usuario} = req.body; // Change to req.body to match typical axios post
  console.log("id_publicacion:", id_publicacion);
  console.log("id_usuario:", id_usuario);

  if (!id_publicacion || isNaN(id_publicacion) || !id_usuario || isNaN(id_usuario)) {
    return res.status(400).json({error: "ID invalido"});
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check if freelancer already applied to this publication
    const [existingApplications] = await connection.query(`
            SELECT * FROM postulacion 
            JOIN freelancer ON postulacion.id_freelancer = freelancer.id_freelancer
            WHERE postulacion.id_publicacion = ? AND freelancer.id_usuario = ?
        `, [id_publicacion, id_usuario]);

    if (existingApplications.length > 0) {
      return res.status(400).json({error: "Ya has aplicado a este proyecto"});
    }

    // Get freelancer
    const [perfilFreelancerResults] = await connection.query(
        "SELECT id_freelancer FROM freelancer WHERE id_usuario = ?",
        [id_usuario],
    );

    if (perfilFreelancerResults.length === 0) {
      return res.status(404).json({error: "No se encontró el freelancer"});
    }

    const id_freelancer = perfilFreelancerResults[0].id_freelancer;

    // Insert application
    await connection.query(`
            INSERT INTO postulacion (id_publicacion, id_freelancer, fecha_postulacion, estado_postulacion)
            VALUES (?, ?, CURDATE(), 'postulado')
        `, [id_publicacion, id_freelancer]);

    await connection.commit();
    res.status(201).json({
      message: "Postulación exitosa",
      id_publicacion: id_publicacion,
    });
  } catch (error) {
    console.error("Error al intentar postular:", error);
    if (connection) await connection.rollback();
    res.status(500).json({error: "Error interno del servidor"});
  } finally {
    if (connection) connection.release();
  }
});

// Ruta para obtener postulaciones del freelancer
router.get("/postulaciones/:id_usuario", async (req, res) => {
  const {id_usuario} = req.params;

  if (!id_usuario || isNaN(id_usuario)) {
    return res.status(400).json({error: "ID inválido"});
  }

  try {
    // Obtener ID del freelancer asociado al usuario
    const [perfilFreelancerResults] = await pool.query(
        "SELECT id_freelancer FROM freelancer WHERE id_usuario = ?",
        [id_usuario],
    );

    if (perfilFreelancerResults.length === 0) {
      return res.status(404).json({error: "No se encontró el freelancer"});
    }

    const id_freelancer = perfilFreelancerResults[0].id_freelancer;

    // Obtener postulaciones del freelancer
    const [postulaciones] = await pool.query(`
            SELECT 
                p.id_postulacion,
                p.fecha_postulacion,
                p.estado_postulacion,
                pr.titulo AS titulo,
                e.nombre_empresa,
                e.correo_empresa,
                e.telefono_contacto,
                pp.fecha_publicacion,
                pp.estado_publicacion
            FROM postulacion AS p
            INNER JOIN publicacion_proyecto AS pp ON p.id_publicacion = pp.id_publicacion
            INNER JOIN proyecto AS pr ON pp.id_proyecto = pr.id_proyecto
            INNER JOIN empresa AS e ON pr.id_empresa = e.id_empresa
            WHERE p.id_freelancer = ?
        `, [id_freelancer]);

    res.json(postulaciones);
  } catch (error) {
    console.error("Error al obtener las postulaciones:", error);
    res.status(500).json({error: "Error interno del servidor"});
  }
});

// Ruta para eliminar una postulación
router.delete("/delete-postulacion/:id_postulacion", async (req, res) => {
  const {id_postulacion} = req.params;

  if (!id_postulacion || isNaN(id_postulacion)) {
    return res.status(400).json({error: "ID inválido"});
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Verificar si el proyecto existe
    const [postulacionExists] = await connection.query(
        "SELECT COUNT(*) as count FROM postulacion WHERE id_postulacion = ?",
        [id_postulacion],
    );

    if (postulacionExists[0].count === 0) {
      console.error("Error en la consulta SQL:", error);
      return res.status(404).json({
        success: false,
        message: "Postulación no encontrada",
      });
    }

    await connection.query(`DELETE FROM postulacion WHERE id_postulacion = ?`,
        [id_postulacion],
    );

    res.status(200).json({
      success: true,
      message: "Postulación eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar la postulación:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la postulación",
    });
  }
});

// Ruta para ...
router.post("/upload-cv", upload.single("cv"), async (req, res) => {
  const file = req.file;
  const id_usuario = req.body.id_usuario;

  console.log("Archivo recibido:", req.file);
  console.log("Cuerpo de la solicitud (req.body):", req.body);

  if (!file) {
    return res.status(400).json({error: "No se ha proporcionado ningún archivo."});
  }

  try {
    const cv_url = `/uploads/cvs/${file.filename}`;
    let extractedText = "";

    // Procesar PDF
    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    }
    // Procesar archivos Word
    else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.mimetype === "application/msword") {
      const dataBuffer = fs.readFileSync(file.path);
      const docData = await mammoth.extractRawText({buffer: dataBuffer});
      extractedText = docData.value;
    }
    // Formato no soportado
    else {
      // Limpia el archivo subido
      fs.unlinkSync(file.path);
      return res.status(400).json({error: "Formato de archivo no soportado."});
    }

    // Obtener `id_freelancer`
    const freelancerResults = await getFreelancerByUserId(id_usuario);
    if (freelancerResults.length === 0) {
      return res.status(404).json({error: "Freelancer no encontrado"});
    }

    const id_freelancer = freelancerResults[0].id_freelancer;

    console.log("Texto extraído del archivo:", extractedText);

    // Procesar el texto extraído
    const perfilData = await procesarCV(extractedText);
    perfilData.cv_url = cv_url;
    perfilData.id_freelancer = id_freelancer;

    console.log("Datos procesados para guardar en la DB:", perfilData);

    // Guardar en la base de datos
    await guardarPerfilEnDB(perfilData);

    console.log("Perfil creado exitosamente:", perfilData);

    // Enviar la respuesta final
    return res.status(201).json({message: "Perfil creado exitosamente.", cv_url});
  } catch (error) {
    console.error("Error al procesar el CV:", error);

    // Limpia el archivo subido en caso de error
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Enviar la respuesta de error
    return res.status(500).json({error: "Error al procesar el archivo."});
  }
});

// Recuperar la URL del CV desde la base de datos
router.get("/freelancer/:id/cv", async (req, res) => {
  const idFreelancer = req.params.id;

  try {
    const [result] = await pool.query(
        "SELECT cv_url FROM freelancer WHERE id_freelancer = ?",
        [idFreelancer],
    );

    if (result.length > 0) {
      res.status(200).json({cv_url: result[0].cv_url});
    } else {
      res.status(404).json({error: "Freelancer no encontrado"});
    }
  } catch (error) {
    console.error("Error al obtener la URL del CV:", error);
    res.status(500).json({error: "Error al obtener el CV"});
  }
});

// Ruta para agregar datos
router.post("/add-freelancer/:id_usuario/:itemType", async (req, res) => {
  const {id_usuario, itemType} = req.params;
  const data = req.body;

  if (!id_usuario || !itemType) {
    return res.status(400).json({message: "El ID de usuario o el tipo de elemento no están definidos."});
  }

  try {
    // Obtener freelancer
    const perfilFreelancerResults = await getFreelancerByUserId(id_usuario);
    if (perfilFreelancerResults.length === 0) {
      return res.status(404).json({error: "No se encontró el freelancer"});
    }
    const id_freelancer = perfilFreelancerResults[0].id_freelancer;

    let tableName;
    let columns = [];
    let values = [];

    // Seleccionar tabla y columnas según el itemType
    switch (itemType) {
      case "inclusionLaboral":
        tableName = "inclusion_laboral";
        columns = ["id_freelancer", "discapacidad", "registro_nacional", "pension_invalidez", "ajuste_entrevista", "tipo_discapacidad"];
        values = [id_freelancer, data.discapacidad, data.registro_nacional, data.pension_invalidez, data.ajuste_entrevista, data.tipo_discapacidad];
        break;
      case "experienciaLaboral":
        tableName = "emprendimiento";
        columns = ["id_freelancer", "emprendedor", "interesado", "ano_inicio", "mes_inicio", "sector_emprendimiento"];
        values = [id_freelancer, data.emprendedor, data.interesado, data.ano_inicio_emp, data.mes_inicio_emp, data.sector_emprendimiento];
        break;
      case "trabajoPractica":
        tableName = "trabajo_practica";
        columns = ["id_freelancer", "experiencia_laboral", "experiencia", "empresa", "cargo", "area_trabajo", "tipo_cargo", "ano_inicio", "mes_inicio", "descripcion"];
        values = [id_freelancer, data.experiencia_laboral, data.experiencia, data.empresa, data.cargo, data.area_trabajo, data.tipo_cargo, data.ano_inicio_tra, data.mes_inicio_tra, data.descripcion];
        break;
      case "formacion":
        tableName = "nivel_educacional";
        columns = ["id_freelancer", "nivel_academico", "estado"];
        values = [id_freelancer, data.nivel_academico, data.estado];
        break;
      case "educacionSuperior":
        tableName = "educacion_superior";
        columns = ["id_freelancer", "institucion", "carrera", "carrera_afin", "estado", "ano_inicio", "ano_termino"];
        values = [id_freelancer, data.institucion, data.carrera, data.carrera_afin, data.estado_carrera, data.ano_inicio_su, data.ano_termino_su];
        break;
      case "educacionBasicaMedia":
        tableName = "educacion_basica_media";
        columns = ["id_freelancer", "institucion", "tipo", "pais", "ciudad", "ano_inicio", "ano_termino"];
        values = [id_freelancer, data.institucion, data.tipo, data.pais, data.ciudad, data.ano_inicio_ba, data.ano_termino_ba];
        break;
      case "conocimientos":
        tableName = "curso";
        columns = ["id_freelancer", "nombre_curso", "institucion", "ano_inicio", "mes_inicio"];
        values = [id_freelancer, data.nombre_curso, data.institucion, data.ano_inicio_cur, data.mes_inicio_cur];
        break;
      case "idiomas":
        tableName = "idiomas";
        columns = ["id_freelancer", "idioma", "nivel"];
        values = [id_freelancer, data.idioma, data.nivel];
        break;
      case "habilidades":
        tableName = "habilidades";
        columns = ["id_freelancer", "categoria", "habilidad", "nivel"];
        values = [id_freelancer, data.categoria, data.habilidad, data.nivel];
        break;
      default:
        return res.status(400).json({message: "Tipo de elemento no reconocido."});
    }

    // Construcción de la consulta SQL
    const placeholders = columns.map(() => "?").join(", ");
    const sql = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`;

    // Ejecución de la consulta
    await pool.execute(sql, values);

    res.status(201).json({message: `${itemType} agregado correctamente.`});
  } catch (error) {
    console.error("Error al agregar datos:", error);
    res.status(500).json({message: "Error interno del servidor."});
  }
});

router.delete("/delete-idioma-habilidad/:id_usuario/:seccion/:id", async (req, res) => {
  const {id_usuario, seccion, id} = req.params;

  try {
    let query; let values;

    switch (seccion) {
      case "idiomas":
        query = "DELETE FROM idiomas WHERE id_idioma = ? AND id_freelancer = (SELECT id_freelancer FROM freelancer WHERE id_usuario = ?)";
        values = [id, id_usuario];
        break;

      case "habilidades":
        query = "DELETE FROM habilidades WHERE id_habilidad = ? AND id_freelancer = (SELECT id_freelancer FROM freelancer WHERE id_usuario = ?)";
        values = [id, id_usuario];
        break;

      default:
        return res.status(400).json({error: "Sección no válida"});
    }

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({error: "Dato no encontrado"});
    }

    res.json({mensaje: `${seccion.slice(0, -1)} eliminado exitosamente`});
  } catch (error) {
    console.error(`Error al eliminar ${seccion}:`, error);
    res.status(500).json({error: "Error al eliminar datos"});
  }
});


module.exports = router;