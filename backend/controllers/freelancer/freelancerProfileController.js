const {
  pool,
  getUserById,
  getFreelancerByUserId,
} = require("../../db");

// ============================================
// VERIFICAR SI EXISTE PERFIL
// ============================================
const checkProfileExists = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    // Verificar usuario
    const userCheckResults = await getUserById(id_usuario);
    if (userCheckResults.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtener id_freelancer
    const freelancerResults = await getFreelancerByUserId(id_usuario);
    if (freelancerResults.length === 0) {
      return res.status(404).json({ error: "Freelancer no encontrado" });
    }

    const id_freelancer = freelancerResults[0].id_freelancer;

    // Verificar antecedentes personales
    const [antecedentesResults] = await pool.query(
      "SELECT * FROM antecedentes_personales WHERE id_freelancer = ?",
      [id_freelancer]
    );

    const isPerfilIncompleto = antecedentesResults.length === 0;

    res.json({ isPerfilIncompleto });
  } catch (error) {
    console.error("Error al verificar el perfil del freelancer:", error);
    res.status(500).json({ error: "Error al verificar el perfil del freelancer" });
  }
};

// ============================================
// OBTENER PERFIL COMPLETO (PROPIO)
// ============================================
const getOwnProfile = async (req, res) => {
  const { id_usuario } = req.params;

  if (!id_usuario || isNaN(id_usuario)) {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  try {
    // Verificar usuario
    const perfilUsuarioResults = await getUserById(id_usuario);
    if (perfilUsuarioResults.length === 0) {
      return res.status(404).json({ error: "No se encontró el usuario" });
    }

    // Obtener freelancer
    const perfilFreelancerResults = await getFreelancerByUserId(id_usuario);
    if (perfilFreelancerResults.length === 0) {
      return res.status(404).json({ error: "No se encontró el freelancer" });
    }
    const id_freelancer = perfilFreelancerResults[0].id_freelancer;

    // Obtener datos de todas las tablas relacionadas
    const profileData = await getCompleteProfileData(id_freelancer);

    // Consolidar respuesta
    res.json({
      usuario: perfilUsuarioResults[0],
      freelancer: perfilFreelancerResults[0],
      ...profileData,
    });
  } catch (error) {
    console.error("Error al obtener el perfil del freelancer:", error);
    res.status(500).json({ error: "Error al obtener el perfil del freelancer" });
  }
};

// ============================================
// CREAR PERFIL COMPLETO
// ============================================
const createProfile = async (req, res) => {
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

  if (!id_usuario) {
    console.log("Error: id_usuario es undefined o null");
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  try {
    // Verificar usuario
    const userCheckResults = await getUserById(id_usuario);
    if (userCheckResults.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    console.log("Usuario encontrado");

    // Obtener id_freelancer
    const freelancerResults = await getFreelancerByUserId(id_usuario);
    if (freelancerResults.length === 0) {
      return res.status(404).json({ error: "Freelancer no encontrado" });
    }

    const id_freelancer = freelancerResults[0].id_freelancer;
    console.log("ID de freelancer obtenido:", id_freelancer);

    // Actualizar descripción en la tabla freelancer
    await pool.query(
      `UPDATE freelancer 
       SET correo_contacto = ?, telefono_contacto = ?, linkedin_link = ?, descripcion = ? 
       WHERE id_freelancer = ?`,
      [
        freelancer.correo_contacto,
        freelancer.telefono_contacto,
        freelancer.linkedin_link,
        freelancer.descripcion_freelancer,
        id_freelancer,
      ]
    );

    // Insertar antecedentes personales
    await pool.query(
      `INSERT INTO antecedentes_personales 
       (id_freelancer, nombres, apellidos, fecha_nacimiento, identificacion, nacionalidad, 
        direccion, region, ciudad, comuna, estado_civil)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_freelancer,
        antecedentes_personales.nombres,
        antecedentes_personales.apellidos,
        antecedentes_personales.fecha_nacimiento,
        antecedentes_personales.identificacion,
        antecedentes_personales.nacionalidad,
        antecedentes_personales.direccion,
        antecedentes_personales.region,
        antecedentes_personales.ciudad_freelancer,
        antecedentes_personales.comuna,
        antecedentes_personales.estado_civil,
      ]
    );

    // Insertar inclusión laboral
    await pool.query(
      `INSERT INTO inclusion_laboral 
       (id_freelancer, discapacidad, registro_nacional, pension_invalidez, ajuste_entrevista, tipo_discapacidad)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id_freelancer,
        inclusion_laboral.discapacidad,
        inclusion_laboral.registro_nacional,
        inclusion_laboral.pension_invalidez,
        inclusion_laboral.ajuste_entrevista,
        inclusion_laboral.tipo_discapacidad,
      ]
    );

    // Insertar emprendimiento
    await pool.query(
      `INSERT INTO emprendimiento 
       (id_freelancer, emprendedor, interesado, ano_inicio, mes_inicio, sector_emprendimiento)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id_freelancer,
        emprendimiento.emprendedor,
        emprendimiento.interesado,
        emprendimiento.ano_inicio_emprendimiento,
        emprendimiento.mes_inicio_emprendimiento,
        emprendimiento.sector_emprendimiento,
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
        trabajo_practica.experiencia_laboral,
        trabajo_practica.experiencia,
        trabajo_practica.empresa,
        trabajo_practica.cargo,
        trabajo_practica.area_trabajo,
        trabajo_practica.tipo_cargo,
        trabajo_practica.ano_inicio_trabajo,
        trabajo_practica.mes_inicio_trabajo,
        trabajo_practica.descripcion_trabajo,
      ]
    );

    // Insertar nivel educacional
    await pool.query(
      `INSERT INTO nivel_educacional (id_freelancer, nivel_academico, estado)
       VALUES (?, ?, ?)`,
      [id_freelancer, nivel_educacional.nivel_academico, nivel_educacional.estado_educacional]
    );

    // Insertar educación superior
    await pool.query(
      `INSERT INTO educacion_superior 
       (id_freelancer, institucion, carrera, carrera_afin, estado, ano_inicio, ano_termino)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id_freelancer,
        educacion_superior.institucion_superior,
        educacion_superior.carrera,
        educacion_superior.carrera_afin,
        educacion_superior.estado_superior,
        educacion_superior.ano_inicio_superior,
        educacion_superior.ano_termino_superior,
      ]
    );

    // Insertar educación básica/media
    await pool.query(
      `INSERT INTO educacion_basica_media 
       (id_freelancer, institucion, tipo, pais, ciudad, ano_inicio, ano_termino)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id_freelancer,
        educacion_basica_media.institucion_basica_media,
        educacion_basica_media.tipo,
        educacion_basica_media.pais,
        educacion_basica_media.ciudad_basica_media,
        educacion_basica_media.ano_inicio_basica_media,
        educacion_basica_media.ano_termino_basica_media,
      ]
    );

    // Insertar múltiples idiomas
    if (idiomas && idiomas.length > 0) {
      const idiomaPromises = idiomas.map((idioma) =>
        pool.query(
          `INSERT INTO idiomas (id_freelancer, idioma, nivel) VALUES (?, ?, ?)`,
          [id_freelancer, idioma.idioma, idioma.nivel_idioma]
        )
      );
      await Promise.all(idiomaPromises);
    }

    // Insertar múltiples habilidades
    if (habilidades && habilidades.length > 0) {
      const habilidadPromises = habilidades.map((habilidad) =>
        pool.query(
          `INSERT INTO habilidades (id_freelancer, categoria, habilidad, nivel) VALUES (?, ?, ?, ?)`,
          [id_freelancer, habilidad.categoria, habilidad.habilidad, habilidad.nivel_habilidad]
        )
      );
      await Promise.all(habilidadPromises);
    }

    // Insertar curso
    await pool.query(
      `INSERT INTO curso (id_freelancer, nombre_curso, institucion, ano_inicio, mes_inicio) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        id_freelancer,
        curso.nombre_curso,
        curso.institucion_curso,
        curso.ano_inicio_curso,
        curso.mes_inicio_curso,
      ]
    );

    // Insertar pretensiones
    await pool.query(
      `INSERT INTO pretensiones (id_freelancer, disponibilidad, renta_esperada) 
       VALUES (?, ?, ?)`,
      [id_freelancer, pretensiones.disponibilidad, pretensiones.renta_esperada]
    );

    console.log("Perfil freelancer creado exitosamente");
    res.status(201).json({ message: "Perfil de freelancer creado exitosamente" });
  } catch (err) {
    console.error("Error al crear el perfil:", err);
    res.status(500).json({ error: "Error al crear el perfil de freelancer" });
  }
};

