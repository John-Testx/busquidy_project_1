import React, { useState, useEffect } from 'react';

function PerfilFreelancerEmpresaView({ freelancer }) {
    const [activeSection, setActiveSection] = useState("informacionGeneral");
    const [progresoPerfil, setProgresoPerfil] = useState(0);

    const handleNavigation = (section) => {
        setActiveSection(section);
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    };

    const verificarDato = (dato) => (dato === null || dato === undefined || dato === "" ? false : true);

    const calcularProgreso = () => {
        let totalSecciones = 0;
        let seccionesCompletadas = 0;

        // Información General
        totalSecciones += 1;
        if (verificarDato(freelancer.antecedentesPersonales.nombres) && verificarDato(freelancer.antecedentesPersonales.apellidos)) seccionesCompletadas += 1;
        
        // Usuario
        totalSecciones += 1;
        if (verificarDato(freelancer.usuario.tipo_usuario)) seccionesCompletadas += 1;

        // Contacto
        totalSecciones += 1;
        if (verificarDato(freelancer.freelancer.correo_contacto) && verificarDato(freelancer.freelancer.telefono_contacto)) seccionesCompletadas += 1;

        // Inclusión Laboral
        totalSecciones += 1;
        if (freelancer.inclusionLaboral && freelancer.inclusionLaboral.discapacidad) seccionesCompletadas += 1;

        // Experiencia Laboral
        totalSecciones += 1;
        if (freelancer.emprendimiento && freelancer.emprendimiento.emprendedor) seccionesCompletadas += 1;
        if (freelancer.trabajoPractica && freelancer.trabajoPractica.experiencia_laboral) seccionesCompletadas += 1;

        // Formación
        totalSecciones += 3;
        if (verificarDato(freelancer.nivelEducacional?.nivel_academico)) seccionesCompletadas += 1;
        if (verificarDato(freelancer.educacionSuperior?.carrera)) seccionesCompletadas += 1;
        if (verificarDato(freelancer.educacionBasicaMedia?.tipo)) seccionesCompletadas += 1;

        // Conocimientos
        totalSecciones += 2;
        if (verificarDato(freelancer.curso?.nombre_curso)) seccionesCompletadas += 1;
        if (freelancer.idiomas && freelancer.idiomas.length > 0) seccionesCompletadas += 1;
        if (freelancer.habilidades && freelancer.habilidades.length > 0) seccionesCompletadas += 1;

        // Pretensiones
        totalSecciones += 1;
        if (verificarDato(freelancer.pretensiones?.disponibilidad) && verificarDato(freelancer.pretensiones?.renta_esperada)) seccionesCompletadas += 1;

        const progreso = (seccionesCompletadas / totalSecciones) * 100;
        setProgresoPerfil(progreso);
    };

    useEffect(() => {
        calcularProgreso();
    }, [freelancer]);

    const validarDato = (dato) => (dato === null || dato === undefined ? "Sin especificar" : dato);

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                    <img
                        src="https://via.placeholder.com/150"
                        alt="Freelancer"
                        className="w-40 h-40 rounded-full border-4 border-teal-100 object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {validarDato(freelancer.antecedentesPersonales.nombres)}{" "}
                            {validarDato(freelancer.antecedentesPersonales.apellidos)}
                        </h1>
                        <div className="space-y-2">
                            <p className="text-gray-700 flex items-center gap-2">
                                <i className="fas fa-user text-teal-600 w-5"></i>
                                <span className="font-medium">Usuario:</span>
                                <span>{validarDato(freelancer.usuario.tipo_usuario)}</span>
                            </p>
                            <p className="text-gray-700 flex items-center gap-2">
                                <i className="fas fa-map-marker-alt text-teal-600 w-5"></i>
                                <span>{validarDato(freelancer.antecedentesPersonales.ciudad)}, {validarDato(freelancer.antecedentesPersonales.comuna)}</span>
                            </p>
                            <p className="text-gray-700 flex items-center gap-2">
                                <i className="fas fa-envelope text-teal-600 w-5"></i>
                                <span className="font-medium">Contacto:</span>
                                <span className="break-all">{validarDato(freelancer.freelancer.correo_contacto)}</span>
                                <span>|</span>
                                <i className="fas fa-phone-alt text-teal-600 w-5"></i>
                                <span>{validarDato(freelancer.freelancer.telefono_contacto)}</span>
                            </p>
                            <p className="text-gray-700 flex items-center gap-2">
                                <i className="fas fa-flag text-teal-600 w-5"></i>
                                <span className="font-medium">Nacionalidad:</span>
                                <span>{validarDato(freelancer.antecedentesPersonales.nacionalidad)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Presentación Section */}
            <div id="presentacion" className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 pb-3 mb-4 border-b-2 border-teal-600">
                    Presentación
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    {freelancer.freelancer.descripcion}
                </p>
            </div>

            {/* Inclusión Laboral Section */}
            <div id="inclusionLaboral" className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 pb-3 mb-4 border-b-2 border-teal-600">
                    Inclusión Laboral
                </h2>
                {freelancer.inclusionLaboral && freelancer.inclusionLaboral.discapacidad ? (
                    <p className="text-gray-700">
                        <span className="font-semibold">Discapacidad:</span> {freelancer.inclusionLaboral.discapacidad}
                    </p>
                ) : (
                    <p className="text-gray-500 italic">No hay información de inclusión laboral registrada</p>
                )}
            </div>

            {/* Experiencia Laboral Section */}
            <div id="experienciaLaboral" className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 pb-3 mb-6 border-b-2 border-teal-600">
                    Experiencia Laboral
                </h2>
                
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 pb-2 mb-4 border-b border-teal-400">
                        Emprendimientos
                    </h3>
                    {freelancer.emprendimiento && freelancer.emprendimiento.emprendedor ? (
                        <p className="text-gray-700">
                            <span className="font-semibold">Emprendedor:</span> {freelancer.emprendimiento.emprendedor}
                        </p>
                    ) : (
                        <p className="text-gray-500 italic">No hay emprendimientos registrados</p>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-900 pb-2 mb-4 border-b border-teal-400">
                        Trabajo y Práctica
                    </h3>
                    {freelancer.trabajoPractica && freelancer.trabajoPractica.experiencia_laboral ? (
                        <p className="text-gray-700">
                            <span className="font-semibold">Experiencia laboral:</span> {freelancer.trabajoPractica.experiencia_laboral}
                        </p>
                    ) : (
                        <p className="text-gray-500 italic">No hay experiencia laboral registrada</p>
                    )}
                </div>
            </div>

            {/* Formación Section */}
            <div id="formacion" className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 pb-3 mb-6 border-b-2 border-teal-600">
                    Formación
                </h2>
                
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 pb-2 mb-4 border-b border-teal-400">
                        Nivel Educacional
                    </h3>
                    {freelancer.nivelEducacional && freelancer.nivelEducacional.nivel_academico ? (
                        <p className="text-gray-700">
                            <span className="font-semibold">Nivel académico:</span> {freelancer.nivelEducacional.nivel_academico}
                        </p>
                    ) : (
                        <p className="text-gray-500 italic">No hay nivel educacional registrado</p>
                    )}
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 pb-2 mb-4 border-b border-teal-400">
                        Educación Superior
                    </h3>
                    {freelancer.educacionSuperior && freelancer.educacionSuperior.length > 0 ? (
                        <div className="space-y-4">
                            {freelancer.educacionSuperior.map((educacion, index) => (
                                <div key={index} className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                                    <p className="text-gray-700"><span className="font-semibold">Institución:</span> {educacion.institucion}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Carrera:</span> {educacion.carrera}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Estado:</span> {educacion.estado}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Año de Inicio:</span> {educacion.ano_inicio}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Año de Término:</span> {educacion.ano_termino}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No hay educación superior registrada</p>
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-900 pb-2 mb-4 border-b border-teal-400">
                        Educación Básica y Media
                    </h3>
                    {freelancer.educacionBasicaMedia && freelancer.educacionBasicaMedia.length > 0 ? (
                        <div className="space-y-4">
                            {freelancer.educacionBasicaMedia.map((educacion, index) => (
                                <div key={index} className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                                    <p className="text-gray-700"><span className="font-semibold">Institución:</span> {educacion.institucion}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Tipo:</span> {educacion.tipo}</p>
                                    <p className="text-gray-700"><span className="font-semibold">País:</span> {educacion.pais}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Ciudad:</span> {educacion.ciudad}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Año de Inicio:</span> {educacion.ano_inicio}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Año de Término:</span> {educacion.ano_termino}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No hay educación básica y media registrada</p>
                    )}
                </div>
            </div>

            {/* Conocimientos Section */}
            <div id="conocimientos" className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 pb-3 mb-6 border-b-2 border-teal-600">
                    Conocimientos
                </h2>
                
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 pb-2 mb-4 border-b border-teal-400">
                        Cursos
                    </h3>
                    {freelancer.curso && freelancer.curso.length > 0 ? (
                        <div className="space-y-4">
                            {freelancer.curso.map((curso, index) => (
                                <div key={index} className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                                    <p className="text-gray-700"><span className="font-semibold">Nombre del Curso:</span> {curso.nombre_curso}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Institución:</span> {curso.institucion}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Año de Inicio:</span> {curso.ano_inicio}</p>
                                    <p className="text-gray-700"><span className="font-semibold">Mes de Inicio:</span> {curso.mes_inicio}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No hay cursos registrados</p>
                    )}
                </div>

                <div className="mb-6" id="idiomas">
                    <h3 className="text-lg font-semibold text-gray-900 pb-2 mb-4 border-b border-teal-400">
                        Idiomas
                    </h3>
                    {freelancer.idiomas && freelancer.idiomas.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {freelancer.idiomas.map((idioma, index) => (
                                <div key={index} className="bg-teal-50 p-3 rounded-lg border border-teal-100">
                                    <p className="text-gray-700"><span className="font-semibold">{idioma.idioma}:</span> {idioma.nivel}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No hay idiomas registrados</p>
                    )}
                </div>

                <div id="habilidades">
                    <h3 className="text-lg font-semibold text-gray-900 pb-2 mb-4 border-b border-teal-400">
                        Habilidades
                    </h3>
                    {freelancer.habilidades && freelancer.habilidades.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {freelancer.habilidades.map((habilidad, index) => (
                                <div key={index} className="bg-teal-50 p-3 rounded-lg border border-teal-100">
                                    <p className="text-gray-700"><span className="font-semibold">{habilidad.habilidad}:</span> {habilidad.nivel}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No hay habilidades registradas</p>
                    )}
                </div>
            </div>

            {/* Pretensiones Section */}
            <div id="pretensiones" className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 pb-3 mb-4 border-b-2 border-teal-600">
                    Pretensiones
                </h2>
                {freelancer.pretensiones ? (
                    <div className="space-y-3">
                        <p className="text-gray-700">
                            <span className="font-semibold">Disponibilidad:</span> {validarDato(freelancer.pretensiones.disponibilidad)}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-semibold">Renta esperada:</span> {validarDato(freelancer.pretensiones.renta_esperada)}
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No hay pretensiones registradas</p>
                )}
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Progreso del Perfil
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-3">
                    <div 
                        className="bg-teal-600 h-full transition-all duration-500 ease-out"
                        style={{ width: `${progresoPerfil}%` }}
                    ></div>
                </div>
                <p className="text-center text-lg font-semibold text-teal-600">
                    {progresoPerfil.toFixed(0)}% completado
                </p>
            </div>
        </div>
    );
}

export default PerfilFreelancerEmpresaView;