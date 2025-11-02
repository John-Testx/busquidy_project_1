import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  UserCircle, 
  Building2, 
  Briefcase, 
  FileText, 
  Search,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useAuth } from "@/hooks";
import LoginModal from "@/components/Home/Modals/LoginModal";
import LoginSecondaryModal from "@/components/Home/Modals/LoginSecondaryModal";
import RegisterModal from "@/components/Home/Modals/RegisterModal";
import SecondaryRegisterModal from "@/components/Home/Modals/SecondaryRegisterModal";

function CardSection({ userType }) {
    const navigate = useNavigate();
    
    const { 
        isAuthenticated, 
        tipo_usuario,
        handleLogin,
        handleRegister,
        errors,
        loading: authLoading
    } = useAuth();
    
    // Estados para los modales
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLoginSecondaryModal, setShowLoginSecondaryModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showSecondaryRegisterModal, setShowSecondaryRegisterModal] = useState(false);
    const [targetUserType, setTargetUserType] = useState(null);

    // Estados para los formularios
    const [loginFormData, setLoginFormData] = useState({ correo: "", contraseña: "" });
    const updateLoginFormData = (key, value) => setLoginFormData((prev) => ({ ...prev, [key]: value }));

    const [registerData, setRegisterData] = useState({
        correo: "",
        contraseña: "",
        tipoUsuario: "",
    });
    const updateRegisterData = (key, value) => {
        setRegisterData(prev => ({ ...prev, [key]: value }));
    };

    // Función para manejar clic en los botones
    const handleCardClick = (e, tipoDestino, ruta) => {
        if (isAuthenticated) {
            navigate(ruta);
            return;
        }
        e.preventDefault();
        
        setTargetUserType(tipoDestino); 
        setShowLoginModal(true);
    };

    // Función para manejar éxito de auth
    const handleAuthSuccess = () => {
        setShowLoginModal(false);
        setShowLoginSecondaryModal(false);
        setShowRegisterModal(false);
        setShowSecondaryRegisterModal(false);
        
        // Limpiar formularios
        setLoginFormData({ correo: "", contraseña: "" });
        setRegisterData({ correo: "", contraseña: "", tipoUsuario: "" });

        // Navegar según el tipo de usuario target
        if (targetUserType === 'freelancer') {
            navigate('/freelancer');
        } else if (targetUserType === 'empresa') {
            navigate('/empresa');
        }
        
        setTargetUserType(null);
    };

    const handleLoginSubmit = async () => {
        await handleLogin(loginFormData.correo, loginFormData.contraseña, () => {
            handleAuthSuccess();
        });
    };

    const handleRegisterSubmit = async () => {
        await handleRegister(
            registerData.correo,
            registerData.contraseña,
            registerData.tipoUsuario,
            () => {
                // Limpiar form de registro
                setRegisterData({ correo: "", contraseña: "", tipoUsuario: "" });
                // Cerrar modales de registro
                setShowSecondaryRegisterModal(false);
                setShowRegisterModal(false);
                // Abrir modal de login
                setShowLoginModal(true);
            }
        );
    };

    return (
        <>
            <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-[#e6f7f1] overflow-hidden">
                <div className="relative max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-[#07767c]/10 px-4 py-2 rounded-full mb-4">
                            <Sparkles size={18} className="text-[#07767c]" />
                            <span className="text-[#07767c] font-semibold text-sm">Únete a nuestra comunidad</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
                            Elige tu camino profesional
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Ya seas freelancer o empresa, tenemos las herramientas perfectas para ti
                        </p>
                    </div>

                    {/* Cards Container */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        
                        {/* Tarjeta FreeLancer */}
                        <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-[#07767c]/20">
                            <div className="relative p-8 sm:p-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#07767c] to-[#055a5f] rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                    <UserCircle className="text-white" size={32} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-[#07767c] transition-colors">
                                    FREELANCER
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-6 text-base">
                                    Busca proyectos de tu interés, publica tu CV y muestra tu perfil a miles de empresas que buscan tu talento.
                                </p>
                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <div className="w-5 h-5 bg-[#40E0D0]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Search size={12} className="text-[#07767c]" />
                                        </div>
                                        <span>Accede a proyectos ilimitados</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <div className="w-5 h-5 bg-[#40E0D0]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FileText size={12} className="text-[#07767c]" />
                                        </div>
                                        <span>Publica tu CV profesional</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <div className="w-5 h-5 bg-[#40E0D0]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <TrendingUp size={12} className="text-[#07767c]" />
                                        </div>
                                        <span>Aumenta tu visibilidad</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => handleCardClick(e, 'freelancer', '/freelancer')}
                                    className="group/btn w-full bg-gradient-to-r from-[#07767c] to-[#055a5f] hover:from-[#055a5f] hover:to-[#043d42] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-1"
                                >
                                    <span>{tipo_usuario === "freelancer" ? "Ir a mi panel" : "Comenzar como Freelancer"}</span>
                                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <div className="flex items-center justify-center gap-2 text-sm">
                                        <Users size={16} className="text-[#07767c]" />
                                        <span className="text-gray-600">
                                            Únete a <span className="font-bold text-[#07767c]">+10,000</span> freelancers
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta Empresa */}
                        <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-[#40E0D0]/20">
                            <div className="relative p-8 sm:p-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#40E0D0] to-[#20B0A0] rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                    <Building2 className="text-white" size={32} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-[#40E0D0] transition-colors">
                                    EMPRESA
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-6 text-base">
                                    Publica proyectos, encuentra freelancers talentosos y haz crecer tu negocio con los mejores profesionales.
                                </p>
                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <div className="w-5 h-5 bg-[#07767c]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Briefcase size={12} className="text-[#40E0D0]" />
                                        </div>
                                        <span>Publica proyectos ilimitados</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <div className="w-5 h-5 bg-[#07767c]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Search size={12} className="text-[#40E0D0]" />
                                        </div>
                                        <span>Encuentra freelancers verificados</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <div className="w-5 h-5 bg-[#07767c]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <TrendingUp size={12} className="text-[#40E0D0]" />
                                        </div>
                                        <span>Impulsa tu crecimiento</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => handleCardClick(e, 'empresa', '/empresa')}
                                    className="group/btn w-full bg-gradient-to-r from-[#40E0D0] to-[#20B0A0] hover:from-[#20B0A0] hover:to-[#10A090] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-1"
                                >
                                    <span>
                                        {
                                            (tipo_usuario === "empresa" || tipo_usuario === "empresa_juridico" || tipo_usuario === "empresa_natural")
                                            ? "Ir a mi panel" 
                                            : "Comenzar como Empresa"
                                        }
                                    </span>
                                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <div className="flex items-center justify-center gap-2 text-sm">
                                        <Building2 size={16} className="text-[#40E0D0]" />
                                        <span className="text-gray-600">
                                            Únete a <span className="font-bold text-[#40E0D0]">+5,000</span> empresas
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center mt-16">
                        <p className="text-gray-600 mb-4">
                            ¿No estás seguro cuál opción elegir?
                        </p>
                        <button className="text-[#07767c] font-semibold hover:text-[#055a5f] transition-colors inline-flex items-center gap-2 group">
                            Compara las opciones
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* MODALES */}
            {showLoginModal && (
                <LoginModal
                    onClose={() => {
                        setShowLoginModal(false);
                        setTargetUserType(null);
                        setLoginFormData({ correo: "", contraseña: "" });
                    }}
                    onOpenSecondary={() => {
                        setShowLoginModal(false);
                        setShowLoginSecondaryModal(true); // ✅ ABRE LoginSecondaryModal
                    }}
                    onOpenRegister={() => {
                        setShowLoginModal(false);
                        setLoginFormData({ correo: "", contraseña: "" });
                        setShowRegisterModal(true);
                    }}
                />
            )}

            {showLoginSecondaryModal && (
                <LoginSecondaryModal
                    onClose={() => {
                        setShowLoginSecondaryModal(false);
                        setTargetUserType(null);
                        setLoginFormData({ correo: "", contraseña: "" });
                    }}
                    onBack={() => {
                        setShowLoginSecondaryModal(false);
                        setShowLoginModal(true);
                    }}
                    formData={loginFormData}
                    setFormData={updateLoginFormData}
                    handleLogin={handleLoginSubmit}
                    loading={authLoading}
                    errors={errors}
                    onOpenRegister={() => {
                        setShowLoginSecondaryModal(false);
                        setLoginFormData({ correo: "", contraseña: "" });
                        setShowRegisterModal(true);
                    }}
                />
            )}

            {showRegisterModal && (
                <RegisterModal
                    onClose={() => {
                        setShowRegisterModal(false);
                        setTargetUserType(null);
                        setRegisterData({ correo: "", contraseña: "", tipoUsuario: "" });
                    }}
                    onOpenSecondary={() => {
                        setShowRegisterModal(false);
                        setShowSecondaryRegisterModal(true);
                    }}
                    onOpenLogin={() => {
                        setShowRegisterModal(false);
                        setRegisterData({ correo: "", contraseña: "", tipoUsuario: "" });
                        setShowLoginModal(true);
                    }}
                />
            )}

            {showSecondaryRegisterModal && (
                <SecondaryRegisterModal
                    onClose={() => {
                        setShowSecondaryRegisterModal(false);
                        setTargetUserType(null);
                        setRegisterData({ correo: "", contraseña: "", tipoUsuario: "" });
                    }}
                    onBack={() => {
                        setShowSecondaryRegisterModal(false);
                        setShowRegisterModal(true);
                    }}
                    formData={registerData}
                    setFormData={updateRegisterData}
                    handleRegister={handleRegisterSubmit}
                    loading={authLoading}
                    errors={errors}
                    onOpenLogin={() => {
                        setShowSecondaryRegisterModal(false);
                        setRegisterData({ correo: "", contraseña: "", tipoUsuario: "" });
                        setShowLoginModal(true);
                    }}
                />
            )}
        </>
    );
}

export default CardSection;