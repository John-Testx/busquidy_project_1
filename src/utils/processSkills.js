/**
 * Procesa el campo 'skills' que puede venir como string JSON,
 * string separada por comas, o un array.
 * @param {string|string[]|null|undefined} skills - El input de habilidades.
 * @returns {string[]} - Un array de strings de habilidades, o un array vacío.
 */
export const processSkills = (skills) => {
    if (!skills) return [];
    
    console.log("Skills recibidas para procesar:", skills);
    
    if (Array.isArray(skills)) return skills;
    
    if (typeof skills === 'string') {
        // Intenta parsear como JSON primero (para arrays tipo ["React", "Node"])
        try {
        const parsed = JSON.parse(skills);
        // Asegúrate de que lo parseado sea realmente un array
        return Array.isArray(parsed) ? parsed : [];
        } catch {
        // Si falla el JSON, asume que es una string separada por comas
        return skills.split(',')
                    .map(s => s.trim()) // Limpia espacios en blanco
                    .filter(s => s.length > 0); // Filtra strings vacías
        }
    }
  
  // Si no es ninguno de los tipos esperados, devuelve vacío
  return [];
};