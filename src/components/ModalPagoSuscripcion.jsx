import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Modals/ModalPagoSuscripcion.css';

const ModalPagoSuscripcion = ({ id_usuario, tipo_usuario, closeModal }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [planSeleccionado, setPlanSeleccionado] = useState(null);
    const [metodoPago, setMetodoPago] = useState('webpay');
    const [planesActuales, setPlanesActuales] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
    const API_URL_FRONT = import.meta.env.VITE_API_URL_FRONT || 'http://localhost:5173';

    // Fetch plans from backend
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get(`${API_URL}/payments/plan`, {
                    params: { tipo_usuario }
                });

                const plans = response.data.map(plan => ({
                    ...plan,
                    id_plan: Number(plan.id_plan),
                    precio: Number(plan.precio),
                    beneficios: Array.isArray(plan.beneficios) ? plan.beneficios : []
                }));

                setPlanesActuales(plans);
                if (plans.length > 0) setPlanSeleccionado(plans[0].id_plan);
            } catch (err) {
                console.error('Error fetching plans:', err.response?.data || err.message);
                setError('No se pudieron cargar los planes de suscripción.');
            }
        };
        fetchPlans();
    }, [tipo_usuario]);

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            const plan = planesActuales.find(p => p.id_plan === planSeleccionado);
            if (!plan) throw new Error('Plan no seleccionado o inválido');

            const paymentData = {
                amount: plan.precio,
                buyOrder: `SUB-${id_usuario}-${Date.now()}`,
                sessionId: `Session-${id_usuario}`,
                plan: plan.id_plan,
                tipoUsuario: tipo_usuario,
                metodoPago,
                returnUrl: `${API_URL_FRONT}/payment/return`
            };

            const response = await axios.post(
                `${API_URL}/payments/create_transaction_suscription`,
                paymentData,
                { headers: { 'Content-Type': 'application/json' } }
            );

            const { url, token } = response.data;
            if (!url || !token) throw new Error('No se recibió URL o token de Webpay');

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

    return (
        <div className="modal-suscripcion">
            <div className="modal-suscripcion-contenido">
                <div className="modal-header">
                    <h2>Suscripción {tipo_usuario.charAt(0).toUpperCase() + tipo_usuario.slice(1)}</h2>
                    <button onClick={closeModal} className="modal-close-btn">✕</button>
                </div>

                {error && <div className="error-mensaje">{error}</div>}

                <div className="plan-selector">
                    {planesActuales.map(plan => (
                        <button
                            key={plan.id_plan}
                            onClick={() => setPlanSeleccionado(plan.id_plan)}
                            className={`plan-btn ${planSeleccionado === plan.id_plan ? 'activo' : ''}`}
                        >
                            {plan.nombre}
                        </button>
                    ))}
                </div>

                {planSeleccionado && (
                    <div className="contenido-plan">
                        <div className="beneficios-plan">
                            <h3>Beneficios:</h3>
                            <ul>
                                {(planesActuales.find(p => p.id_plan === planSeleccionado)?.beneficios || []).map((b, i) => (
                                    <li key={i}>{b}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="detalles-plan">
                            <div className="precio">
                                ${planesActuales.find(p => p.id_plan === planSeleccionado)?.precio.toLocaleString()} CLP
                            </div>
                        </div>
                    </div>
                )}

                <div className="selector-metodo-pago">
                    <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                        <option value="webpay">Webpay</option>
                        <option value="transferencia">Transferencia Bancaria</option>
                    </select>
                </div>

                <div className="botones-modal">
                    <button onClick={closeModal} disabled={loading} className="btn btn-cancelar">Cancelar</button>
                    <button onClick={handlePayment} disabled={loading} className="btn btn-pagar">
                        {loading
                            ? 'Procesando...'
                            : `Pagar $${planesActuales.find(p => p.id_plan === planSeleccionado)?.precio.toLocaleString()}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalPagoSuscripcion;
