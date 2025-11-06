import React, { useEffect, useState } from "react";
import { 
  Search, 
  CheckCircle2, 
  CreditCard, 
} from 'lucide-react';
// import { getMyUsage } from "@/api/userApi";
import useAuth from "@/hooks/auth/useAuth";

function InfoSectionEmpresa() {
    const [usage, setUsage] = useState(null);
    const [loadingUsage, setLoadingUsage] = useState(true);

    const { user } = useAuth();
    const esNatural = user?.tipo_usuario === 'empresa_natural';
    
    const terminologia = {
        singular: esNatural ? 'Tarea' : 'Proyecto',
        plural: esNatural ? 'Tareas' : 'Proyectos'
    };

    // useEffect(() => {
    //     const fetchUsage = async () => {
    //         try {
    //             const response = await getMyUsage();
    //             setUsage(response.data);
    //         } catch (error) {
    //             console.error("Error al cargar uso del plan:", error);
    //         } finally {
    //             setLoadingUsage(false);
    //         }
    //     };
    //     fetchUsage();
    // }, []);

    return (
        <div className="w-full space-y-12">
            
            {/* Primera sección - Cómo funciona */}
            <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
                            ¿Cómo funciona nuestra plataforma?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Conectamos talento con oportunidades en 3 simples pasos
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Card 1 */}
                        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 text-center transition-all duration-300 hover:-translate-y-3 border-t-4 border-[#07767c] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#07767c]/5 rounded-full -mr-16 -mt-16"></div>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-[#07767c] to-[#055a5f] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <Search className="text-white" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Búsqueda simple</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Usa nuestra barra de búsqueda inteligente para encontrar los servicios que necesitas de forma rápida y precisa.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 text-center transition-all duration-300 hover:-translate-y-3 border-t-4 border-[#40E0D0] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#40E0D0]/5 rounded-full -mr-16 -mt-16"></div>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-[#40E0D0] to-[#20B0A0] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="text-white" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Selección simple</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Elige el mejor servicio basándote en calificaciones reales y comentarios verificados de otros usuarios.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 text-center transition-all duration-300 hover:-translate-y-3 border-t-4 border-[#07767c] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#07767c]/5 rounded-full -mr-16 -mt-16"></div>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-[#07767c] to-[#055a5f] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <CreditCard className="text-white" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Pago seguro</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Realiza pagos de manera 100% segura con nuestras múltiples opciones de pago protegidas.
                                </p>
                            </div>
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
                                    Recibe entregas puntuales y de alta calidad, ya sea un trabajo a corto plazo o un {terminologia.singular.toLowerCase()} complejo.
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

            {/* NUEVA SECCIÓN: Uso del Plan - ✅ ACTUALIZADA CON TERMINOLOGÍA */}
            <section className="w-full px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {loadingUsage ? (
                        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-6 h-6 border-3 border-[#07767c] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-600">Cargando información del plan...</p>
                            </div>
                        </div>
                    ) : usage && (
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#07767c] to-[#0a9199] rounded-xl flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Mi Plan</h3>
                                    <p className="text-[#07767c] font-semibold text-lg">{usage.plan_nombre}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Publicaciones de Proyectos - ✅ CON TERMINOLOGÍA */}
                                {usage.limites.publicacion_proyectos !== undefined && (
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-xl border border-blue-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-blue-900">
                                                Publicaciones de {terminologia.plural}
                                            </span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                                                usage.uso.publicacion_proyectos >= (usage.limites.publicacion_proyectos || Infinity)
                                                    ? 'bg-red-200 text-red-800'
                                                    : 'bg-green-200 text-green-800'
                                            }`}>
                                                {usage.uso.publicacion_proyectos >= (usage.limites.publicacion_proyectos || Infinity) ? 'Límite' : 'Activo'}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-blue-700">
                                                {usage.uso.publicacion_proyectos}
                                            </span>
                                            <span className="text-gray-600">/ {usage.limites.publicacion_proyectos ?? '∞'}</span>
                                        </div>
                                        <div className="mt-3 bg-white/60 rounded-full h-2 overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                                style={{ 
                                                    width: `${usage.limites.publicacion_proyectos 
                                                        ? Math.min((usage.uso.publicacion_proyectos / usage.limites.publicacion_proyectos) * 100, 100) 
                                                        : 0}%` 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Publicaciones de Tareas - ✅ MOSTRAR SOLO SI ES NATURAL */}
                                {usage.limites.publicacion_tareas !== undefined && esNatural && (
                                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-5 rounded-xl border border-green-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-green-900">
                                                Publicaciones de {terminologia.plural}
                                            </span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                                                usage.uso.publicacion_tareas >= (usage.limites.publicacion_tareas || Infinity)
                                                    ? 'bg-red-200 text-red-800'
                                                    : 'bg-green-200 text-green-800'
                                            }`}>
                                                {usage.uso.publicacion_tareas >= (usage.limites.publicacion_tareas || Infinity) ? 'Límite' : 'Activo'}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-green-700">
                                                {usage.uso.publicacion_tareas}
                                            </span>
                                            <span className="text-gray-600">/ {usage.limites.publicacion_tareas ?? '∞'}</span>
                                        </div>
                                        <div className="mt-3 bg-white/60 rounded-full h-2 overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                                                style={{ 
                                                    width: `${usage.limites.publicacion_tareas 
                                                        ? Math.min((usage.uso.publicacion_tareas / usage.limites.publicacion_tareas) * 100, 100) 
                                                        : 0}%` 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mensaje informativo */}
                            <div className="mt-6 bg-[#07767c]/5 border border-[#07767c]/20 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <svg className="w-5 h-5 text-[#07767c] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Información sobre tu plan</p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Los límites se renuevan mensualmente. Si necesitas más créditos, puedes actualizar tu plan en cualquier momento.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
}

export default InfoSectionEmpresa;