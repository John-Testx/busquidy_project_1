/** Mensajes de todo tipo
 * Estos mensajes son utilizados en diferentes partes de la aplicación para mostrar información al usuario.
 */


/** Login y Registro
 * Mensajes de error comunes
 */

export const errorAuth = {
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

/** Login y Registro
 * Mensajes de éxito
 */
export const successAuth = {
        loginSuccess: "¡Bienvenido de nuevo! Has iniciado sesión correctamente",
        registerSuccess: "¡Cuenta creada exitosamente! Ahora puedes iniciar sesión",
        logoutSuccess: "Has cerrado sesión correctamente. ¡Hasta pronto!"
    };