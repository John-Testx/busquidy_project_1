require("dotenv").config(); // Carga variables de entorno

const db = require("./db"); // Importar el pool de conexiones
const fs = require("fs");
const path = require("path");
const uploadsDir = path.join(__dirname, process.env.UPLOADS_DIR || "uploads/cvs");

async function testDbConnection() {
    console.log("DB_HOST:", process.env.DB_HOST); // Debería mostrar 'localhost'
    console.log("DB_USER:", process.env.DB_USER); // Debería mostrar 'root'
    console.log("DB_PASSWORD:", process.env.DB_PASSWORD); // Debería mostrar 'admin'
    console.log("DB_NAME:", process.env.DB_NAME); // Debería mostrar 'plataforma'
    try {
        // Usamos pool.query() para verificar la conexión
        const [rows] = await db.pool.query("SELECT 1 + 1 AS resultado");
        console.log("Conexión exitosa a la base de datos");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error.message);
    }
}

// Verificar si el directorio existe, si no, crearlo
// Directorio para subir archivos de CV
function cvDirectory() {
    if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, {recursive: true}); // `recursive: true` crea directorios intermedios si no existen
    console.log(`Directorio creado: ${uploadsDir}`);
    } else {
    console.log(`El directorio ya existe: ${uploadsDir}`);
    }
}


module.exports = {
    testDbConnection,
    cvDirectory
};