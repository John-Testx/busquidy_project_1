import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { getNavbarOptions, helpDropdownOptions } from "@/common/navbarOptions";
import ProfileCircle from "../ProfileCircle";
import NotificationIcon from '@/components/Notifications/NotificationIcon';
import { getUserInitials } from "@/common/utils";
import { checkProfileExists } from "@/api/freelancerApi";

// ✅ IMPORTAR LOS MODALES MEJORADOS
import LoginModal from "../Auth/Modals/LoginModal";
import LoginSecondaryModal from "../Auth/Modals/LoginSecondaryModal";
import RegisterModal from "../Auth/Modals/RegisterModal";
import EmailVerificationModal from "../Auth/Modals/EmailVerificationModal";
import SecondaryRegisterModal from "../Auth/Modals/SecondaryRegisterModal";
import MessageModal from "../MessageModal";

import { 
    Menu, 
    X, 
    ChevronDown, 
    HelpCircle, 
    LogOut,
    MessageSquare,
    MessageCircle
} from 'lucide-react';

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const { 
        isAuthenticated, 
        tipo_usuario, 
        id_usuario,
        handleLogin,
        handleRegister,
        logout,
        errors,
        loading,
        message,
        clearMessage
    } = useAuth();

    const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);
    const { navbarOptions: navOptions, profileLinks: dynamicProfileLinks } = getNavbarOptions(tipo_usuario);

    // ✅ ESTADOS DE MODALES
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLoginSecondaryModal, setShowLoginSecondaryModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [showSecondaryRegisterModal, setShowSecondaryRegisterModal] = useState(false);
    
    // ✅ ESTADOS DE DATOS
    const [verifiedEmail, setVerifiedEmail] = useState('');
    const [loginFormData, setLoginFormData] = useState({ correo: '', contraseña: '' });
    const [registerFormData, setRegisterFormData] = useState({
        correo: '',
        contraseña: '',
        confirmarContraseña: '',
        tipoUsuario: ''
    });

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHelpDropdownOpen, setIsHelpDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    const profileMenuRef = useRef(null);
    const helpMenuRef = useRef(null);

    // Verificar perfil cuando el usuario esté autenticado
    useEffect(() => {
        const fetchProfileStatus = async () => {
            if (isAuthenticated && id_usuario && tipo_usuario === 'freelancer') {
                try {
                    const response = await checkProfileExists(id_usuario);
                    setIsPerfilIncompleto(response.isPerfilIncompleto);
                } catch (err) {
                    console.error("Error verificando perfil:", err);
                }
            }
        };
        
        fetchProfileStatus();
    }, [id_usuario, isAuthenticated, tipo_usuario]);

    // ✅ FUNCIONES DE ACTUALIZACIÓN DE FORMULARIOS
    const updateLoginFormData = (field, value) => {
        setLoginFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateRegisterFormData = (field, value) => {
        setRegisterFormData(prev => ({ ...prev, [field]: value }));
    };

    const clearLoginForm = () => {
        setLoginFormData({ correo: '', contraseña: '' });
    };

    const clearRegisterForm = () => {
        setRegisterFormData({ correo: '', contraseña: '', confirmarContraseña: '', tipoUsuario: '' });
        setVerifiedEmail('');
    };

    // ✅ HANDLERS DE LOGIN
    const handleLoginSubmit = async () => {
        await handleLogin(
            loginFormData.correo,
            loginFormData.contraseña,
            (tipoUsuario) => {
                setShowLoginSecondaryModal(false);
                setShowLoginModal(false);
                clearLoginForm();
                
                // Redirigir según tipo de usuario
                if (tipoUsuario === 'freelancer') {
                    navigate('/freelancer');
                } else if (tipoUsuario === 'empresa_juridico' || tipoUsuario === 'empresa_natural') {
                    navigate('/empresa');
                } else if (tipoUsuario === 'administrador') {
                    navigate('/adminhome');
                }
            }
        );
    };

    // ✅ HANDLERS DE REGISTRO
    const handleRegisterSubmit = async () => {
        // Validar que las contraseñas coincidan
        if (registerFormData.contraseña !== registerFormData.confirmarContraseña) {
            alert('Las contraseñas no coinciden');
            return;
        }

        await handleRegister(
            verifiedEmail,
            registerFormData.contraseña,
            registerFormData.tipoUsuario,
            () => {
                setShowSecondaryRegisterModal(false);
                clearRegisterForm();
            }
        );
    };

    // ✅ HANDLER CUANDO EMAIL ES VERIFICADO
    const handleEmailVerified = (email) => {
        setVerifiedEmail(email);
        setShowEmailVerification(false);
        setShowSecondaryRegisterModal(true);
    };

    const handleCloseMessageModal = () => {
        const messageType = message.type;
        clearMessage();
        
        if (messageType === 'success') {
            if (tipo_usuario === 'empresa_juridico' || tipo_usuario === 'empresa_natural') {
                navigate('/empresa');
            } else if (tipo_usuario === 'freelancer') {
                navigate('/freelancer');
            } else {
                navigate('/');
            }
        }
    };

    const toggleProfileMenu = () => setIsProfileMenuOpen(prev => !prev);
    const toggleHelpDropdown = () => setIsHelpDropdownOpen(!isHelpDropdownOpen);
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setIsProfileMenuOpen(false);
        clearLoginForm();
        clearRegisterForm();
        navigate("/");
    };

    // Filtrar links de perfil según roles y estado del perfil
    const filteredProfileLinks = dynamicProfileLinks.filter(link => {
        if (!link.roles.includes(tipo_usuario)) return false;
        
        if (tipo_usuario === 'freelancer' && isPerfilIncompleto) {
            const restrictedLinks = [
                '/freelancer-profile/my-postulations',
                '/freelancer-profile/availability'
            ];
            return !restrictedLinks.includes(link.link);
        }
        
        return true;
    });

    const handleRestrictedLinkClick = (e, link) => {
        if (tipo_usuario === 'freelancer' && isPerfilIncompleto) {
            const restrictedLinks = [
                '/freelancer-profile/my-postulations',
                '/freelancer-profile/availability'
            ];
            
            if (restrictedLinks.includes(link.link)) {
                e.preventDefault();
                alert('Debes completar tu perfil antes de acceder a esta sección');
                navigate('/freelancer-profile/view-profile');
            }
        }
    };

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
            if (helpMenuRef.current && !helpMenuRef.current.contains(event.target)) {
                setIsHelpDropdownOpen(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const userInitials = getUserInitials();

    return (
        console.log("Rendering Navbar with tipo_usuario:", tipo_usuario),
        <header 
            className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/95 backdrop-blur-md shadow-lg' 
                    : 'bg-white shadow-md'
            }`}
        >
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center h-20 lg:h-24 gap-8">

                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0">
                        <Link 
                            to="/" 
                            className="relative inline-flex items-center justify-center group h-20 sm:h-24 lg:h-28"
                        >
                            <img 
                                src="/images/Busquidy.png" 
                                alt="Busquidy Logo" 
                                className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {navOptions
                            .filter(opt => opt.roles.includes(tipo_usuario) || opt.roles.includes(null))
                            .map((opt) => (
                                <Link
                                    key={opt.link}
                                    to={opt.link}
                                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group ${
                                        isActive(opt.link)
                                            ? 'text-[#07767c] bg-[#07767c]/10'
                                            : 'text-gray-700 hover:text-[#07767c] hover:bg-gray-50'
                                    }`}
                                >
                                    {opt.label}
                                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#07767c] transition-all duration-300 ${
                                        isActive(opt.link) ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                                    }`}></span>
                                </Link>
                            ))}

                        {/* Help Dropdown */}
                        <div className="relative" ref={helpMenuRef}>
                            <button 
                                onClick={toggleHelpDropdown}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                                    isHelpDropdownOpen 
                                        ? 'text-[#07767c] bg-[#07767c]/10' 
                                        : 'text-gray-700 hover:text-[#07767c] hover:bg-gray-50'
                                }`}
                            >
                                <HelpCircle size={18} />
                                <span>¡Ayuda!</span>
                                <ChevronDown 
                                    size={16} 
                                    className={`transition-transform duration-300 ${
                                        isHelpDropdownOpen ? 'rotate-180' : ''
                                    }`} 
                                />
                            </button>

                            {isHelpDropdownOpen && (
                                <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {helpDropdownOptions.map((option, index) => (
                                        <React.Fragment key={option.link}>
                                            <Link 
                                                to={option.link}
                                                onClick={() => setIsHelpDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#07767c]/5 hover:text-[#07767c] transition-colors"
                                            >
                                                {option.label === "Soporte al Cliente" ? (
                                                    <MessageSquare size={18} />
                                                ) : (
                                                    <HelpCircle size={18} />
                                                )}
                                                <span>{option.label}</span>
                                            </Link>
                                            {index === 0 && <div className="h-px bg-gray-100 my-1"></div>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Right Section */}
                    <div className="hidden lg:flex items-center gap-3 ml-auto">
                        {!isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => setShowLoginModal(true)}
                                    className="px-5 py-2.5 text-sm font-semibold text-[#07767c] bg-white border-2 border-[#07767c]/30 rounded-lg hover:bg-[#07767c]/5 hover:border-[#07767c]/50 transition-all duration-300"
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    onClick={() => setShowRegisterModal(true)}
                                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#07767c] to-[#055a5f] rounded-lg hover:from-[#055a5f] hover:to-[#043d42] shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Registrarse
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link 
                                    to="/chat" 
                                    className="p-2 text-gray-600 hover:text-[#07767c] hover:bg-gray-50 rounded-lg transition-colors relative"
                                    title="Mensajes"
                                >
                                    <MessageCircle size={20} />
                                    {/* Opcional: Si quisieras poner un badge de mensajes no leídos en el futuro */}
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </Link>
                                <NotificationIcon />

                                <div className="relative" ref={profileMenuRef}>
                                    <button 
                                        onClick={toggleProfileMenu}
                                        className="flex items-center gap-2 group"
                                    >
                                        <ProfileCircle userInitials={userInitials} />
                                        <ChevronDown 
                                            size={16} 
                                            className={`text-gray-600 transition-transform duration-300 ${
                                                isProfileMenuOpen ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>

                                    {isProfileMenuOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-semibold text-gray-800 truncate">
                                                    {userInitials}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5 capitalize">
                                                    {tipo_usuario}
                                                </p>
                                            </div>

                                            <div className="py-2">
                                                {filteredProfileLinks.map(link => (
                                                    <Link 
                                                        key={link.link}
                                                        to={link.link} 
                                                        onClick={(e) => {
                                                            handleRestrictedLinkClick(e, link);
                                                            setIsProfileMenuOpen(false);
                                                        }}
                                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#07767c]/5 hover:text-[#07767c] transition-colors"
                                                    >
                                                        <i className={`${link.icon} text-lg`}></i>
                                                        <span>{link.label}</span>
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className="border-t border-gray-100 pt-2">
                                                <button 
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut size={18} />
                                                    <span>Cerrar sesión</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 text-gray-700 hover:text-[#07767c] hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
                    <div className="px-4 py-4 space-y-1">
                        {navOptions
                            .filter(opt => opt.roles.includes(tipo_usuario) || opt.roles.includes(null))
                            .map((opt) => (
                                <Link
                                    key={opt.link}
                                    to={opt.link}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                                        isActive(opt.link)
                                            ? 'text-[#07767c] bg-[#07767c]/10'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {opt.label}
                                </Link>
                            ))}

                        <div className="pt-2 border-t border-gray-100">
                            <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Ayuda</p>
                            {helpDropdownOptions.map(option => (
                                <Link 
                                    key={option.link}
                                    to={option.link}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                    {option.label === "Soporte al Cliente" ? (
                                        <MessageSquare size={18} />
                                    ) : (
                                        <HelpCircle size={18} />
                                    )}
                                    <span>{option.label}</span>
                                </Link>
                            ))}
                        </div>
                        <Link 
                            to="/chat"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                        >
                            <MessageCircle size={18} />
                            <span>Mensajes</span>
                        </Link>

                        <div className="pt-4 border-t border-gray-100 space-y-2">
                            {!isAuthenticated ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setShowLoginModal(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-3 text-sm font-semibold text-[#07767c] bg-white border-2 border-[#07767c]/30 rounded-lg hover:bg-[#07767c]/5 transition-all"
                                    >
                                        Iniciar Sesión
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowRegisterModal(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#07767c] to-[#055a5f] rounded-lg shadow-md"
                                    >
                                        Registrarse
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="px-4 py-3 bg-[#07767c]/5 rounded-lg">
                                        <p className="text-sm font-semibold text-gray-800">{userInitials}</p>
                                        <p className="text-xs text-gray-500 capitalize">{tipo_usuario}</p>
                                    </div>
                                    {filteredProfileLinks.map(link => (
                                        <Link 
                                            key={link.link}
                                            to={link.link}
                                            onClick={(e) => {
                                                handleRestrictedLinkClick(e, link);
                                                setIsMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                                        >
                                            <i className={`${link.icon} text-lg`}></i>
                                            <span>{link.label}</span>
                                        </Link>
                                    ))}
                                    <button 
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        <span>Cerrar sesión</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ MODALES - AHORA CON VERIFICACIÓN DE EMAIL */}
            {showLoginModal && (
                <LoginModal
                    onClose={() => {
                        setShowLoginModal(false);
                        clearLoginForm();
                    }}
                    onOpenSecondary={() => {
                        setShowLoginModal(false);
                        setShowLoginSecondaryModal(true);
                    }}
                    onOpenRegister={() => {
                        setShowLoginModal(false);
                        clearLoginForm();
                        setShowRegisterModal(true);
                    }}
                />
            )}

            {showLoginSecondaryModal && (
                <LoginSecondaryModal
                    onClose={() => {
                        setShowLoginSecondaryModal(false);
                        clearLoginForm();
                    }}
                    onBack={() => {
                        setShowLoginSecondaryModal(false);
                        setShowLoginModal(true);
                    }}
                    formData={loginFormData}
                    setFormData={updateLoginFormData}
                    errors={errors}
                    handleLogin={handleLoginSubmit}
                    loading={loading}
                    onOpenRegister={() => {
                        setShowLoginSecondaryModal(false);
                        clearLoginForm();
                        setShowRegisterModal(true);
                    }}
                />
            )}

            {showRegisterModal && (
                <RegisterModal
                    onClose={() => {
                        setShowRegisterModal(false);
                        clearRegisterForm();
                    }}
                    onOpenSecondary={() => {
                        setShowRegisterModal(false);
                        setShowSecondaryRegisterModal(true);
                    }}
                    onOpenLogin={() => {
                        setShowRegisterModal(false);
                        clearRegisterForm();
                        setShowLoginModal(true);
                    }}
                    onOpenEmailVerification={(email) => {
                        setVerifiedEmail(email);
                        setShowRegisterModal(false);
                        setShowEmailVerification(true);
                    }}
                />
            )}

            {showEmailVerification && (
                <EmailVerificationModal
                    onClose={() => {
                        setShowEmailVerification(false);
                        clearRegisterForm();
                    }}
                    onBack={() => {
                        setShowEmailVerification(false);
                        setShowRegisterModal(true);
                    }}
                    email={verifiedEmail}
                    onVerified={handleEmailVerified}
                />
            )}

            {showSecondaryRegisterModal && (
                <SecondaryRegisterModal
                    onClose={() => {
                        setShowSecondaryRegisterModal(false);
                        clearRegisterForm();
                    }}
                    onBack={() => {
                        setShowSecondaryRegisterModal(false);
                        setShowEmailVerification(true);
                    }}
                    formData={registerFormData}
                    setFormData={updateRegisterFormData}
                    handleRegister={handleRegisterSubmit}
                    errors={errors}
                    loading={loading}
                    onOpenLogin={() => {
                        setShowSecondaryRegisterModal(false);
                        clearRegisterForm();
                        setShowLoginModal(true);
                    }}
                    verifiedEmail={verifiedEmail}
                />
            )}

            {message.show && (
                <MessageModal
                    message={message.text}
                    type={message.type}
                    closeModal={handleCloseMessageModal}
                />
            )}
        </header>
    );
}

export default Navbar;