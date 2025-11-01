import { useState, useEffect } from 'react';
import { getSubscriptionPlans, createSubscriptionTransaction } from '@/api/paymentApi';

/**
 * Hook personalizado para manejar la lógica de suscripciones
 * @param {number} id_usuario - ID del usuario
 * @param {string} tipo_usuario - Tipo de usuario
 * @returns {Object} - Estado y funciones para gestionar suscripciones
 */
const useSubscription = (id_usuario, tipo_usuario) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [planSeleccionado, setPlanSeleccionado] = useState(null);
    const [metodoPago, setMetodoPago] = useState('webpay');
    const [planesActuales, setPlanesActuales] = useState([]);

    const API_URL_FRONT = import.meta.env.VITE_API_URL_FRONT || 'http://localhost:5173';

    // Obtener planes de suscripción al montar el componente
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await getSubscriptionPlans(tipo_usuario);

                const plans = data.map(plan => ({
                    ...plan,
                    id_plan: Number(plan.id_plan),
                    precio: Number(plan.precio),
                    beneficios: Array.isArray(plan.beneficios) ? plan.beneficios : []
                }));

                setPlanesActuales(plans);
                if (plans.length > 0) {
                    setPlanSeleccionado(plans[0].id_plan);
                }
            } catch (err) {
                console.error('Error fetching plans:', err.response?.data || err.message);
                setError('No se pudieron cargar los planes de suscripción.');
            }
        };

        if (tipo_usuario) {
            fetchPlans();
        }
    }, [tipo_usuario]);

    /**
     * Maneja el proceso de pago
     */
    const handlePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            const plan = planesActuales.find(p => p.id_plan === planSeleccionado);
            if (!plan) {
                throw new Error('Plan no seleccionado o inválido');
            }

            // Verificamos si es gratuito Y es_plan_gratuito (doble seguridad)
            if (plan.precio <= 0 && plan.es_plan_gratuito) {
                
                // Si es gratuito, llamamos a la API con un flag
                // Nota: El backend (Parte C) debe ser modificado para manejar esto
                const freePaymentData = {
                    amount: 0,
                    buyOrder: `SUB-FREE-${id_usuario}-${Date.now()}`,
                    sessionId: `Session-${id_usuario}`,
                    plan: plan.id_plan,
                    tipoUsuario: tipo_usuario,
                    metodoPago: 'gratuito', // Marcador especial
                    returnUrl: `${API_URL_FRONT}/payment/return`, // Aunque no se usará para redirigir
                    isFreePlan: true // Flag especial
                };

                // Usamos la misma función de API, pero el backend reaccionará al flag 'isFreePlan'
                const response = await createSubscriptionTransaction(freePaymentData);
                
                // Si el backend tiene éxito, nos devolverá un estado 'APPROVED' directamente
                if (response.status === 'APPROVED') {

                    // ===============================================
                    // =====      AQUÍ ESTÁ EL CAMBIO          =====
                    // ===============================================
                    
                    alert("¡Plan gratuito activado con éxito!"); // Opcional, para confirmar
                    
                    // Redirigimos al panel de control, NO a payment/return
                    // (Ajusta estas rutas si tu dashboard está en otro lugar)
                    if (tipo_usuario.includes('empresa')) {
                        window.location.href = '/empresa'; 
                    } else if (tipo_usuario === 'freelancer') {
                        window.location.href = '/freelancer';
                    } else {
                        window.location.href = '/'; // Fallback a la home
                    }

                    // La línea original que debes borrar es esta:
                    // window.location.href = `${API_URL_FRONT}/payment/return?status=success&type=free_subscription`;
                    
                    // ===============================================
                    // =====         FIN DEL CAMBIO             =====
                    // ===============================================

                } else {
                    throw new Error(response.error || 'No se pudo activar el plan gratuito');
                }
                
                // Detenemos la ejecución aquí
                return; 
            }
            // --- Si NO es gratuito, continuamos con el flujo normal de Webpay ---

            const paymentData = {
                amount: plan.precio,
                buyOrder: `SUB-${id_usuario}-${Date.now()}`,
                sessionId: `Session-${id_usuario}`,
                plan: plan.id_plan,
                tipoUsuario: tipo_usuario,
                metodoPago,
                returnUrl: `${API_URL_FRONT}/payment/return`
                // No enviamos 'isFreePlan' o es 'false'
            };
            
            const { url, token } = await createSubscriptionTransaction(paymentData);

            if (!url || !token) {
                throw new Error('No se recibió URL o token de Webpay');
            }

            // Redirigir a la pasarela de pago
            window.location.href = `${url}?token_ws=${token}`;
        } catch (err) {
            console.error('Error completo:', err.response?.data || err.message);
            
            if (err.response?.data?.code === 'ACTIVE_SUBSCRIPTION_EXISTS') {
                setError('Ya tienes una suscripción activa. Cancela tu suscripción actual para continuar.');
            } else {
                setError(`Error: ${err.response?.data?.error || err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtiene el plan actualmente seleccionado
     */
    const getPlanSeleccionado = () => {
        return planesActuales.find(p => p.id_plan === planSeleccionado);
    };

    return {
        loading,
        error,
        planSeleccionado,
        setPlanSeleccionado,
        metodoPago,
        setMetodoPago,
        planesActuales,
        handlePayment,
        getPlanSeleccionado
    };
};

export default useSubscription;