import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
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
import MessageModal from "../MessageModal";
import ModalPagoSuscripcion from '../ModalPagoSuscripcion';
import { verifyUserProfileForPremium } from '@/api/freelancerApi';

const InfoSectionHome = ({ tipo_usuario, id_usuario }) => {
    const [showModalPagarSuscripcion, setShowModalPagarSuscripcion] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    const openModalPagarSuscripcion = async () => {
        try {
            setIsLoading(true);
            const result = await verifyUserProfileForPremium(tipo_usuario, id_usuario);
            
            if (!result.isComplete) {
                setMessage(result.message);
                setShowMessageModal(true);
                return;
            }
            
            setShowModalPagarSuscripcion(true);
        } catch (error) {
            console.error("Error al verificar el perfil:", error);
            setMessage('Ocurrió un error al verificar tu perfil. Intenta nuevamente.');
            setShowMessageModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const closeMessageModal = () => {
        setShowMessageModal(false);
    };

    useEffect(() => {
        if (!id_usuario && !tipo_usuario) {
            console.log('ID o Tipo de usuario no identificado.');
        }
    }, [id_usuario, tipo_usuario]);

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white">
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

            {/* Segunda sección - Comunidad */}
            <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
                            Únete a nuestra comunidad
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Conecta, aprende y crece junto a miles de profesionales
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Card Centro de comunidad */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                            <div className="bg-[#07767c]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                <Users className="text-[#07767c]" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Centro de la comunidad</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Descubre oportunidades para crear conexiones significativas y desarrollar tu crecimiento profesional.
                            </p>
                        </div>

                        {/* Card Foro */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                <MessageCircle className="text-blue-600" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Foro</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Únete a la conversación global para compartir consejos, mejores prácticas y apoyo entre pares.
                            </p>
                        </div>

                        {/* Card Blog */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                            <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                <BookOpen className="text-purple-600" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Blog</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Visita el blog para descubrir cómo desarrollar tu actividad o carrera de freelance.
                            </p>
                        </div>

                        {/* Card TikTok */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                            <div className="bg-pink-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                <Sparkles className="text-pink-600" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">TikTok</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                ¡Síguenos para recibir consejos, inspiración y divertirte con contenido exclusivo!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tercera sección - Busquidy+ */}
            <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#e6f7f1] via-[#f0faf6] to-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#07767c]/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#40E0D0]/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
                
                <div className="max-w-7xl mx-auto relative">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#07767c] to-[#055a5f] text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                            <Crown className="animate-pulse" size={24} />
                            <span className="text-xl font-bold">Busquidy+</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
                            La solución freelance{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#07767c] to-[#40E0D0]">
                                premium
                            </span>
                            {' '}para empresas
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Accede a herramientas exclusivas y servicios premium para llevar tu negocio al siguiente nivel
                        </p>
                    </div>

                    {/* Content Grid */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
                        {/* Features List */}
                        <div className="space-y-6">
                            <Feature
                                icon={<Shield className="text-[#07767c]" size={24} />}
                                title="Expertos de contratación especializados"
                                description="Cuenta con un gestor de cuentas dedicado para encontrar el profesional adecuado y resolver todas las necesidades de tu proyecto."
                            />
                            <Feature
                                icon={<Award className="text-[#07767c]" size={24} />}
                                title="Satisfacción garantizada"
                                description="Haz pedidos con seguridad y con reembolsos garantizados en caso de entregas insatisfactorias."
                            />
                            <Feature
                                icon={<Zap className="text-[#07767c]" size={24} />}
                                title="Herramientas de gestión avanzada"
                                description="Integra a los freelancers en tu equipo y en tus proyectos sin problemas con nuestras herramientas profesionales."
                            />
                            <Feature
                                icon={<TrendingUp className="text-[#07767c]" size={24} />}
                                title="Modelos de pago flexibles"
                                description="Paga por proyecto o elige las tarifas por hora para facilitar la colaboración a largo plazo."
                            />
                        </div>

                        {/* Image Section */}
                        <div className="relative">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                                <div className="aspect-video bg-gradient-to-br from-[#07767c]/20 to-[#40E0D0]/20 rounded-xl mb-6 flex items-center justify-center">
                                    <div className="text-center">
                                        <Crown className="text-[#07767c] mx-auto mb-4" size={64} />
                                        <p className="text-gray-600 font-medium">Imagen ilustrativa</p>
                                    </div>
                                </div>
                                
                                {/* Project Status Card */}
                                <div className="bg-gradient-to-r from-[#07767c] to-[#055a5f] rounded-xl p-6 text-white shadow-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium opacity-90">Estado del Proyecto</span>
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                                            EN PROGRESO
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold">92%</span>
                                            <span className="text-sm opacity-90">4 de 5 pasos completados</span>
                                        </div>
                                        <div className="w-full bg-white/20 rounded-full h-3">
                                            <div className="bg-white rounded-full h-3 w-[92%] transition-all duration-500"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center">
                        <button
                            onClick={() => navigate("/precios")}
                            className="px-8 py-3 bg-gradient-to-r from-[#07767c] to-[#40E0D0] text-white font-semibold rounded-lg hover:shadow-lg hover:from-[#05595d] hover:to-[#07767c] transition-all duration-300"
                            >
                            Probar Busquidy+
                        </button>
                        <p className="text-sm text-gray-600 mt-4">
                            Comienza tu prueba gratuita hoy • Sin tarjeta de crédito requerida
                        </p>
                    </div>
                </div>
            </section>

            {/* Modals */}
            {showModalPagarSuscripcion && (
                <ModalPagoSuscripcion 
                    closeModal={() => setShowModalPagarSuscripcion(false)} 
                    tipo_usuario={tipo_usuario}
                    id_usuario={id_usuario} 
                />
            )}

            {showMessageModal && (
                <MessageModal message={message} closeModal={closeMessageModal} />
            )}
        </div>
    );
};

function Feature({ icon, title, description }) {
    return (
        <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="bg-[#07767c]/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">{title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

export default InfoSectionHome;