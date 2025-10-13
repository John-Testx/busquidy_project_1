import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Navbar from "../../components/Home/Navbar";
import { navbarOptions } from "../../common/navbarOptions";
import Footer from "../../components/Home/Footer";
import LoadingScreen from "../../components/LoadingScreen";
import InfoSectionEmpresa from "../../components/Empresa/PanelEmpresa/InfoSectionEmpresa";
import InfoSectionFreelancer from "../../components/FreeLancer/InfoSectionFreelancer";
import LittleSearchSection from "../../components/FreeLancer/LittleSearchSection";
import EmpresaActionsCard from "../../components/Empresa/PanelEmpresa/EmpresaActionsCard";

function User() {
  const { isAuthenticated, tipo_usuario: userType, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutStatus, setLogoutStatus] = React.useState("");

  const handleLogout = () => {
    setLogoutStatus("Cerrando sesión...");
    setTimeout(() => {
      logout();
      setLogoutStatus("Sesión cerrada");
      setTimeout(() => {
        navigate("/");
      }, 500);
    }, 500);
  };

  // Example profile links for empresa/freelancer
  const profileLinks = userType === "empresa"
    ? [
        { label: "Mi perfil", link: "/viewperfilempresa", icon: "bi bi-person" },
        { label: "Mis publicaciones", link: "/myprojects", icon: "bi bi-file-earmark-text" },
        { label: "Mejorar Busquidy", link: "#", icon: "bi bi-arrow-up-right-circle" }
      ]
    : [
        { label: "Mi perfil", link: "/viewperfilfreelancer", icon: "bi bi-person" },
        { label: "Mis postulaciones", link: "/mypostulations", icon: "bi bi-file-earmark-text" }
      ];

  return (
    <div style={{ marginTop: "80px" }}>
      {loading && <LoadingScreen />}
      <Navbar userType={userType} options={navbarOptions} onLogout={handleLogout} profileLinks={profileLinks} />

      {/* Render content based on user type */}
      {userType === "empresa" && (
        <>
          <EmpresaActionsCard />
          <InfoSectionEmpresa />
        </>
      )}
      {userType === "freelancer" && (
        <>
          <LittleSearchSection />
          <InfoSectionFreelancer />
        </>
      )}
      {/* Add more user types as needed */}

      <Footer />

      {logoutStatus && (
        <div className="logout-status-msg">
          {logoutStatus}
        </div>
      )}
    </div>
  );
}

export default User;