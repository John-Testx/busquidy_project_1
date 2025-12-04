import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { getNavbarOptions, helpDropdownOptions } from "@/common/navbarOptions";
import { getUserInitials } from "@/common/utils";
import { checkProfileExists } from "@/api/freelancerApi";
import { Menu, X } from 'lucide-react';
import MessageModal from "../MessageModal";

// Sub-components
import AuthModals from "./NavbarComponents/AuthModals";
import DesktopNav from "./NavbarComponents/DesktopNav";
import UserActions from "./NavbarComponents/UserActions";
import MobileMenu from "./NavbarComponents/MobileMenu";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();
    const { 
        isAuthenticated, 
        tipo_usuario,
        user, 
        id_usuario,
        logout,
        message,
        clearMessage
    } = auth;

    // --- State ---
    const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Modal visibility states (controlled here to coordinate between Desktop/Mobile triggers)
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const { navbarOptions: navOptions, profileLinks: dynamicProfileLinks } = getNavbarOptions(tipo_usuario);

    // ✅ Calculate initials using the user prop
    const userInitials = getUserInitials(user);

    // --- Effects ---
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

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // --- Logic ---
    const isActive = (path) => location.pathname === path;

    const handleLoginSuccess = (userType) => {
        if (userType === 'freelancer') navigate('/freelancer');
        else if (userType.includes('empresa')) navigate('/empresa');
        else if (userType === 'administrador') navigate('/adminhome');
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleCloseMessageModal = () => {
        const messageType = message.type;
        clearMessage();
        if (messageType === 'success') {
            handleLoginSuccess(tipo_usuario); // Re-use navigation logic
        }
    };

    // Profile Link Logic
    const filteredProfileLinks = dynamicProfileLinks.filter(link => {
        if (!link.roles.includes(tipo_usuario)) return false;
        if (tipo_usuario === 'freelancer' && isPerfilIncompleto) {
            return !['/freelancer-profile/my-postulations', '/freelancer-profile/availability'].includes(link.link);
        }
        return true;
    });

    const handleRestrictedLinkClick = (e, link) => {
        if (tipo_usuario === 'freelancer' && isPerfilIncompleto) {
            const restrictedLinks = ['/freelancer-profile/my-postulations', '/freelancer-profile/availability'];
            if (restrictedLinks.includes(link.link)) {
                e.preventDefault();
                alert('Debes completar tu perfil antes de acceder a esta sección');
                navigate('/freelancer-profile/view-profile');
            }
        }
    };

    // Extend auth object with navigation logic for the sub-component
    const extendedAuth = { ...auth, onLoginSuccess: handleLoginSuccess };
    const filteredNavOptions = navOptions.filter(opt => opt.roles.includes(tipo_usuario) || opt.roles.includes(null));

    return (
        <header className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-md'}`}>
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center h-20 lg:h-24 gap-8">
                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0">
                        <Link to="/" className="relative inline-flex items-center justify-center group h-20 sm:h-24 lg:h-28">
                            <img src="/images/Busquidy.png" alt="Busquidy Logo" className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <DesktopNav 
                        navOptions={filteredNavOptions}
                        helpDropdownOptions={helpDropdownOptions}
                        isActive={isActive}
                    />

                    {/* Desktop User Actions */}
                    <UserActions 
                        isAuthenticated={isAuthenticated}
                        userInitials={userInitials}
                        tipo_usuario={tipo_usuario}
                        profileLinks={filteredProfileLinks}
                        onOpenLogin={() => setShowLoginModal(true)}
                        onOpenRegister={() => setShowRegisterModal(true)}
                        onLogout={handleLogout}
                        handleRestrictedLinkClick={handleRestrictedLinkClick}
                    />

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-700 hover:text-[#07767c] hover:bg-gray-50 rounded-lg transition-colors">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <MobileMenu 
                isOpen={isMenuOpen}
                setIsOpen={setIsMenuOpen}
                navOptions={filteredNavOptions}
                helpDropdownOptions={helpDropdownOptions}
                isAuthenticated={isAuthenticated}
                userInitials={userInitials}
                tipo_usuario={tipo_usuario}
                profileLinks={filteredProfileLinks}
                isActive={isActive}
                onOpenLogin={() => setShowLoginModal(true)}
                onOpenRegister={() => setShowRegisterModal(true)}
                onLogout={handleLogout}
                handleRestrictedLinkClick={handleRestrictedLinkClick}
            />

            {/* Auth Modals Logic */}
            <AuthModals 
                showLoginModal={showLoginModal}
                setShowLoginModal={setShowLoginModal}
                showRegisterModal={showRegisterModal}
                setShowRegisterModal={setShowRegisterModal}
                auth={extendedAuth}
            />

            {/* Global Message Modal */}
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