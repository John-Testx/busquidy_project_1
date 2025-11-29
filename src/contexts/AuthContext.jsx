import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser, getMe } from "@/api/userApi"; // Ensure getMe is imported
import { errorAuth, successAuth } from "@/common/messagesResponses";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // Stores full user data including estado_verificacion
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ show: false, text: "", type: "" });

    // Helper to parse token and set user state safely
    const setSession = (token) => {
        if (token) {
            sessionStorage.setItem("token", token);
            const decoded = jwtDecode(token);
            // We set basic info from token immediately for speed
            setUser(prev => ({ 
                ...prev, 
                id_usuario: decoded.id_usuario, 
                tipo_usuario: decoded.tipo_usuario 
            }));
            setIsAuthenticated(true);
        } else {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("tipo_usuario");
            sessionStorage.removeItem("correo");
            sessionStorage.removeItem("estado_verificacion");
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // ✅ KEY SOLUTION: Function to force a data refresh from the backend
    const refetchUser = useCallback(async () => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        try {
            // Fetch the freshest data from the DB (including verification status)
            const userData = await getMe(); 
            
            setUser(prev => ({
                ...prev, // Keep existing fields if needed
                ...userData, // Overwrite with fresh DB data
                estado_verificacion: userData.estado_verificacion // Ensure this is updated
            }));
            
            // Sync session storage (optional, but good for persistence)
            sessionStorage.setItem("estado_verificacion", userData.estado_verificacion);
            
        } catch (error) {
            console.error("Error refreshing user data:", error);
            // If fetching me fails (e.g. 401), we might want to logout
            // logout(); 
        }
    }, []);

    // Initial load check
    useEffect(() => {
        const initAuth = async () => {
            const token = sessionStorage.getItem("token");
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    // Check expiration
                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                    } else {
                        setSession(token);
                        await refetchUser(); // Fetch full fresh data on load
                    }
                } catch (e) {
                    console.error("Invalid token:", e);
                    logout();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, [refetchUser]);

    const handleLogin = async (correo, contraseña, onSuccess) => {
        setLoading(true);
        setErrors({});
        try {
            const data = await loginUser(correo, contraseña);
            setSession(data.token);
            
            // Fetch complete profile immediately to get verification status
            await refetchUser();

            setMessage({ show: true, text: successAuth.loginSuccess, type: "success" });
            if (onSuccess) onSuccess(data.tipo_usuario);
        } catch (err) {
            // ... your existing error handling logic ...
            console.error(err);
            setMessage({ show: true, text: "Error al iniciar sesión", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (correo, contraseña, tipoUsuario, onSuccess) => {
        // ... (Keep your existing register logic, just wrapping it here) ...
        setLoading(true);
        try {
             await registerUser(correo, contraseña, tipoUsuario);
             setMessage({ show: true, text: successAuth.registerSuccess, type: "success" });
             if (onSuccess) onSuccess();
        } catch (err) {
             console.error(err);
             // handle errors
        } finally {
             setLoading(false);
        }
    };

    const logout = () => {
        setSession(null);
        setMessage({ show: true, text: successAuth.logoutSuccess, type: "info" });
    };

    const clearMessage = () => setMessage({ show: false, text: "", type: "" });

    return (
        <AuthContext.Provider value={{
            isAuthenticated,

            // 2. Backward Compatibility Layer (The "Adapter")
            // We use optional chaining (?.) so it doesn't crash if user is null
            user,
            tipo_usuario: user?.tipo_usuario, 
            id_usuario: user?.id_usuario,
            
            loading,
            errors,
            message,
            handleLogin,
            handleRegister,
            logout,
            clearMessage,
            refetchUser // Expose this so components can trigger updates!
        }}>
            {children}
        </AuthContext.Provider>
    );
};