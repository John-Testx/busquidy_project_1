import React from "react";

function InfoSectionFreelancer() {
    return(
        <div className="bg-gradient-to-b from-gray-50 to-white">
           
            {/* Primera sección - Cómo funciona */}
            <div className="w-full py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-12">
                        ¿Cómo funciona nuestra plataforma?
                    </h2>
                    
                    <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 max-w-4xl mx-auto">
                        {/* Card 1 */}
                        <div className="flex-1 bg-white rounded-xl shadow-md hover:shadow-xl p-8 text-center transition-all duration-300 hover:-translate-y-2 border-t-4 border-[#07767c]">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Búsqueda simple</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Usa la barra de búsqueda para encontrar los servicios que necesitas.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="flex-1 bg-white rounded-xl shadow-md hover:shadow-xl p-8 text-center transition-all duration-300 hover:-translate-y-2 border-t-4 border-[#40E0D0]">
                            <div className="text-5xl mb-4">✔️</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Selección simple</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Elige un servicio en base a las calificaciones y comentarios.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="flex-1 bg-white rounded-xl shadow-md hover:shadow-xl p-8 text-center transition-all duration-300 hover:-translate-y-2 border-t-4 border-[#07767c]">
                            <div className="text-5xl mb-4">💳</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Pago fácil</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Paga de manera segura con nuestras opciones de pago.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Segunda sección - Información con imagen */}
            <div className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                        {/* Imagen */}
                        <div className="flex-shrink-0">
                            <img 
                                src="/images/freelancer.png" 
                                alt="Persona feliz" 
                                className="w-64 h-64 sm:w-80 sm:h-80 rounded-full object-cover shadow-2xl border-8 border-[#07767c]/10"
                            />
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 max-w-2xl">
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                                    Si buscas trabajo <span className="text-[#07767c]">¡Nuestra plataforma es tu mejor aliada!</span>
                                </h2>
                                <p className="text-xl text-gray-600 mb-6">
                                    Miles de ofertas de empleo están esperándote
                                </p>
                                
                                <h3 className="text-2xl font-semibold text-[#07767c] mb-3">
                                    Te ayudamos a encontrar un empleo mejor
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Haz que tu currículum sea visible para miles de empresas en nuestra bolsa de trabajo
                                </p>

                                {/* Lista de beneficios */}
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-start gap-3 text-gray-700">
                                        <span className="text-[#40E0D0] text-xl flex-shrink-0 mt-0.5">✔️</span>
                                        <span><strong>Registro gratuito.</strong> Encuentra tu próximo trabajo hoy.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700">
                                        <span className="text-[#40E0D0] text-xl flex-shrink-0 mt-0.5">✔️</span>
                                        <span><strong>Ofertas cada día.</strong> Empleos que se ajustan a tu perfil.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700">
                                        <span className="text-[#40E0D0] text-xl flex-shrink-0 mt-0.5">✔️</span>
                                        <span><strong>Alertas personalizadas.</strong> Crea alertas y te avisaremos.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700">
                                        <span className="text-[#40E0D0] text-xl flex-shrink-0 mt-0.5">✔️</span>
                                        <span><strong>Completa tu perfil.</strong> Gana visibilidad y destaca como profesional.</span>
                                    </li>
                                </ul>

                                {/* Botón CTA */}
                                <button className="bg-gradient-to-r from-[#07767c] to-[#05595d] hover:from-[#05595d] hover:to-[#043d42] text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                    Crea tu cuenta gratis
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoSectionFreelancer;