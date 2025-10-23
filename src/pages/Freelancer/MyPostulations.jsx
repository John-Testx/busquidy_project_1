import React, {useState, useEffect} from "react";
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import MyPostulationsTable from "@/components/FreeLancer/MyPostulationsTable";
import LoadingScreen from "@/components/LoadingScreen";
import { Footer, Navbar } from '@/components/Home/';


function MyPostulations() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [logoutStatus, setLogoutStatus] = useState("");
    const [userType, setUserType] = useState("");
    const [id_usuario, setIdUsuario] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const token = sessionStorage.getItem('token');    
            setIsAuthenticated(!!token);
            
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    console.log("Decoded token:", decoded);
                    setUserType(decoded.tipo_usuario);
                    setIdUsuario(decoded.id_usuario);
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

    const handleLogout = () => {
        setLoading(true);
        setLogoutStatus("Cerrando sesión...");
        
        setTimeout(() => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("correo");
            setIsAuthenticated(false);
            setUserType(null);
            setLogoutStatus("Sesión cerrada");
            
            setTimeout(() => {
                setLoading(false);
                navigate("/");
            }, 1000);
        });
    };

    useEffect(() => {
        if (id_usuario) {
            console.log("ID usuario actualizado:", id_usuario);
        }
    }, [id_usuario]);

    const renderNavbar = () => {
        return <Navbar />;
    };

    return (
        <div className="mt-20">
            {loading && <LoadingScreen />}
            {renderNavbar()}
            <MyPostulationsTable id_usuario={id_usuario}/>
            <Footer />
            
            {logoutStatus && (
                <div className="fixed bottom-4 right-4 bg-[#07767c] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-[modalSlideIn_0.3s_ease-out]">
                    {logoutStatus}
                </div>
            )}
        </div>
    );
}

export default MyPostulations;