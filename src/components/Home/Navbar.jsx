import React, { useState, useEffect, useRef } from "react";
// import "../../styles/Home/Navbar.css";
import Modal from "./Modal";
import RegisterModal from "./Modals/RegisterModal";
import SecondaryRegisterModal from "./Modals/SecondaryRegisterModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import LoginModal from "./Modals/LoginModal";
import LoginSecondaryModal from "./Modals/LoginSecondaryModal";
import useAuth from "../../hooks/useAuth";
import { navbarOptions, profileLinks } from "../../common/navbarOptions";
import ProfileCircle from "../ProfileCircle";
import { getUserInitials } from "../../common/utils";


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
    const profileMenuRef = useRef(null);

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

    // Navbar state
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHelpDropdownOpen, setIsHelpDropdownOpen] = useState(false);
    const [isIconRotated, setIsIconRotated] = useState(false);

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
        setIsIconRotated(!isIconRotated);
    };

    const isActive = (path) => (location.pathname === path ? "text-teal-700 after:w-full" : "");

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const navOptions = navbarOptions;
    const filteredProfileLinks = profileLinks.filter(link => link.roles.includes(tipo_usuario));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
        
    }, []);

    const userInitials = getUserInitials();

    return (
        <header className="flex justify-between items-center px-5 py-2.5 bg-white max-w-full mx-auto h-[60px] fixed top-0 w-full z-[1000] shadow-md">
            <div className="flex justify-start items-center px-5 py-2.5 bg-white max-w-[1500px] mx-auto h-[60px]">

                {/* Logo + Menu Toggle */}
                <div className="flex items-center justify-center mr-20">
                    <Link to="/" className="inline-block w-auto h-auto">
                        <img src="/images/Busquidy.png" alt="logo" className="block w-[130px] h-auto cursor-pointer" />
                    </Link>
                    <div className="hidden max-[768px]:block">
                        <span className="text-3xl cursor-pointer ml-auto" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            &#9776;
                        </span>
                    </div>
                </div>

                {/* Navbar links */}
                <nav className={`flex items-center gap-5 mr-auto max-[768px]:${isMenuOpen ? 'flex' : 'hidden'} max-[768px]:flex-col max-[768px]:mt-5 max-[768px]:absolute max-[768px]:top-[60px] max-[768px]:left-0 max-[768px]:w-full max-[768px]:bg-white max-[768px]:z-[100] max-[768px]:shadow-md`}>

                    {navOptions
                        .filter(opt => opt.roles.includes(tipo_usuario) || opt.roles.includes(null))
                        .map((opt) => (
                            <Link
                                key={opt.link}
                                className={`mx-4 no-underline text-black text-base font-medium relative pb-1.5 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-teal-700 after:transition-[width] after:duration-[0.9s] after:ease-[cubic-bezier(0.25,1,0.5,1)] hover:after:w-full ${isActive(opt.link)}`}
                                to={opt.link}
                            >
                                {opt.label}
                            </Link>
                        ))}

                    {/* Help Dropdown */}
                    <div className="relative inline-block">
                        <button 
                            className="bg-transparent border-none mb-1 cursor-pointer text-[15px] transition-colors duration-200 p-2.5 hover:text-teal-700"
                            onClick={toggleHelpDropdown}
                        >
                            ¡Ayuda!{" "}
                            <i className={`bi bi-chevron-down ml-2 text-base transition-transform duration-200 ${isIconRotated ? "rotate-180" : ""}`}></i>
                        </button>

                        {isHelpDropdownOpen && (
                            <div className="block absolute bg-[#f9f9f9] min-w-[200px] shadow-[0_8px_16px_rgba(0,0,0,0.2)] z-[1] p-2.5 rounded-[5px] left-1/2 -translate-x-1/2">
                                <Link 
                                    className={`text-teal-900 no-underline block py-2.5 px-0 border-b border-[#ddd] last:border-b-0 ${isActive("/soporte-cliente")}`}
                                    to="/soportehome"
                                >
                                    Soporte al Cliente
                                </Link>
                                <Link 
                                    className={`text-teal-900 no-underline block py-2.5 px-0 ${isActive("/busquidy-guia")}`}
                                    to="/busquidyGuia"
                                >
                                    Busquidy Guía
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Auth buttons or profile */}
                    <div className="flex items-center ml-[150px] max-[768px]:flex-col max-[768px]:ml-0">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    className="ml-10 py-3 px-5 border-2 border-teal-700/55 bg-white text-black rounded-lg text-[15px] font-bold cursor-pointer transition-all duration-300 hover:bg-teal-50 max-[768px]:ml-0 max-[768px]:my-2.5 max-[768px]:px-5 max-[768px]:py-2.5 max-[768px]:text-center"
                                    onClick={() => setShowLoginModal(true)}
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    className="ml-10 py-3 px-5 border-2 bg-teal-700/55 text-white rounded-lg text-[15px] font-bold cursor-pointer transition-all duration-300 hover:bg-teal-800/70 hover:border-teal-800/70 max-[768px]:ml-0 max-[768px]:my-2.5 max-[768px]:px-5 max-[768px]:py-2.5 max-[768px]:text-center"
                                    onClick={() => setShowRegisterModal(true)}
                                >
                                    Registrarse
                                </Link>
                            </>
                        ) : (
                            <div className="relative" onClick={toggleProfileMenu}>
                                <ProfileCircle userInitials={userInitials} />
                                <div 
                                    className={`${isProfileMenuOpen ? 'block' : 'hidden'} absolute top-[60px] right-5 bg-white border border-[#ddd] rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)] w-[200px] z-[1000]`}
                                    ref={profileMenuRef}
                                >
                                    <ul className="list-none p-0 m-0">
                                        {filteredProfileLinks.map(link => (
                                            <li key={link.link} className="py-3 px-4 hover:bg-gray-100">
                                                <Link to={link.link} className="no-underline text-gray-800 block">
                                                    <i className={link.icon}></i> {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                        <li 
                                            onClick={handleLogout} 
                                            className="py-3 px-4 cursor-pointer hover:bg-gray-100"
                                        >
                                            <i className="bi bi-box-arrow-right"></i> Cerrar sesión
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

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