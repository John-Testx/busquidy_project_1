import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import RegisterModal from "./Modals/RegisterModal";
import SecondaryRegisterModal from "./Modals/SecondaryRegisterModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginModal from "./Modals/LoginModal";
import LoginSecondaryModal from "./Modals/LoginSecondaryModal";
import useAuth from "@/hooks/useAuth";
import { navbarOptions, profileLinks } from "@/common/navbarOptions";
import ProfileCircle from "../ProfileCircle";
import { getUserInitials } from "@/common/utils";
import { 
    Menu, 
    X, 
    ChevronDown, 
    HelpCircle, 
    User, 
    LogOut,
    Settings,
    Bell,
    MessageSquare
} from 'lucide-react';

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const { 
        isAuthenticated, 
        tipo_usuario, 
        handleLogin,
        handleRegister, 
        logout, 
        errors, 
        loading 
    } = useAuth();

    // Add registration formData in Navbar
    const [registerData, setRegisterData] = useState({
        correo: "",
        contraseña: "",
        tipoUsuario: "",
    });

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHelpDropdownOpen, setIsHelpDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    const profileMenuRef = useRef(null);
    const helpMenuRef = useRef(null);

    const toggleProfileMenu = () => setIsProfileMenuOpen(prev => !prev);

    const updateRegisterData = (key, value) => {
        setRegisterData(prev => ({ ...prev, [key]: value }));
    };

    const handleRegisterSubmit = async () => {
        await handleRegister(
            registerData.correo,
            registerData.contraseña,
            registerData.tipoUsuario,
            () => {
                setShowSecondaryRegisterModal(false);
                setShowRegisterModal(false);
                console.log("Registro exitoso, redirigiendo...");
                navigate("/");
            }
        );
    };

    // Modal states
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLoginSecondaryModal, setShowLoginSecondaryModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showSecondaryRegisterModal, setShowSecondaryRegisterModal] = useState(false);

    // Form data for login
    const [formData, setFormData] = useState({ correo: "", contraseña: "" });
    const updateFormData = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

    const handleLoginSubmit = async () => {
        await handleLogin(formData.correo, formData.contraseña, (tipo_usuario) => {
            setShowLoginSecondaryModal(false);
            setShowLoginModal(false);
            console.log(tipo_usuario);
            navigate("/");
        });
    };

    const toggleHelpDropdown = () => {
        setIsHelpDropdownOpen(!isHelpDropdownOpen);
    };

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setIsProfileMenuOpen(false);
        navigate("/");
    };

    const navOptions = navbarOptions;
    const filteredProfileLinks = profileLinks.filter(link => link.roles.includes(tipo_usuario));

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
                        <Link to="/" className="flex items-center group">
                            <img 
                                src="/images/Busquidy.png" 
                                alt="Busquidy Logo" 
                                className="h-24 sm:h-28 lg:h-32 w-auto transition-transform duration-300 group-hover:scale-105" 
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

                            {/* Help Dropdown Menu */}
                            {isHelpDropdownOpen && (
                                <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <Link 
                                        to="/soportehome"
                                        onClick={() => setIsHelpDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#07767c]/5 hover:text-[#07767c] transition-colors"
                                    >
                                        <MessageSquare size={18} />
                                        <span>Soporte al Cliente</span>
                                    </Link>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <Link 
                                        to="/busquidyGuia"
                                        onClick={() => setIsHelpDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#07767c]/5 hover:text-[#07767c] transition-colors"
                                    >
                                        <HelpCircle size={18} />
                                        <span>Busquidy Guía</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Right Section - Auth Buttons / Profile - Ahora con ml-auto para empujar a la derecha */}
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
                                {/* Notifications Icon (optional) */}
                                <button className="relative p-2 text-gray-600 hover:text-[#07767c] hover:bg-gray-50 rounded-lg transition-colors">
                                    <Bell size={20} />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>

                                {/* Profile Menu */}
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

                                    {/* Profile Dropdown */}
                                    {isProfileMenuOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-semibold text-gray-800 truncate">
                                                    {userInitials}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5 capitalize">
                                                    {tipo_usuario}
                                                </p>
                                            </div>

                                            {/* Menu Links */}
                                            <div className="py-2">
                                                {filteredProfileLinks.map(link => (
                                                    <Link 
                                                        key={link.link}
                                                        to={link.link} 
                                                        onClick={() => setIsProfileMenuOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#07767c]/5 hover:text-[#07767c] transition-colors"
                                                    >
                                                        <i className={`${link.icon} text-lg`}></i>
                                                        <span>{link.label}</span>
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* Logout */}
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
                        {/* Navigation Links */}
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

                        {/* Help Section */}
                        <div className="pt-2 border-t border-gray-100">
                            <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Ayuda</p>
                            <Link 
                                to="/soportehome"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                            >
                                <MessageSquare size={18} />
                                <span>Soporte al Cliente</span>
                            </Link>
                            <Link 
                                to="/busquidyGuia"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                            >
                                <HelpCircle size={18} />
                                <span>Busquidy Guía</span>
                            </Link>
                        </div>

                        {/* Auth Buttons / Profile - Mobile */}
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
                                            onClick={() => setIsMenuOpen(false)}
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

            {/* ----------------------------- MODALS ---------------------------------- */}

            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onOpenSecondary={() => {
                        setShowLoginModal(false);
                        setShowLoginSecondaryModal(true);
                    }}
                    onOpenRegister={() => {
                        setShowLoginModal(false);
                        setShowRegisterModal(true);
                    }}
                />
            )}

            {showLoginSecondaryModal && (
                <LoginSecondaryModal
                    onClose={() => setShowLoginSecondaryModal(false)}
                    onBack={() => {
                        setShowLoginSecondaryModal(false);
                        setShowLoginModal(true);
                    }}
                    formData={formData}
                    setFormData={updateFormData}
                    errors={errors}
                    handleLogin={handleLoginSubmit}
                    loading={loading}
                    onOpenRegister={() => {
                        setShowLoginSecondaryModal(false);
                        setShowRegisterModal(true);
                    }}
                />
            )}

            {showRegisterModal && (
                <RegisterModal
                    onClose={() => setShowRegisterModal(false)}
                    onOpenSecondary={() => {
                        setShowRegisterModal(false);
                        setShowSecondaryRegisterModal(true);
                    }}
                />
            )}

            {showSecondaryRegisterModal && (
                <SecondaryRegisterModal
                    onClose={() => setShowSecondaryRegisterModal(false)}
                    onBack={() => {
                        setShowSecondaryRegisterModal(false);
                        setShowRegisterModal(true);
                    }}
                    formData={registerData}
                    setFormData={updateRegisterData}
                    handleRegister={handleRegisterSubmit}
                    errors={errors}
                    loading={loading}
                />
            )}
        </header>
    );
}

export default Navbar;