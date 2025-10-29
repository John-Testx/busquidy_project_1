import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser } from "@/api/userApi";

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [tipo_usuario, setTipoUsuario] = useState(null);
    const [id_usuario, setIdUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ show: false, text: "", type: "" });

    /**
     * Mensajes de error mejorados
     */
    const errorMessages = {
        invalidEmail: "Por favor, ingresa un correo electrónico válido (ejemplo: usuario@correo.com)",
        emptyEmail: "El correo electrónico es obligatorio",
        shortPassword: "La contraseña debe contener al menos 6 caracteres para mayor seguridad",
        emptyPassword: "La contraseña es obligatoria",
        noUserType: "Por favor, selecciona si eres Empresa o Freelancer",
        
        // Mensajes de API comunes
        userNotFound: "No encontramos una cuenta con este correo. ¿Quieres registrarte?",
        wrongPassword: "La contraseña es incorrecta. Por favor, verifica e intenta de nuevo",
        userExists: "Ya existe una cuenta con este correo. ¿Quieres iniciar sesión?",
        networkError: "No pudimos conectar con el servidor. Verifica tu conexión a internet",
        serverError: "Algo salió mal en nuestro servidor. Por favor, intenta nuevamente en unos momentos",
        unauthorized: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente",
        timeout: "La solicitud tardó demasiado. Por favor, intenta de nuevo",
        
        // Mensajes genéricos
        loginFailed: "No pudimos iniciar sesión. Verifica tus credenciales e intenta nuevamente",
        registerFailed: "No pudimos completar tu registro. Por favor, intenta nuevamente"
    };

    /**
     * Mensajes de éxito
     */
    const successMessages = {
        loginSuccess: "¡Bienvenido de nuevo! Has iniciado sesión correctamente",
        registerSuccess: "¡Cuenta creada exitosamente! Ahora puedes iniciar sesión",
        logoutSuccess: "Has cerrado sesión correctamente. ¡Hasta pronto!"
    };

    /**
     * Valida los campos de entrada con mensajes mejorados
     */
    const validate = ({ correo, contraseña, tipoUsuario, isRegister }) => {
        const newErrors = {};
        
        // Validación de correo
        if (!correo) {
            newErrors.correo = errorMessages.emptyEmail;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            newErrors.correo = errorMessages.invalidEmail;
        }
        
        // Validación de contraseña
        if (!contraseña) {
            newErrors.contraseña = errorMessages.emptyPassword;
        } else if (contraseña.length < 6) {
            newErrors.contraseña = errorMessages.shortPassword;
        }
        
        // Validación de tipo de usuario (solo en registro)
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
        // Si el error tiene un mensaje específico de la API
        const apiMessage = error.error || error.message || "";
        
        // Mapeo de errores comunes de la API
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

        // Buscar coincidencia parcial en el mensaje de error
        const lowerMessage = apiMessage.toLowerCase();
        for (const [key, message] of Object.entries(errorMap)) {
            if (lowerMessage.includes(key)) {
                return message;
            }
        }

        // Si no hay coincidencia, retornar el mensaje original o uno genérico
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
                setTipoUsuario(decoded.tipo_usuario || null);
                setIdUsuario(decoded.id_usuario || null);
            } catch (e) {
                console.error("Error decoding token:", e);
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("tipo_usuario");
                sessionStorage.removeItem("correo");
                setTipoUsuario(null);
                setIdUsuario(null);
                setIsAuthenticated(false);
            }
        } else {
            setTipoUsuario(null);
            setIdUsuario(null);
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
        // Validar primero - si falla, NO mostrar modal
        if (!validate({ correo, contraseña })) return;
        
        setLoading(true);
        setErrors({});
        
        try {
            const data = await loginUser(correo, contraseña);

            // Guardar datos en sessionStorage
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("tipo_usuario", data.tipo_usuario);
            sessionStorage.setItem("correo", correo);
            
            // Actualizar estado
            setIsAuthenticated(true);
            
            // Decodificar token para obtener datos del usuario
            const decoded = jwtDecode(data.token);
            setTipoUsuario(decoded.tipo_usuario || null);
            setIdUsuario(decoded.id_usuario || null);
            
            // Mostrar mensaje de éxito
            setMessage({ 
                show: true, 
                text: successMessages.loginSuccess, 
                type: "success" 
            });
            
            // Ejecutar callback de éxito INMEDIATAMENTE (sin setTimeout)
            onSuccess?.(data.tipo_usuario);
            
        } catch (err) {
            // Interpretar error
            const errorMessage = parseApiError(err);
            
            // CRÍTICO: Solo mostrar MessageModal para errores graves (servidor, red)
            // NO para errores de credenciales incorrectas
            const lowerMessage = errorMessage.toLowerCase();
            const isCredentialError = lowerMessage.includes('contraseña') || 
                                       lowerMessage.includes('password') ||
                                       lowerMessage.includes('usuario no encontrado') ||
                                       lowerMessage.includes('user not found') ||
                                       lowerMessage.includes('no encontramos');
            
            if (isCredentialError) {
                // Error de credenciales: mostrar en el campo
                setErrors({ contraseña: errorMessage });
            } else {
                // Error grave: mostrar en MessageModal
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
        // Validar primero - si falla, NO mostrar modal
        if (!validate({ correo, contraseña, tipoUsuario, isRegister: true })) return;
        
        setLoading(true);
        setErrors({});
        
        try {
            await registerUser(correo, contraseña, tipoUsuario);
            
            // Mostrar mensaje de éxito
            setMessage({ 
                show: true, 
                text: successMessages.registerSuccess, 
                type: "success" 
            });
            
            // Ejecutar callback INMEDIATAMENTE (sin setTimeout)
            onSuccess?.();
            
        } catch (err) {
            // Interpretar error
            const errorMessage = parseApiError(err);
            
            // CRÍTICO: Solo mostrar MessageModal para errores graves
            const lowerMessage = errorMessage.toLowerCase();
            const isUserExistsError = lowerMessage.includes('ya existe') || 
                                       lowerMessage.includes('already exists') ||
                                       lowerMessage.includes('already registered');
            
            if (isUserExistsError) {
                // Usuario ya existe: mostrar en el campo de correo
                setErrors({ correo: errorMessage });
            } else {
                // Error grave: mostrar en MessageModal
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
        
        // Mostrar mensaje de cierre de sesión
        setMessage({ 
            show: true, 
            text: successMessages.logoutSuccess, 
            type: "info" 
        });
        
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
    };
}

export default useAuth;