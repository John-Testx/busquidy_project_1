import React from "react";
import Modal from "../Modal";

const SecondaryRegisterModal = ({ onClose, onBack, formData, setFormData, errors, handleRegister, loading, onOpenLogin }) => {
    return (
        <Modal show={true} onClose={onClose} dismissOnClickOutside={true}>
            <div className="modal-split">
                <div className="modal-left">
                    <h2>Continuar con Correo Electrónico</h2>
                    <ul>
                        <li>Registro fácil y rápido</li>
                        <li>Acceso seguro a nuestra plataforma</li>
                        <li>Tu privacidad es nuestra prioridad</li>
                    </ul>
                </div>
                <div className="modal-right">
                    <button type="button" className="back-button" style={{ width: "150px", border: "none" }} onClick={onBack}>
                        ← volver
                    </button>
                    <h3>Ingresa tu correo, contraseña y tipo de usuario</h3>

                    <div className="register-form">
                        <select 
                            value={formData.tipoUsuario} 
                            onChange={(e) => setFormData('tipoUsuario', e.target.value)} 
                            style={{ borderColor: errors.tipoUsuario ? 'red' : '' }}
                        >
                            <option value="">Tipo de Usuario</option>
                            <option value="empresa">Empresa</option>
                            <option value="freelancer">Freelancer</option>
                        </select>
                        {errors.tipoUsuario && <p style={{ color: 'red', fontSize: '12px' }}>{errors.tipoUsuario}</p>}
                    </div>

                    <div className="register-form">
                        <input 
                            type="email" 
                            placeholder="Correo Electrónico" 
                            value={formData.correo} 
                            onChange={(e) => setFormData('correo', e.target.value)}
                            style={{ borderColor: errors.correo ? 'red' : '' }}
                        />
                        {errors.correo && <p style={{ color: 'red', fontSize: '12px' }}>{errors.correo}</p>}
                    </div>

                    <div className="register-form">
                        <input 
                            type="password" 
                            placeholder="Contraseña" 
                            value={formData.contraseña} 
                            onChange={(e) => setFormData('contraseña', e.target.value)}
                            style={{ borderColor: errors.contraseña ? 'red' : '' }}
                        />
                        {errors.contraseña && <p style={{ color: 'red', fontSize: '12px' }}>{errors.contraseña}</p>}
                    </div>

                    <button className="primary" onClick={handleRegister} disabled={loading}>
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>

                    <p>¿Ya tienes una cuenta? <a href="#" onClick={onOpenLogin}>Iniciar sesión</a></p>
                </div>
            </div>
        </Modal>
    );
};

export default SecondaryRegisterModal;
