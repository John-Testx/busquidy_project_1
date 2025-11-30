/**
 * Obtiene las iniciales del usuario basado en su correo.
 * Prioriza el objeto user del contexto, luego sessionStorage.
 * @param {Object} [user] - Objeto de usuario (opcional)
 * @returns {string} Iniciales (ej: "JU") o "NN"
 */
export const getUserInitials = (user) => {
  // Intentar obtener correo de: 1. Objeto user, 2. SessionStorage
  const email = user?.correo || user?.email || sessionStorage.getItem("correo") || "";
  
  if (!email) return "NN";

  const namePart = email.split("@")[0];
  return namePart.slice(0, 2).toUpperCase();
};

/**
 * Formatea una fecha a formato local (es-CL)
 * @param {string} dateString - Fecha en formato string
 * @returns {string} Fecha formateada
 */
export const formatDateToLocale = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

/**
 * Formatea un monto a formato de moneda chilena (CLP)
 * @param {number} amount - Monto a formatear
 * @returns {string} Monto formateado
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount);
};

/**
 * Obtiene la configuración de estilo para el estado de pago
 * @param {string} estado - Estado del pago
 * @returns {Object} Configuración de estilos e icono
 */
export const getEstadoPagoConfig = (estado) => {
  const configs = {
    'Completado': {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      iconName: 'CheckCircle'
    },
    'Pendiente': {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      iconName: 'AlertTriangle'
    },
    'Fallido': {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      iconName: 'XCircle'
    },
    'completado': {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      iconName: 'CheckCircle'
    },
    'pendiente': {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      iconName: 'AlertTriangle'
    },
    'fallido': {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      iconName: 'XCircle'
    }
  };
  return configs[estado] || configs['Pendiente'];
};

/**
 * Obtiene la configuración de estilo para el estado de suscripción
 * @param {string} estado - Estado de la suscripción
 * @returns {Object} Configuración de estilos
 */
export const getEstadoSuscripcionConfig = (estado) => {
  const configs = {
    'activa': {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200'
    },
    'expirada': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    'cancelada': {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200'
    }
  };
  return configs[estado] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
};