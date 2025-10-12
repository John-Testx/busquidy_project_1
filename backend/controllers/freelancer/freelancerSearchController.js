const { pool } = require("../../db");

// ============================================
// LISTAR TODOS LOS FREELANCERS
// ============================================
const listFreelancers = async (req, res) => {
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
    const [results] = await pool.query(getFreelancerQuery);

    if (results.length === 0) {
      return res.status(404).json({ error: "No se encontraron freelancers" });
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
    return res.status(500).json({ error: "Error al obtener los freelancers" });
  }
};

// ============================================
// OBTENER PERFIL PÚBLICO DE UN FREELANCER
// ============================================
const getFreelancerPublicProfile = async (req, res) => {
  const { id } = req.params;

  // Validar que el id sea válido
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  try {
    // Obtener freelancer
    const [perfilFreelancerResults] = await pool.query(
      "SELECT * FROM freelancer WHERE id_freelancer = ?",
      [id]
    );

    if (perfilFreelancerResults.length === 0) {
      return res.status(404).json({ error: "No se encontró el freelancer" });
    }

    const id_usuario = perfilFreelancerResults[0].id_usuario;

    // Obtener usuario
    const [usuarioResults] = await pool.query(
      "SELECT * FROM usuario WHERE id_usuario = ?",
      [id_usuario]
    );

    if (usuarioResults.length === 0) {
      return res.status(404).json({ error: "No se encontró el usuario" });
    }

    // Consultar datos adicionales de las tablas relacionadas
    const [antecedentes] = await pool.query(
      "SELECT * FROM antecedentes_personales WHERE id_freelancer = ?",
      [id]
    );

    const [inclusionLaboral] = await pool.query(
      "SELECT * FROM inclusion_laboral WHERE id_freelancer = ?",
      [id]
    );

    const [emprendimiento] = await pool.query(
      "SELECT * FROM emprendimiento WHERE id_freelancer = ?",
      [id]
    );

    const [trabajoPractica] = await pool.query(
      "SELECT * FROM trabajo_practica WHERE id_freelancer = ?",
      [id]
    );

    const [nivelEducacional] = await pool.query(
      "SELECT * FROM nivel_educacional WHERE id_freelancer = ?",
      [id]
    );

    const [educacionSuperior] = await pool.query(
      "SELECT * FROM educacion_superior WHERE id_freelancer = ?",
      [id]
    );

    const [educacionBasica] = await pool.query(
      "SELECT * FROM educacion_basica_media WHERE id_freelancer = ?",
      [id]
    );

    const [idiomas] = await pool.query("SELECT * FROM idiomas WHERE id_freelancer = ?", [id]);

    const [habilidades] = await pool.query(
      "SELECT * FROM habilidades WHERE id_freelancer = ?",
      [id]
    );

    const [cursos] = await pool.query("SELECT * FROM curso WHERE id_freelancer = ?", [id]);

    const [pretensiones] = await pool.query(
      "SELECT * FROM pretensiones WHERE id_freelancer = ?",
      [id]
    );

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
    res.status(500).json({ error: "Error al obtener el perfil del freelancer" });
  }
};

module.exports = {
  listFreelancers,
  getFreelancerPublicProfile,
};