import React from "react";
import { 
  Search, 
  CheckCircle2, 
  CreditCard, 
  Users, 
  MessageCircle, 
  BookOpen, 
  Sparkles,
  Crown,
  Shield,
  Zap,
  TrendingUp,
  Award,
  ArrowRight
} from 'lucide-react';

function InfoSectionFreelancer() {
    return(
        <div className="bg-gradient-to-b from-gray-50 to-white">
           
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