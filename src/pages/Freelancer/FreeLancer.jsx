import React, { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Home/Navbar";
import LittleSearchSection from "../../components/FreeLancer/PanelFreelancer/LittleSearchSection";
import Footer from "../../components/Home/Footer";
import LoadingScreen from "../../components/LoadingScreen";
import InfoSectionFreelancer from "../../components/FreeLancer/PanelFreelancer/InfoSectionFreelancer";

function FreeLancer() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [logoutStatus, setLogoutStatus] = useState("");
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');    
            setIsAuthenticated(!!token);
            
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    console.log("Decoded token:", decoded);
                    setUserType(decoded.tipo_usuario);
                } catch (error) {
                    console.error("Error decodificando el token:", error);
                }
            }
            
            setTimeout(() => {
                setLoading(false);
            }, 500);
        };
     
        window.addEventListener('storage', checkAuth);
        checkAuth();
   
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    return (
        <div>
            {loading && <LoadingScreen />}
            <Navbar />;
            <LittleSearchSection/>
            <InfoSectionFreelancer/>
            <Footer/>
            
            {logoutStatus && (
                <div className="fixed bottom-4 right-4 bg-[#07767c] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-[modalSlideIn_0.3s_ease-out]">
                    {logoutStatus}
                </div>
            )}
        </div>
    );
}

export default FreeLancer;