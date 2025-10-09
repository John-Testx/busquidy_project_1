import React from "react";
import Modal from "../Modal";

export default function AuthModals({
  showLoginModal,
  showSecondaryModal,
  correo,
  contraseña,
  correoError,
  contraseñaError,
  handleLogin,
  loading,
  handleOpenRegisterModal,
  handleOpenSecondaryModal,
  handleOpenLoginModal,
  handleCloseLoginModal,
  handleCloseSecondaryModal,
  setCorreo,
  setContraseña,
}) {
  return (
    <>
      {/* Modal Login */}
      <Modal show={showLoginModal} onClose={handleCloseLoginModal} dismissOnClickOutside>
        <div className="modal-split">
          <div className="modal-left">
            <h2>El camino al éxito comienza contigo</h2>
            <ul>
              <li>Diversas categorías</li>
              <li>Trabajo de calidad</li>
              <li>Acceso a joven talento</li>
            </ul>
          </div>
          <div className="modal-right">
            <h2>Inicia sesión</h2>
            <p>¿No tienes una cuenta? <a href="#" onClick={handleOpenRegisterModal}> Regístrate aquí</a></p>
            <button onClick={handleOpenSecondaryModal}>Continuar con Correo Electrónico</button>
          </div>
        </div>
      </Modal>

      {/* Secondary Login */}
      <Modal show={showSecondaryModal} onClose={handleCloseSecondaryModal} dismissOnClickOutside>
        <div className="modal-split">
          <div className="modal-left">
            <h2>Continuar con Correo Electrónico</h2>
            <ul>
              <li>Inicio seguro</li>
              <li>Acceso rápido</li>
              <li>Protección de datos</li>
            </ul>
          </div>
          <div className="modal-right">
            <button type="button" onClick={handleOpenLoginModal}>← Volver</button>
            <h3>Ingresa tus credenciales</h3>

            <div className="input-container">
              <input
                type="email"
                placeholder="Correo Electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                style={{ borderColor: correoError ? "red" : "" }}
              />
              {correoError && <p style={{ color: "red" }}>{correoError}</p>}
            </div>

            <div className="input-container">
              <input
                type="password"
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                style={{ borderColor: contraseñaError ? "red" : "" }}
              />
              {contraseñaError && <p style={{ color: "red" }}>{contraseñaError}</p>}
            </div>

            <button onClick={handleLogin} disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal show={show} onClose={onClose} dismissOnClickOutside={true}>
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
                <button style={{ width: "150px", border: "none" }} className="back-button" onClick={onBack}>
                ← volver
                </button>

                <h3>Ingresa tu correo, contraseña y tipo de usuario</h3>

                <div className="register-form">
                <select
                    value={tipoUsuario}
                    onChange={(e) => setTipoUsuario(e.target.value)}
                    style={{ borderColor: errorTipoUsuario ? "red" : "" }}
                >
                    <option value="">Tipo de Usuario</option>
                    <option value="empresa">Empresa</option>
                    <option value="freelancer">Freelancer</option>
                </select>
                {errorTipoUsuario && <p style={{ color: "red", fontSize: "12px" }}>Por favor selecciona un tipo de usuario.</p>}
                </div>

                <div className="register-form">
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    style={{ borderColor: correoError ? "red" : "" }}
                />
                {correoError && <p style={{ color: "red", fontSize: "12px" }}>Correo electrónico inválido.</p>}
                </div>

                <div className="register-form">
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    style={{ borderColor: contraseñaError ? "red" : "" }}
                />
                {contraseñaError && <p style={{ color: "red", fontSize: "12px" }}>Contraseña inválida.</p>}
                </div>

                <button
                className="primary"
                onClick={handleRegister}
                disabled={loading}
                style={{ marginLeft: "20px", padding: "10px" }}
                >
                {loading ? "Registrando..." : "Registrarse"}
                </button>

                {error && <div style={{ color: "red" }}>{error}</div>}
                {success && <div style={{ color: "green" }}>{success}</div>}

                <p>¿Ya tienes una cuenta? <a href="#" onClick={onOpenLogin}>Iniciar sesión</a></p>
            </div>
            </div>
        </Modal>



    </>
  );
}
