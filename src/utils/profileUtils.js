export const calculateCompleteness = (perfilData) => {
  if (!perfilData) return 0;
  
  let completed = 0;
  let total = 10;

  // Verificar secciones obligatorias
  if (perfilData.freelancer?.descripcion) completed++;
  if (perfilData.antecedentesPersonales?.nombres) completed++;
  if (perfilData.antecedentesPersonales?.apellidos) completed++;
  if (perfilData.inclusionLaboral) completed++;
  if (perfilData.nivelEducacional) completed++;
  if (perfilData.pretensiones) completed++;
  
  // Verificar secciones opcionales
  if (perfilData.educacionSuperior?.length > 0) completed++;
  if (perfilData.idiomas?.length > 0) completed++;
  if (perfilData.habilidades?.length > 0) completed++;
  if (perfilData.cursos?.length > 0) completed++;

  return Math.round((completed / total) * 100);
};