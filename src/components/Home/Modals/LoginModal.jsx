import React from "react";
import Modal from "../Modal";

const LoginModal = ({ onClose, onOpenSecondary, onOpenRegister }) => {
    return (
        <Modal show={true} onClose={onClose} dismissOnClickOutside={true}>
            <div className="modal-split">
                <div className="modal-left">
                    <h2>El camino al éxito comienza contigo aquí</h2>
                    <ul>
                        <li>Diversas categorías para buscar</li>
                        <li>Trabajo de calidad en tus proyectos</li>
                        <li>Acceso a joven talento profesional</li>
                    </ul>
                </div>
                <div className="modal-right">
                    <h2>Inicia sesión con tu cuenta</h2>
                    <p>¿No tienes una cuenta? <a href="#" onClick={onOpenRegister}>Regístrate aquí</a></p>
                    <button style={{ width: "400px", marginLeft: "20px" }} onClick={onOpenSecondary}>
                        <img src="/images/email.svg" alt="Email" style={{ height: "20px", marginRight: "10px" }} />
                        Continuar con Correo Electrónico
                    </button>
                    <button style={{ width: "400px", marginLeft: "20px" }} className="google">
                        <img src="/images/google.svg.svg" alt="Google" style={{ height: "20px", marginRight: "10px" }} />
                        Continuar con Google
                    </button>
                    <button style={{ width: "400px", marginLeft: "20px" }} className="microsoft">
                        <img src="/images/microsoft.svg" alt="Microsoft" style={{ height: "20px", marginRight: "10px" }} />
                        Continuar con Microsoft
                    </button>
                    <button style={{ width: "400px", marginLeft: "20px" }} className="apple">
                        <img src="/images/apple.svg" alt="Apple" style={{ height: "20px", marginRight: "10px" }} />
                        Continuar con Apple
                    </button>
                    <div className="divider-wrapper">
                        <div className="divider"><span>O</span></div>
                    </div>
                    <div className="terms-container">
                        <p>Al unirte, aceptas los <a href="#">Términos de servicio</a> y nuestra <a href="#">Política de privacidad</a>.</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default LoginModal;
