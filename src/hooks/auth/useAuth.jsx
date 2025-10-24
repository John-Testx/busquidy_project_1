import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser } from "@/api/userApi";

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [tipo_usuario, setTipoUsuario] = useState(null);
    const [id_usuario, setIdUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    /**
     * Valida los campos de entrada
     */
    const validate = ({ correo, contraseña, tipoUsuario, isRegister }) => {
        const newErrors = {};
        if (!correo || !/\S+@\S+\.\S+/.test(correo)) {
            newErrors.correo = "Correo inválido";
        }
        if (!contraseña || contraseña.length < 6) {
            newErrors.contraseña = "La contraseña debe tener al menos 6 caracteres";
        }
        if (isRegister && !tipoUsuario) {
            newErrors.tipoUsuario = "Selecciona un tipo de usuario";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Refresca el estado de autenticación desde localStorage
     */
    const refresh = useCallback(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);

        if (token) {
            try {
                const decoded = jwtDecode(token);
                setTipoUsuario(decoded.tipo_usuario || null);
                setIdUsuario(decoded.id_usuario || null);
            } catch (e) {
                console.error("Error decoding token:", e);
                localStorage.removeItem("token");
                localStorage.removeItem("tipo_usuario");
                localStorage.removeItem("correo");
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
     * @param {string} correo - Correo del usuario
     * @param {string} contraseña - Contraseña del usuario
     * @param {Function} onSuccess - Callback a ejecutar en caso de éxito
     */
    const handleLogin = async (correo, contraseña, onSuccess) => {
        if (!validate({ correo, contraseña })) return;
        
        setLoading(true);
        setErrors({});
        
        try {
            const data = await loginUser(correo, contraseña);

            // Guardar datos en localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("tipo_usuario", data.tipo_usuario);
            localStorage.setItem("correo", correo);
            
            // Actualizar estado
            setIsAuthenticated(true);
            
            // Decodificar token para obtener datos del usuario
            const decoded = jwtDecode(data.token);
            setTipoUsuario(decoded.tipo_usuario || null);
            setIdUsuario(decoded.id_usuario || null);
            
            // Ejecutar callback de éxito
            onSuccess?.(data.tipo_usuario);
        } catch (err) {
            const errorMessage = err.error || err.message || "Error al iniciar sesión";
            setToast({ show: true, message: errorMessage, type: "error" });
            console.error("Error en login:", err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Maneja el registro de un nuevo usuario
     * @param {string} correo - Correo del usuario
     * @param {string} contraseña - Contraseña del usuario
     * @param {string} tipoUsuario - Tipo de usuario
     * @param {Function} onSuccess - Callback a ejecutar en caso de éxito
     */
    const handleRegister = async (correo, contraseña, tipoUsuario, onSuccess) => {
        if (!validate({ correo, contraseña, tipoUsuario, isRegister: true })) return;
        
        setLoading(true);
        setErrors({});
        
        try {
            await registerUser(correo, contraseña, tipoUsuario);
            
            setToast({ 
                show: true, 
                message: "Usuario registrado exitosamente", 
                type: "success" 
            });
            
            onSuccess?.();
        } catch (err) {
            const errorMessage = err.error || err.message || "Error al registrar usuario";
            setToast({ show: true, message: errorMessage, type: "error" });
            console.error("Error en registro:", err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cierra la sesión del usuario
     */
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tipo_usuario");
        localStorage.removeItem("correo");
        refresh();
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
        toast,
    };
}

export default useAuth;