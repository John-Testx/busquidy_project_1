import React, { useState, useEffect, useRef } from "react";
import "../../styles/Home/Navbar.css";
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

    // Inside Navbar()
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
                navigate("/"); // or show success toast
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

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navOptions = navbarOptions;

  const filteredProfileLinks =  profileLinks.filter(link => link.roles.includes(tipo_usuario));
    //console.log("Tipo usuario:", tipo_usuario);
    //console.log("Filtered profile links:", filteredProfileLinks);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
        
    }, []);

    // Get initials dynamically
    const userInitials = getUserInitials();

  return (
    <header className="navbar">
      <div className="navbar-general-content">

        {/* Logo + Menu Toggle */}
        <div className="navbar-logo">
          <Link to="/">
            <img src="/images/Busquidy.png" alt="logo" />
          </Link>
          <div className="navbar-toggle">
            <span className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              &#9776;
            </span>
          </div>
        </div>

        {/* Navbar links */}
        <nav className={`navbar-links ${isMenuOpen ? "active" : ""}`}>

          {navOptions
            .filter(opt => opt.roles.includes(tipo_usuario) || opt.roles.includes(null))
            .map((opt) => (
              <Link
                key={opt.link}
                className={isActive(opt.link)}
                to={opt.link}
              >
                {opt.label}
              </Link>
            ))}

          {/* Help Dropdown */}
          <div className="help-dropdown">
            <button className="help-dropdown-btn" onClick={toggleHelpDropdown}>
              ¡Ayuda!{" "}
              <i
                className={`bi bi-chevron-down ${isIconRotated ? "rotated" : ""}`}
              ></i>
            </button>

            {isHelpDropdownOpen && (
              <div className="help-dropdown-content">
                <Link className={isActive("/soporte-cliente")} to="/soporte-cliente">
                  Soporte al Cliente
                </Link>
                <Link className={isActive("/soporte-ia")} to="/soporte-ia">
                  Soporte IA
                </Link>
                <Link className={isActive("/busquidy-guia")} to="/busquidy-guia">
                  Busquidy Guía
                </Link>
              </div>
            )}
          </div>

          {/* Auth buttons or profile */}
                    <div className="navbar-auth">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    className="login-btn"
                                    onClick={() => setShowLoginModal(true)}
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    className="register-btn"
                                    onClick={() => setShowRegisterModal(true)}
                                >
                                    Registrarse
                                </Link>
                            </>
                        ) : (
                            <>
                                {console.log("Rendering profile dropdown", filteredProfileLinks)}
                                <div className="navbar-profile" onClick={toggleProfileMenu}>
                                <ProfileCircle userInitials={userInitials} />
                                <div className={`profile-menu-dropdown ${isProfileMenuOpen ? "active" : ""}`} ref={profileMenuRef}>
                                    <ul>
                                    {filteredProfileLinks.map(link => (
                                        <li key={link.link}>
                                        <Link to={link.link}>
                                            <i className={link.icon}></i> {link.label}
                                        </Link>
                                        </li>
                                    ))}
                                    <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                                        <i className="bi bi-box-arrow-right"></i> Cerrar sesión
                                    </li>
                                    </ul>
                                </div>
                                </div>
                            </>
                        )}
                    </div>
                </nav>
            </div>

            {/* ----------------------------- MODALS ---------------------------------- */}

            {/* Primary Login Modal */}
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

            {/* Secondary Login Modal (email/password) */}
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

            {/* Register Modals */}
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
