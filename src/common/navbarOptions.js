/**
 * Genera las opciones del navbar según el tipo de usuario
 * @param {string} tipo_usuario - El tipo de usuario actual
 * @returns {object} Objeto con navbarOptions y profileLinks personalizados
 */
export const getNavbarOptions = (tipo_usuario) => {
    const esNatural = tipo_usuario === 'empresa_natural';
    
    // Terminología dinámica
    const terminologia = {
        singular: esNatural ? 'Tarea' : 'Proyecto',
        plural: esNatural ? 'Tareas' : 'Proyectos'
    };

    return {
        navbarOptions: [
            { 
                label: "Inicio", 
                link: "/", 
                roles: ["freelancer", "empresa", "empresa_juridico", "empresa_natural", null] 
            },
            { 
                label: "Busquidy", 
                link: "/busquidypage", 
                roles: ["freelancer", "empresa", "empresa_juridico", "empresa_natural", null] 
            },
            { 
                label: "Sobre Nosotros", 
                link: "/sobrenosotrospage", 
                roles: ["freelancer", "empresa", "empresa_juridico", "empresa_natural", null] 
            },
            { 
                label: "Precios", 
                link: "/precios", 
                roles: ["freelancer", "empresa", "empresa_juridico", "empresa_natural", null] 
            },
        ],

        profileLinks: [
            {
                label: "Mi perfil",
                link: "/freelancer-profile/view-profile",
                icon: "bi bi-person",
                roles: ["freelancer"]
            },
            {
                label: "Mis postulaciones",
                link: "/mypostulations",
                icon: "bi bi-file-earmark-text",
                roles: ["freelancer"]
            },
            {
                label: "Mi perfil",
                link: "/company-profile",
                icon: "bi bi-person",
                roles: ["empresa", "empresa_juridico", "empresa_natural"]
            },
            {
                // ✅ Usa terminología dinámica
                label: `Mis ${terminologia.plural.toLowerCase()}`,
                link: "/myprojects",
                icon: "bi bi-kanban",
                roles: ["empresa", "empresa_juridico", "empresa_natural"]
            },
            {
                label: "Panel Admin",
                link: "/adminhome",
                icon: "bi bi-speedometer2",
                roles: ["administrador"]
            },
        ],

        terminologia // Exporta también la terminología para uso en otros lugares
    };
};

// Opciones estáticas que no dependen del tipo de usuario
export const helpDropdownOptions = [
    { label: "Soporte al Cliente", link: "/soportehome" },
    { label: "Busquidy Guía", link: "/busquidyGuia" },
];

// Links de perfil de empresa (sin cambios, para retrocompatibilidad)
export const profileLinksEmpresa = [
    { label: "Mi perfil", link: "/company-profile", icon: "bi bi-person" },
    { label: "Mis publicaciones", link: "/myprojects", icon: "bi bi-file-earmark-text" },
    { label: "Mejorar Busquidy", link: "#", icon: "bi bi-arrow-up-right-circle" }
];

// Exportación por defecto para mantener compatibilidad con código antiguo
// (puedes eliminarla gradualmente)
export const navbarOptions = [
    { label: "Inicio", link: "/", roles: ["freelancer", "empresa", "empresa_juridico", "empresa_natural", null] },
    { label: "Busquidy", link: "/busquidypage", roles: ["freelancer", "empresa", "empresa_juridico", "empresa_natural", null] },
    { label: "Sobre Nosotros", link: "/sobrenosotrospage", roles: ["freelancer", "empresa", "empresa_juridico", "empresa_natural", null] },
    { label: "Precios", link: "/precios", roles: ["freelancer", "empresa", "empresa_juridico", "empresa_natural", null] },
];

export const profileLinks = [
    {
        label: "Mi perfil",
        link: "/freelancer-profile/view-profile",
        icon: "bi bi-person",
        roles: ["freelancer"]
    },
    {
        label: "Mis postulaciones",
        link: "/mypostulations",
        icon: "bi bi-file-earmark-text",
        roles: ["freelancer"]
    },
    {
        label: "Mi perfil",
        link: "/company-profile",
        icon: "bi bi-person",
        roles: ["empresa", "empresa_juridico", "empresa_natural"]
    },
    {
        label: "Mis proyectos",
        link: "/myprojects",
        icon: "bi bi-kanban",
        roles: ["empresa", "empresa_juridico", "empresa_natural"]
    },
    {
        label: "Panel Admin",
        link: "/adminhome",
        icon: "bi bi-speedometer2",
        roles: ["administrador"]
    },
];