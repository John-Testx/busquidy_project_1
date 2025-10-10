// Validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar RUT chileno
function isValidRUT(rut) {
  if (!rut || typeof rut !== 'string') return false;
  
  // Limpiar el RUT
  rut = rut.replace(/[.-]/g, '').toUpperCase();
  
  if (rut.length < 2) return false;
  
  const cuerpo = rut.slice(0, -1);
  const digitoVerificador = rut.slice(-1);
  
  // Calcular dígito verificador
  let suma = 0;
  let multiplo = 2;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  
  const resto = suma % 11;
  let dvCalculado = 11 - resto;
  
  if (dvCalculado === 10) dvCalculado = 'K';
  if (dvCalculado === 11) dvCalculado = '0';
  
  return digitoVerificador == dvCalculado;
}

// Validar fecha
function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

// Validar teléfono (formato chileno)
function isValidPhone(phone) {
  const phoneRegex = /^(\+?56)?(\s)?(\d{1})(\s)?(\d{4})(\s)?(\d{4})$/;
  return phoneRegex.test(phone);
}

// Sanitizar texto para base de datos
function sanitizeText(text) {
  if (!text) return null;
  
  return text
    .replace(/[•·]/g, '-')
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '-')
    .replace(/\r\n/g, '\n')
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = {
  isValidEmail,
  isValidRUT,
  isValidDate,
  isValidPhone,
  sanitizeText
};