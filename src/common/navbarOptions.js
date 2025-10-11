
export const navbarOptions = [
    { label: "Inicio", link: "/", roles: ["freelancer", "empresa", null] },
//    { label: "Freelancer", link: "/freelancer", roles: ["freelancer"] },
//    { label: "Empresa", link: "/empresa", roles: ["empresa"] },
    { label: "Busquidy", link: "/busquidypage", roles: ["freelancer", "empresa", null] },
    { label: "Sobre Nosotros", link: "/sobrenosotrospage", roles: ["freelancer", "empresa", null] },
    { label: "Comunidad", link: "/comunidadpage", roles: ["freelancer", "empresa", null] },
    // Help dropdown can be handled separately if needed
];

export const helpDropdownOptions = [
    { label: "Soporte al Cliente", link: "/soportehome" },
    { label: "Busquidy Guía", link: "/busquidyGuia" },
];

export const profileLinks = [
    {
        label: "Mi perfil",
        link: "/viewperfilfreelancer",
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
        link: "/viewperfilempresa",
        icon: "bi bi-person",
        roles: ["empresa"]
    },
    {
        label: "Mis proyectos",
        link: "/myprojects",
        icon: "bi bi-kanban",
        roles: ["empresa"]
    },
    {
        label: "Panel Admin",
        link: "/adminhome",
        icon: "bi bi-speedometer2",
        roles: ["administrador"]
    },
];


export const profileLinksEmpresa = [
    { label: "Mi perfil", link: "/viewperfilempresa", icon: "bi bi-person" },
    { label: "Mis publicaciones", link: "/myprojects", icon: "bi bi-file-earmark-text" },
    { label: "Mejorar Busquidy", link: "#", icon: "bi bi-arrow-up-right-circle" }
];