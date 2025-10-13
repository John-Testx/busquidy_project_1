import React, {useState, useEffect} from "react";
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Home/Navbar";
import Footer from "../../components/Home/Footer";
import CreatePerfilEmpresa from "../../components/Empresa/Perfil/CreatePerfilEmpresa";
import LoadingScreen from "../../components/LoadingScreen";
import PerfilCard from "../../components/Home/PerfilCard";

function ViewPerfilEmpresa() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [logoutStatus, setLogoutStatus] = useState("");
    const [userType, setUserType] = useState("");
    const [id_usuario, setIdUsuario] = useState(null);
    const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);
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
                    setIdUsuario(decoded.id_usuario);

                    if (decoded.id_usuario) {
                        fetchPerfilEmpresa(decoded.id_usuario);
                        console.log('ID de usuario correcto:', decoded.id_usuario);
                    }
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

    const fetchPerfilEmpresa = async (id_usuario) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/empresa/get/${id_usuario}`);
            console.log("Se verificó el perfil de la empresa");
            setIsPerfilIncompleto(response.data.isPerfilIncompleto);
        } catch (error) {
            console.error("Error al verificar el perfil de la empresa:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Loading Screen */}
            {loading && <LoadingScreen />}

            {/* Navbar */}
            <Navbar />
           
            {/* Main Content */}
            <main className="flex-1 pt-24 pb-16">
                {isAuthenticated ? (
                    <>
                        {isPerfilIncompleto === null ? (
                            <div className="max-w-md mx-auto px-4">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                                    <div className="flex justify-center mb-4">
                                        <div className="animate-spin">
                                            <i className="fas fa-spinner text-4xl text-teal-600"></i>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-lg">
                                        Cargando datos del perfil...
                                    </p>
                                </div>
                            </div>
                        ) : isPerfilIncompleto ? (
                            <CreatePerfilEmpresa userType={userType} id_usuario={id_usuario} />
                        ) : (
                            <PerfilCard userType={userType} id_usuario={id_usuario} />
                        )}
                    </>
                ) : (
                    <div className="max-w-md mx-auto px-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <i className="fas fa-lock text-blue-500 text-4xl"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-blue-800 mb-2">
                                Acceso requerido
                            </h2>
                            <p className="text-blue-700 mb-6">
                                Por favor inicia sesión para ver tu perfil.
                            </p>
                            <button
                                onClick={() => navigate("/user")}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-200"
                            >
                                <i className="fas fa-sign-in-alt"></i>
                                Ir a iniciar sesión
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <Footer />

            {/* Logout Status Message */}
            {logoutStatus && (
                <div className="fixed bottom-6 right-6 bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold">
                    {logoutStatus}
                </div>
            )}
        </div>
    );
}

export default ViewPerfilEmpresa;