// ============================================
// ACTUALIZAR PERFIL (Legacy - compatibilidad)
// ============================================
const updateProfileLegacy = async (req, res) => {
  const { id } = req.params;
  const { perfilFreelancer, perfilUsuario } = req.body;

  try {
    if (perfilFreelancer) {
      await pool.query(
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
      await pool.query(`UPDATE usuario SET correo = ? WHERE id = ?`, [perfilUsuario.correo, id]);
    }

    res.json({ message: "Perfil de freelancer actualizado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando perfil" });
  }
};

// ============================================
// FUNCIÓN AUXILIAR: Obtener datos completos
// ============================================
async function getCompleteProfileData(id_freelancer) {
  const [antecedentes] = await pool.query(
    "SELECT * FROM antecedentes_personales WHERE id_freelancer = ?",
    [id_freelancer]
  );

  const [inclusionLaboral] = await pool.query(
    "SELECT * FROM inclusion_laboral WHERE id_freelancer = ?",
    [id_freelancer]
  );

  const [emprendimiento] = await pool.query(
    "SELECT * FROM emprendimiento WHERE id_freelancer = ?",
    [id_freelancer]
  );

  const [trabajoPractica] = await pool.query(
    "SELECT * FROM trabajo_practica WHERE id_freelancer = ?",
    [id_freelancer]
  );

  const [nivelEducacional] = await pool.query(
    "SELECT * FROM nivel_educacional WHERE id_freelancer = ?",
    [id_freelancer]
  );

  const [educacionSuperior] = await pool.query(
    "SELECT * FROM educacion_superior WHERE id_freelancer = ?",
    [id_freelancer]
  );

  const [educacionBasica] = await pool.query(
    "SELECT * FROM educacion_basica_media WHERE id_freelancer = ?",
    [id_freelancer]
  );

  const [idiomas] = await pool.query("SELECT * FROM idiomas WHERE id_freelancer = ?", [
    id_freelancer,
  ]);

  const [habilidades] = await pool.query("SELECT * FROM habilidades WHERE id_freelancer = ?", [
    id_freelancer,
  ]);

  const [cursos] = await pool.query("SELECT * FROM curso WHERE id_freelancer = ?", [
    id_freelancer,
  ]);

  const [pretensiones] = await pool.query(
    "SELECT * FROM pretensiones WHERE id_freelancer = ?",
    [id_freelancer]
  );

  return {
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
  };
}

module.exports = {
  checkProfileExists,
  getOwnProfile,
  createProfile,
  updateProfileLegacy,
};