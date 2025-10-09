import React from "react";
import Modal from "../Modal";

const LoginSecondaryModal = ({ onClose, onBack, formData, setFormData, errors, handleLogin, loading, onOpenRegister }) => {
    return (
        <Modal show={true} onClose={onClose} dismissOnClickOutside={true}>
            <div className="modal-split">
                <div className="modal-left">
                    <h2>Continuar con Correo Electrónico</h2>
                    <ul>
                        <li>Inicio de sesión seguro</li>
                        <li>Acceso fácil y rápido</li>
                        <li>Protegeremos tus datos</li>
                    </ul>
                </div>
                <div className="modal-right">
                    <button type="button" className="back-button" style={{ width: "150px", border: "none" }} onClick={onBack}>
                        ← volver
                    </button>
                    <h3>Ingresa tu correo y contraseña</h3>
                    <div className="login-form">
                        <div className="input-container">
                            <input
                                type="email"
                                placeholder="Correo Electrónico"
                                value={formData.correo}
                                onChange={(e) => setFormData('correo', e.target.value)}
                                style={{ borderColor: errors.correo ? "red" : "" }}
                            />
                            {errors.correo && <p style={{ color: "red", fontSize: "12px" }}>{errors.correo}</p>}
                        </div>
                        <div className="input-container">
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={formData.contraseña}
                                onChange={(e) => setFormData('contraseña', e.target.value)}
                                style={{ borderColor: errors.contraseña ? "red" : "" }}
                            />
                            {errors.contraseña && <p style={{ color: "red", fontSize: "12px" }}>{errors.contraseña}</p>}
                        </div>
                    </div>
                    <a href="#" style={{ marginBottom: "20px" }}>¿Olvidaste tu contraseña?</a>
                    <button className="primary" onClick={handleLogin} disabled={loading}>
                        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </button>
                    <p>¿No tienes una cuenta? <a href="#" onClick={onOpenRegister}>Regístrate</a></p>
                </div>
            </div>
        </Modal>
    );
};

export default LoginSecondaryModal;
