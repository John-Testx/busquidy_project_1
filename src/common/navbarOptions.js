export const navbarOptions = [
    // CAMBIO: Añadidos 'empresa_juridico' y 'empresa_natural'
    { label: "Inicio", link: "/", roles: ["freelancer", "empresa", "empresa_juridico", "empresa_natural", null] },
//    { label: "Freelancer", link: "/freelancer", roles: ["freelancer"] },
//    { label: "Empresa", link: "/empresa", roles: ["empresa"] },
    // CAMBIO: Añadidos 'empresa_juridico' y 'empresa_natural'
    { label: "Busquidy", link: "/busquidypage", roles: ["freelancer", "empresa", "empresa_juridico", "empresa_natural", null] },
    // CAMBIO: Añadidos 'empresa_juridico' y 'empresa_natural'
    { label: "Sobre Nosotros", link: "/sobrenosotrospage", roles: ["freelancer", "empresa", "empresa_juridico", "empresa_natural", null] },
    // CAMBIO: Añadidos 'empresa_juridico' y 'empresa_natural'
    { label: "Precios", link: "/precios", roles: ["freelancer", "empresa", "empresa_juridico", "empresa_natural", null] },
    // Help dropdown can be handled separately if needed
];

export const helpDropdownOptions = [
    { label: "Soporte al Cliente", link: "/soportehome" },
    { label: "Busquidy Guía", link: "/busquidyGuia" },
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
        // CAMBIO: Añadidos 'empresa_juridico' y 'empresa_natural'
        roles: ["empresa", "empresa_juridico", "empresa_natural"]
    },
    {
        label: "Mis proyectos",
        link: "/myprojects",
        icon: "bi bi-kanban",
        // CAMBIO: Añadidos 'empresa_juridico' y 'empresa_natural'
        roles: ["empresa", "empresa_juridico", "empresa_natural"]
    },
    {
        label: "Panel Admin",
        link: "/adminhome",
        icon: "bi bi-speedometer2",
        roles: ["administrador"]
    },
];


// Este array no tiene lógica de roles, así que no necesita cambios.
// Probablemente se usa en un componente que ya filtra por tipo de usuario.
export const profileLinksEmpresa = [
    { label: "Mi perfil", link: "/company-profile", icon: "bi bi-person" },
    { label: "Mis publicaciones", link: "/myprojects", icon: "bi bi-file-earmark-text" },
    { label: "Mejorar Busquidy", link: "#", icon: "bi bi-arrow-up-right-circle" }
];