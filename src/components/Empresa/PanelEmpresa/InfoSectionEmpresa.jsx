import React from "react";

function InfoSectionEmpresa() {
    return (
        <div className="w-full space-y-12">
            
            {/* Primera sección: ¿Cómo funciona? */}
            <section className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white rounded-2xl">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
                        ¿Cómo funciona nuestra plataforma?
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        
                        {/* Card 1: Búsqueda simple */}
                        <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 text-center border border-gray-100 hover:border-[#07767c]/30 hover:-translate-y-2">
                            <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[#07767c]/10 to-[#07767c]/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <span className="text-5xl">🔍</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Búsqueda simple
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Usa la barra de búsqueda para encontrar los servicios que necesitas.
                            </p>
                        </div>
                        
                        {/* Card 2: Selección simple */}
                        <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 text-center border border-gray-100 hover:border-[#07767c]/30 hover:-translate-y-2">
                            <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[#07767c]/10 to-[#07767c]/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <span className="text-5xl">✔️</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Selección simple
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Elige un servicio en base a las calificaciones y comentarios.
                            </p>
                        </div>
                        
                        {/* Card 3: Pago fácil */}
                        <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 text-center border border-gray-100 hover:border-[#07767c]/30 hover:-translate-y-2">
                            <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[#07767c]/10 to-[#07767c]/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <span className="text-5xl">💳</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Pago fácil
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Paga de manera segura con nuestras opciones de pago.
                            </p>
                        </div>
                        
                    </div>
                </div>
            </section>

            {/* Segunda sección: Freelancers competentes */}
            <section className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-[#07767c]/5 via-white to-[#07767c]/5 rounded-2xl">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12 leading-tight">
                        Freelancers competentes en todos los campos a solo un click
                    </h2>
                    
                    <div className="space-y-6">
                        
                        {/* Item 1: Trabajo de calidad */}
                        <div className="group flex items-start gap-4 sm:gap-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-[#07767c] hover:border-l-8">
                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#07767c] to-[#0a474f] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg 
                                    className="w-6 h-6 text-white" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M5 13l4 4L19 7" 
                                    />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                    Trabajo de calidad – eficiente y confiable
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                    Recibe entregas puntuales y de alta calidad, ya sea un trabajo a corto plazo o un proyecto complejo.
                                </p>
                            </div>
                        </div>
                        
                        {/* Item 2: Seguridad */}
                        <div className="group flex items-start gap-4 sm:gap-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-[#07767c] hover:border-l-8">
                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#07767c] to-[#0a474f] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg 
                                    className="w-6 h-6 text-white" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                    />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                    Seguridad en cada pedido
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                    Pagos protegidos mediante tecnología SSL. Las transacciones no se liberan hasta que se apruebe la entrega.
                                </p>
                            </div>
                        </div>
                        
                        {/* Item 3: Locales o globales */}
                        <div className="group flex items-start gap-4 sm:gap-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-[#07767c] hover:border-l-8">
                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#07767c] to-[#0a474f] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg 
                                    className="w-6 h-6 text-white" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                    />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                    Locales o globales
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                    Trabaja con expertos de habla español o con talento profesional internacional, de acuerdo a tus preferencias y requisitos.
                                </p>
                            </div>
                        </div>
                        
                        {/* Item 4: Soporte 24/7 */}
                        <div className="group flex items-start gap-4 sm:gap-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-[#07767c] hover:border-l-8">
                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#07767c] to-[#0a474f] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <svg 
                                    className="w-6 h-6 text-white" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" 
                                    />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                    24/7 – soporte continuo a cualquier hora del día
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                    ¿Tienes alguna pregunta? Nuestro equipo de soporte está disponible a cualquier hora del día, en todo momento y en todo lugar.
                                </p>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </section>

        </div>
    );
}

export default InfoSectionEmpresa;