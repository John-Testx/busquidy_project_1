import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode"; 

export default function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [tipo_usuario, setTipoUsuario] = useState(null);
    const [id_usuario, setIdUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const validate = ({ correo, contraseña, tipoUsuario, isRegister }) => {
        const newErrors = {};
        if (!correo || !/\S+@\S+\.\S+/.test(correo)) newErrors.correo = "Correo inválido";
        if (!contraseña || contraseña.length < 6)
        newErrors.contraseña = "La contraseña debe tener al menos 6 caracteres";
        if (isRegister && !tipoUsuario) newErrors.tipoUsuario = "Selecciona un tipo de usuario";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


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

    useEffect(() => {
        refresh();
        window.addEventListener("storage", refresh);
        return () => window.removeEventListener("storage", refresh);
    }, [refresh]);

    const handleLogin = async (correo, contraseña, onSuccess) => {
        if (!validate({ correo, contraseña })) return;
        setLoading(true);
        try {
        const res = await fetch("http://localhost:3001/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, contraseña }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

        localStorage.setItem("token", data.token);
        localStorage.setItem("tipo_usuario", data.tipo_usuario);
        localStorage.setItem("correo", correo);
        setIsAuthenticated(true);
        onSuccess?.(data.tipo_usuario);
        } catch (err) {
        setToast({ show: true, message: err.message, type: "error" });
        } finally {
        setLoading(false);
        }
    };

    const handleRegister = async (correo, contraseña, tipoUsuario, onSuccess) => {
        if (!validate({ correo, contraseña, tipoUsuario, isRegister: true })) return;
        setLoading(true);
        try {
        const res = await fetch("http://localhost:3001/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, contraseña, tipo_usuario: tipoUsuario }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al registrar usuario");

        setToast({ show: true, message: "Usuario registrado exitosamente", type: "success" });
        onSuccess?.();
        } catch (err) {
        setToast({ show: true, message: err.message, type: "error" });
        } finally {
        setLoading(false);
        }
    };


    const logout = () => {
        localStorage.removeItem("token");
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
    handleRegister,  // <-- add this
    handleLogin,     // optional if you want login too
    errors,
    toast
};
}