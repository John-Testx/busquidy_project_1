const { pool, getFreelancerByUserId, guardarPerfilEnDB } = require("../../db");
const { procesarCV } = require("../../services/cvService");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");

// ============================================
// SUBIR Y PROCESAR CV
// ============================================
const uploadCV = async (req, res) => {
  const file = req.file;
  const id_usuario = req.body.id_usuario;

  console.log("Archivo recibido:", req.file);
  console.log("Cuerpo de la solicitud (req.body):", req.body);

  if (!file) {
    return res.status(400).json({ error: "No se ha proporcionado ningún archivo." });
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
    else if (
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/msword"
    ) {
      const dataBuffer = fs.readFileSync(file.path);
      const docData = await mammoth.extractRawText({ buffer: dataBuffer });
      extractedText = docData.value;
    }
    // Formato no soportado
    else {
      // Limpia el archivo subido
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: "Formato de archivo no soportado." });
    }

    // Obtener id_freelancer
    const freelancerResults = await getFreelancerByUserId(id_usuario);
    if (freelancerResults.length === 0) {
      // Limpia el archivo subido
      fs.unlinkSync(file.path);
      return res.status(404).json({ error: "Freelancer no encontrado" });
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
    return res.status(201).json({ message: "Perfil creado exitosamente.", cv_url });
  } catch (error) {
    console.error("Error al procesar el CV:", error);

    // Limpia el archivo subido en caso de error
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Enviar la respuesta de error
    return res.status(500).json({ error: "Error al procesar el archivo." });
  }
};

// ============================================
// OBTENER URL DEL CV
// ============================================
const getCVUrl = async (req, res) => {
  const idFreelancer = req.params.id;

  try {
    const [result] = await pool.query(
      "SELECT cv_url FROM freelancer WHERE id_freelancer = ?",
      [idFreelancer]
    );

    if (result.length > 0) {
      res.status(200).json({ cv_url: result[0].cv_url });
    } else {
      res.status(404).json({ error: "Freelancer no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener la URL del CV:", error);
    res.status(500).json({ error: "Error al obtener el CV" });
  }
};

module.exports = {
  uploadCV,
  getCVUrl,
};