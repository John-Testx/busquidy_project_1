const { pool, getFreelancerByUserId } = require("../../db");

// ============================================
// ACTUALIZAR SECCIÓN ESPECÍFICA
// ============================================
const updateSection = async (req, res) => {
  const { id_usuario, section } = req.params;
  console.log("id_usuario:", id_usuario);
  console.log("seccion:", section);
  const updatedData = req.body;

  try {
    // Obtener freelancer
    const perfilFreelancerResults = await getFreelancerByUserId(id_usuario);
    if (perfilFreelancerResults.length === 0) {
      return res.status(404).json({ error: "No se encontró el freelancer" });
    }
    const id_freelancer = perfilFreelancerResults[0].id_freelancer;

    let result;

    switch (section) {
      case "informacionGeneral":
        result = await updateInformacionGeneral(updatedData, id_freelancer);
        break;

      case "presentacion":
        result = await updatePresentacion(updatedData, id_freelancer);
        break;

      case "formacion":
        result = await updateFormacion(updatedData, id_freelancer);
        break;

      case "pretensiones":
        result = await updatePretensiones(updatedData, id_freelancer);
        break;

      default:
        return res.status(400).json({ error: "Sección no válida" });
    }

    if (!result) {
      return res.status(404).json({ error: "No se encontraron datos para actualizar" });
    }

    res.json({ mensaje: "Actualización exitosa", datos: updatedData });
  } catch (error) {
    console.error(`Error al actualizar ${section}:`, error);
    res.status(500).json({ error: "Error al actualizar perfil", detalles: error.message });
  }
};

// ============================================
// AGREGAR NUEVO ELEMENTO A SECCIÓN
// ============================================
const addItem = async (req, res) => {
  const { id_usuario, itemType } = req.params;
  const data = req.body;

  if (!id_usuario || !itemType) {
    return res.status(400).json({ message: "El ID de usuario o el tipo de elemento no están definidos." });
  }

  try {
    // Obtener freelancer
    const perfilFreelancerResults = await getFreelancerByUserId(id_usuario);
    if (perfilFreelancerResults.length === 0) {
      return res.status(404).json({ error: "No se encontró el freelancer" });
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
        return res.status(400).json({ message: "Tipo de elemento no reconocido." });
    }

    // Construcción de la consulta SQL
    const placeholders = columns.map(() => "?").join(", ");
    const sql = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`;

    // Ejecución de la consulta
    await pool.execute(sql, values);

    res.status(201).json({ message: `${itemType} agregado correctamente.` });
  } catch (error) {
    console.error("Error al agregar datos:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// ============================================
// ELIMINAR IDIOMA O HABILIDAD
// ============================================
const deleteItem = async (req, res) => {
  const { id_usuario, seccion, id } = req.params;

  try {
    let query;
    let values;

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
        return res.status(400).json({ error: "Sección no válida" });
    }

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Dato no encontrado" });
    }

    res.json({ mensaje: `${seccion.slice(0, -1)} eliminado exitosamente` });
  } catch (error) {
    console.error(`Error al eliminar ${seccion}:`, error);
    res.status(500).json({ error: "Error al eliminar datos" });
  }
};

// ============================================
// FUNCIONES AUXILIARES DE ACTUALIZACIÓN
// ============================================
async function updateInformacionGeneral(updatedData, id_freelancer) {
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
  const values2 = [updatedData.correo_contacto, updatedData.telefono_contacto, id_freelancer];

  const [result1] = await pool.query(query1, values1);
  const [result2] = await pool.query(query2, values2);

  return result1.affectedRows > 0 || result2.affectedRows > 0;
}

async function updatePresentacion(updatedData, id_freelancer) {
  const query = `
    UPDATE freelancer
    SET descripcion = ?
    WHERE id_freelancer = ?
  `;
  const values = [updatedData.descripcion, id_freelancer];
  const [result] = await pool.query(query, values);

  return result.affectedRows > 0;
}

async function updateFormacion(updatedData, id_freelancer) {
  const query = `
    UPDATE nivel_educacional
    SET nivel_academico = ?, estado = ?
    WHERE id_freelancer = ?
  `;
  const values = [updatedData.nivel_academico, updatedData.estado, id_freelancer];
  const [result] = await pool.query(query, values);

  return result.affectedRows > 0;
}

async function updatePretensiones(updatedData, id_freelancer) {
  const query = `
    UPDATE pretensiones
    SET disponibilidad  = ?, renta_esperada = ?
    WHERE id_freelancer = ?
  `;
  const values = [updatedData.disponibilidad, updatedData.renta_esperada, id_freelancer];
  const [result] = await pool.query(query, values);

  return result.affectedRows > 0;
}

module.exports = {
  updateSection,
  addItem,
  deleteItem,
};