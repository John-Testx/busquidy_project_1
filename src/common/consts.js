export const optionsCategorySkills = [
        { value: "Lenguajes de Programación", label: "Lenguajes de Programación" },
        { value: "Bases de Datos", label: "Bases de Datos" },
        { value: "Desarrollo Web", label: "Desarrollo Web" },
        { value: "Desarrollo de Software", label: "Desarrollo de Software" },
        { value: "Análisis de Datos", label: "Análisis de Datos" },
        { value: "Redacción y Comunicación", label: "Redacción y Comunicación" },
        { value: "Idiomas", label: "Idiomas" },
        { value: "Herramientas de Oficina y Productividad", label: "Herramientas de Oficina y Productividad" },
        { value: "Marketing y Publicidad", label: "Marketing y Publicidad" },
        { value: "Ventas y Negociación", label: "Ventas y Negociación" },
        { value: "Gestión de Proyectos", label: "Gestión de Proyectos" },
        { value: "Diseño Gráfico", label: "Diseño Gráfico" },
        { value: "Edición de Video y Fotografía", label: "Edición de Video y Fotografía" },
        { value: "Investigación Académica", label: "Investigación Académica" },
        { value: "Habilidades de Presentación", label: "Habilidades de Presentación" },
        { value: "Resolución de Problemas", label: "Resolución de Problemas" },
        { value: "Trabajo en Equipo", label: "Trabajo en Equipo" },
        { value: "Liderazgo", label: "Liderazgo" },
        { value: "Innovación y Creatividad", label: "Innovación y Creatividad" },
        { value: "Atención al Cliente", label: "Atención al Cliente" },
        { value: "Finanzas y Contabilidad", label: "Finanzas y Contabilidad" },
        { value: "Planificación y Organización", label: "Planificación y Organización" },
        { value: "Pensamiento Crítico", label: "Pensamiento Crítico" },
        { value: "Ciencias e Ingeniería", label: "Ciencias e Ingeniería" },
        { value: "Salud y Bienestar", label: "Salud y Bienestar" },
        { value: "Educación y Enseñanza", label: "Educación y Enseñanza" },
        { value: "Derecho y Normativas", label: "Derecho y Normativas" },
        { value: "Competencias Digitales Básicas", label: "Competencias Digitales Básicas" },
    ]


export const initialFreelancerData = {
  freelancer: {
    correo_contacto: "",
    telefono_contacto: "",
    linkedin_link: "",
    descripcion_freelancer: ""
  },
  antecedentes_personales: {
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    identificacion: "",
    nacionalidad: "",
    direccion: "",
    region: "",
    ciudad_freelancer: "",
    comuna: "",
    estado_civil: ""
  },
  inclusion_laboral: {
    discapacidad: "No",
    registro_nacional: null,
    pension_invalidez: null,
    ajuste_entrevista: null,
    tipo_discapacidad: null
  },
  emprendimiento: {
    emprendedor: "No",
    interesado: null,
    ano_inicio_emprendimiento: null,
    mes_inicio_emprendimiento: null,
    sector_emprendimiento: null
  },
  trabajo_practica: {
    experiencia_laboral: "No",
    experiencia: null,
    empresa: null,
    cargo: null,
    area_trabajo: null,
    tipo_cargo: null,
    ano_inicio_trabajo: null,
    mes_inicio_trabajo: null,
    descripcion_trabajo: null
  },
  nivel_educacional: {
    nivel_academico: "",
    estado_educacional: ""
  },
  educacion_superior: {
    institucion_superior: "",
    carrera: "",
    carrera_afin: "",
    estado_superior: "",
    ano_inicio_superior: "",
    ano_termino_superior: ""
  },
  educacion_basica_media: {
    institucion_basica_media: "",
    tipo: "",
    pais: "",
    ciudad_basica_media: "",
    ano_inicio_basica_media: "",
    ano_termino_basica_media: ""
  },
  idiomas: [],
  habilidades: [],
  curso: {
    nombre_curso: "",
    institucion_curso: "",
    ano_inicio_curso: "",
    mes_inicio_curso: ""
  },
  pretensiones: {
    disponibilidad: "",
    renta_esperada: ""
  }
};



// Field definitions
  const empresaFields = [
    { label: "Nombre de la Empresa", name: "nombre_empresa" },
    { label: "Identificación Fiscal", name: "identificacion_fiscal" },
    { label: "Dirección", name: "direccion" },
    { label: "Teléfono de contacto", name: "telefono_contacto" },
    { label: "Correo de la empresa", name: "correo_empresa" },
    { label: "Página web", name: "pagina_web" },
    { label: "Sector industrial", name: "sector_industrial" },
    { label: "Descripción de la empresa", name: "descripcion" },
  ];

  const representanteFields = [
    { label: "Nombre Completo", name: "nombre_completo" },
    { label: "Cargo", name: "cargo" },
    { label: "Correo del Representante", name: "correo_representante", type: "email" },
    { label: "Teléfono del Representante", name: "telefono_representante" },
  ];