import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser } from "@/api/userApi";
import { errorAuth, successAuth } from "@/common/messagesResponses";

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [tipo_usuario, setTipoUsuario] = useState(null);
    const [id_usuario, setIdUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ show: false, text: "", type: "" });
    
    // ✅ NUEVO: Estado completo del usuario
    const [user, setUser] = useState(null);

    const errorMessages = errorAuth;
    const successMessages = successAuth;

    /**
     * Valida los campos de entrada con mensajes mejorados
     */
    const validate = ({ correo, contraseña, tipoUsuario, isRegister }) => {
        const newErrors = {};
        
        if (!correo) {
            newErrors.correo = errorMessages.emptyEmail;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            newErrors.correo = errorMessages.invalidEmail;
        }
        
        if (!contraseña) {
            newErrors.contraseña = errorMessages.emptyPassword;
        } else if (contraseña.length < 6) {
            newErrors.contraseña = errorMessages.shortPassword;
        }
        
        if (isRegister && !tipoUsuario) {
            newErrors.tipoUsuario = errorMessages.noUserType;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Interpreta y mejora los mensajes de error de la API
     */
    const parseApiError = (error) => {
        const apiMessage = error.error || error.message || "";
        
        const errorMap = {
            "user not found": errorMessages.userNotFound,
            "usuario no encontrado": errorMessages.userNotFound,
            "invalid password": errorMessages.wrongPassword,
            "contraseña incorrecta": errorMessages.wrongPassword,
            "incorrect password": errorMessages.wrongPassword,
            "wrong password": errorMessages.wrongPassword,
            "password incorrect": errorMessages.wrongPassword,
            "invalid credentials": errorMessages.wrongPassword,
            "credenciales inválidas": errorMessages.wrongPassword,
            "user already exists": errorMessages.userExists,
            "usuario ya existe": errorMessages.userExists,
            "email already registered": errorMessages.userExists,
            "correo ya registrado": errorMessages.userExists,
            "network error": errorMessages.networkError,
            "timeout": errorMessages.timeout,
            "unauthorized": errorMessages.unauthorized,
            "401": errorMessages.unauthorized,
            "500": errorMessages.serverError,
            "503": errorMessages.serverError
        };

        const lowerMessage = apiMessage.toLowerCase();
        for (const [key, message] of Object.entries(errorMap)) {
            if (lowerMessage.includes(key)) {
                return message;
            }
        }

        return apiMessage || errorMessages.loginFailed;
    };

    /**
     * Refresca el estado de autenticación desde sessionStorage
     */
    const refresh = useCallback(() => {
        const token = sessionStorage.getItem("token");
        setIsAuthenticated(!!token);

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const estadoVerificacion = sessionStorage.getItem("estado_verificacion") || 'no_verificado';
                
                setTipoUsuario(decoded.tipo_usuario || null);
                setIdUsuario(decoded.id_usuario || null);
                
                // ✅ Actualizar el objeto user completo
                setUser({
                    id_usuario: decoded.id_usuario,
                    tipo_usuario: decoded.tipo_usuario,
                    estado_verificacion: estadoVerificacion
                });
                
            } catch (e) {
                console.error("Error decoding token:", e);
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("tipo_usuario");
                sessionStorage.removeItem("correo");
                sessionStorage.removeItem("estado_verificacion");
                setTipoUsuario(null);
                setIdUsuario(null);
                setUser(null);
                setIsAuthenticated(false);
            }
        } else {
            setTipoUsuario(null);
            setIdUsuario(null);
            setUser(null);
        }

        setLoading(false);
    }, []);

    /**
     * Efecto para cargar el estado inicial y escuchar cambios en storage
     */
    useEffect(() => {
        refresh();
        window.addEventListener("storage", refresh);
        return () => window.removeEventListener("storage", refresh);
    }, [refresh]);

    /**
     * Maneja el inicio de sesión del usuario
     */
    const handleLogin = async (correo, contraseña, onSuccess) => {
        if (!validate({ correo, contraseña })) return;
        
        setLoading(true);
        setErrors({});
        
        try {
            const data = await loginUser(correo, contraseña);

            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("tipo_usuario", data.tipo_usuario);
            sessionStorage.setItem("correo", correo);
            
            // ✅ Obtener el estado_verificacion del usuario
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${data.token}`
                    }
                });
                const userData = await response.json();
                sessionStorage.setItem("estado_verificacion", userData.estado_verificacion || 'no_verificado');
                
                // ✅ Actualizar el estado user
                const decoded = jwtDecode(data.token);
                setUser({
                    id_usuario: decoded.id_usuario,
                    tipo_usuario: decoded.tipo_usuario,
                    estado_verificacion: userData.estado_verificacion || 'no_verificado'
                });
            } catch (error) {
                console.error('Error obteniendo estado de verificación:', error);
                sessionStorage.setItem("estado_verificacion", 'no_verificado');
                
                const decoded = jwtDecode(data.token);
                setUser({
                    id_usuario: decoded.id_usuario,
                    tipo_usuario: decoded.tipo_usuario,
                    estado_verificacion: 'no_verificado'
                });
            }
            
            setIsAuthenticated(true);
            
            const decoded = jwtDecode(data.token);
            setTipoUsuario(decoded.tipo_usuario || null);
            setIdUsuario(decoded.id_usuario || null);
            
            setMessage({ 
                show: true, 
                text: successMessages.loginSuccess, 
                type: "success" 
            });
            
            onSuccess?.(data.tipo_usuario);
            
        } catch (err) {
            const errorMessage = parseApiError(err);
            const lowerMessage = errorMessage.toLowerCase();
            const isCredentialError = lowerMessage.includes('contraseña') || 
                                       lowerMessage.includes('password') ||
                                       lowerMessage.includes('usuario no encontrado') ||
                                       lowerMessage.includes('user not found') ||
                                       lowerMessage.includes('no encontramos');
            
            if (isCredentialError) {
                setErrors({ contraseña: errorMessage });
            } else {
                setMessage({ show: true, text: errorMessage, type: "error" });
            }
            
            console.error("Error en login:", err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Maneja el registro de un nuevo usuario
     */
    const handleRegister = async (correo, contraseña, tipoUsuario, onSuccess) => {
        if (!validate({ correo, contraseña, tipoUsuario, isRegister: true })) return;
        
        setLoading(true);
        setErrors({});
        
        try {
            await registerUser(correo, contraseña, tipoUsuario);
            
            setMessage({ 
                show: true, 
                text: successMessages.registerSuccess, 
                type: "success" 
            });
            
            onSuccess?.();
            
        } catch (err) {
            const errorMessage = parseApiError(err);
            const lowerMessage = errorMessage.toLowerCase();
            const isUserExistsError = lowerMessage.includes('ya existe') || 
                                       lowerMessage.includes('already exists') ||
                                       lowerMessage.includes('already registered');
            
            if (isUserExistsError) {
                setErrors({ correo: errorMessage });
            } else {
                setMessage({ show: true, text: errorMessage, type: "error" });
            }
            
            console.error("Error en registro:", err);
        } finally {
            setLoading(false);
        }
    };
    
    /**
     * Cierra la sesión del usuario
     */
    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("tipo_usuario");
        sessionStorage.removeItem("correo");
        sessionStorage.removeItem("estado_verificacion");
        
        setMessage({ 
            show: true, 
            text: successMessages.logoutSuccess, 
            type: "info" 
        });
        
        setUser(null);
        refresh();
    };

    /**
     * Limpia los mensajes
     */
    const clearMessage = () => {
        setMessage({ show: false, text: "", type: "" });
    };

    return {
        isAuthenticated,
        tipo_usuario,
        id_usuario,
        loading,
        refresh,
        logout,
        handleRegister,
        handleLogin,
        errors,
        message,
        clearMessage,
        user, // ✅ Exportar el objeto user completo
    };
}

export default useAuth;