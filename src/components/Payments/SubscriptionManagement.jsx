import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, AlertCircle, Loader2, Star, BadgeCheck, Ban  } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks';
import { getAllSubscriptionPlans, getActiveSubscription, cancelSubscription } from '@/api/paymentApi'; 
import { useNavigate } from 'react-router-dom';
import ModalPagoSuscripcion from '@/components/ModalPagoSuscripcion';

const SubscriptionManagement = () => {
  const { tipo_usuario, id_usuario  } = useAuth();
  const navigate = useNavigate();
  const [availablePlans, setAvailablePlans] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // ⭐ NUEVO
  const [selectedPlan, setSelectedPlan] = useState(null); // ⭐ NUEVO

  useEffect(() => {
    fetchPlans();
  }, [tipo_usuario]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      // Usamos Promise.allSettled para que si una falla, la otra pueda continuar
      const [plansResult, activeSubResult] = await Promise.allSettled([
        getAllSubscriptionPlans(),
        getActiveSubscription()
      ]);

      // Manejar los planes
      if (plansResult.status === 'fulfilled') {
        setAvailablePlans(plansResult.value);
      } else {
        console.error('Error fetching plans:', plansResult.reason);
        // Si fallan los planes, es un error crítico
        setError('Error al cargar los planes de suscripción.');
        setLoading(false);
        return;
      }

      // Manejar la suscripción activa
      if (activeSubResult.status === 'fulfilled') {
        // Si el backend devuelve datos (incluso un objeto vacío si no hay sub), lo guardamos
        setActiveSubscription(activeSubResult.value);
      } else {
        // Si falla con 404 (Not Found), significa que no hay suscripción, lo cual no es un error.
        if (activeSubResult.reason?.response?.status === 404) {
          console.log('No active subscription found (404), this is OK.');
          setActiveSubscription(null);
        } else {
          // Otro error al buscar la suscripción (ej. 500)
          console.error('Error fetching active subscription:', activeSubResult.reason);
          setError('Error al verificar tu suscripción actual.');
        }
      }

    } catch (err) {
      // Error general
      console.error('Error fetching data:', err);
      setError('Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar tu suscripción? Tu plan seguirá activo hasta la fecha de vencimiento, pero no se renovará.')) {
      return;
    }

    try {
      setIsCanceling(true);
      const response = await cancelSubscription(); // Llamada a la API
      toast.success(response.message || 'Suscripción cancelada con éxito.');
      // Volver a cargar los datos para reflejar el estado "cancelada"
      fetchPlans(); 
    } catch (err) {
      console.error('Error canceling subscription:', err);
      toast.error(err.response?.data?.error || 'Error al cancelar la suscripción.');
    } finally {
      setIsCanceling(false);
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#07767c] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando planes de suscripción...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <XCircle className="text-red-500" size={24} />
          <div>
            <h3 className="font-bold text-red-900">Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Filtrar planes según tipo de usuario
  const filteredPlans = availablePlans.filter(plan => {
    if (!tipo_usuario || !plan.tipo_usuario) return true;

    const planType = plan.tipo_usuario.toLowerCase();
    const userType = tipo_usuario.toLowerCase();

    // Plan para ambos tipos de usuarios
    if (planType === 'ambos') return true;

    // Match exacto
    if (planType === userType) return true;

    // Planes genéricos de "empresa" para cualquier tipo de empresa
    if ((userType === 'empresa_natural' || userType === 'empresa_juridico') && planType === 'empresa') {
      return true;
    }

    return false;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-[#07767c] to-[#05595d] rounded-xl flex items-center justify-center">
            <CreditCard className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Planes de Suscripción</h2>
            <p className="text-gray-600 text-sm">Elige el plan que mejor se adapte a tus necesidades</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-blue-900 mb-1">Información importante</h3>
            <p className="text-blue-800 text-sm">
              Al seleccionar un plan, serás redirigido al proceso de pago seguro. 
              Podrás cancelar tu suscripción en cualquier momento.
            </p>
          </div>
        </div>
      </div>

      {/* Tu Plan Actual */}
      {activeSubscription && activeSubscription.id_suscripcion && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-green-600 p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BadgeCheck className="text-green-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">
                  Tu Plan Actual
                </h3>
              </div>
              <p className="text-2xl font-bold text-[#07767c] mb-1">
                {activeSubscription.Plan?.nombre || 'Plan Desconocido'}
              </p>
              <p className="text-gray-600 text-sm">
                Suscripción {activeSubscription.estado}.
              </p>
              <p className="text-gray-600 text-sm">
                Válida hasta: {new Date(activeSubscription.fecha_fin).toLocaleDateString('es-CL')}
              </p>
            </div>
            
            {activeSubscription.estado === 'activa' && (
              <button
                onClick={handleCancelSubscription}
                disabled={isCanceling}
                className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 disabled:opacity-50 flex items-center gap-2"
              >
                {isCanceling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Ban className="w-4 h-4" />
                )}
                {isCanceling ? 'Cancelando...' : 'Cancelar Suscripción'}
              </button>
            )}
            
            {activeSubscription.estado === 'cancelada' && (
               <p className="text-orange-600 bg-orange-100 border border-orange-300 px-4 py-2 rounded-lg text-sm font-semibold">
                 Tu plan no se renovará.
               </p>
            )}

          </div>
          <p className="text-xs text-gray-500 mt-4">
            Al cancelar, tu plan seguirá activo hasta la fecha de vencimiento, pero no se te cobrará el próximo período.
          </p>
        </div>
      )}

      {/* Available Plans */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          Planes Disponibles
        </h3>
        <p className="text-gray-600 text-sm mb-6">
          Todos los planes incluyen garantía de satisfacción
        </p>

        {filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => {
              const planPrice = parseFloat(plan.precio) || 0;
              const isFree = plan.es_plan_gratuito === 1 || planPrice === 0;
              const isFeatured = plan.es_destacado === 1;
              const isCurrentPlan = activeSubscription && activeSubscription.Plan?.id_plan === plan.id_plan;

              return (
                <div
                  key={plan.id_plan}
                  className={`relative border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-xl ${
                    isFeatured
                      ? 'border-[#07767c] bg-gradient-to-br from-[#07767c]/5 to-[#05595d]/5' 
                      : 'border-gray-200 hover:border-[#07767c]'
                  }`}
                >
                  {/* Badge para plan destacado */}
                  {isFeatured && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-[#07767c] to-[#05595d] text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star size={12} fill="currentColor" />
                        Más Popular
                      </div>
                    </div>
                  )}

                  {/* Plan gratuito badge */}
                  {isFree && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                        Gratis
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {plan.nombre}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 min-h-[40px]">
                      {plan.descripcion}
                    </p>
                    
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-[#07767c]">
                        ${planPrice.toLocaleString('es-CL')}
                      </span>
                      <span className="text-gray-600">
                        / {plan.duracion_dias} días
                      </span>
                    </div>
                    
                    {planPrice > 0 && (
                      <p className="text-xs text-gray-500">
                        ≈ ${(planPrice / (plan.duracion_dias / 30)).toFixed(0).toLocaleString('es-CL')} por mes
                      </p>
                    )}
                  </div>

                  {/* Límites del plan */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-1 text-xs">
                    {plan.limite_visualizacion_perfiles && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visualización perfiles:</span>
                        <span className="font-bold text-gray-900">
                          {plan.limite_visualizacion_perfiles === -1 ? 'Ilimitado' : plan.limite_visualizacion_perfiles}
                        </span>
                      </div>
                    )}
                    {plan.limite_publicacion_proyectos && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Publicación proyectos:</span>
                        <span className="font-bold text-gray-900">
                          {plan.limite_publicacion_proyectos === -1 ? 'Ilimitado' : plan.limite_publicacion_proyectos}
                        </span>
                      </div>
                    )}
                    {plan.limite_postulacion_proyectos && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Postulación proyectos:</span>
                        <span className="font-bold text-gray-900">
                          {plan.limite_postulacion_proyectos === -1 ? 'Ilimitado' : plan.limite_postulacion_proyectos}
                        </span>
                      </div>
                    )}
                    {plan.limite_postulacion_tareas && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Postulación tareas:</span>
                        <span className="font-bold text-gray-900">
                          {plan.limite_postulacion_tareas === -1 ? 'Ilimitado' : plan.limite_postulacion_tareas}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Beneficios */}
                  {plan.beneficios && plan.beneficios.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {plan.beneficios.map((beneficio, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                          <span className="text-gray-700">{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Botón de selección */}
                  <button
                    onClick={() => handleSelectPlan(plan)} // ⭐ Pasar el plan completo
                    disabled={isCurrentPlan} 
                    className={`w-full font-bold py-3 px-6 rounded-xl transition-all duration-300 ${
                      isCurrentPlan 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : isFeatured
                        ? 'bg-gradient-to-r from-[#07767c] to-[#05595d] hover:from-[#05595d] hover:to-[#07767c] text-white shadow-lg hover:shadow-xl'
                        : 'bg-white border-2 border-[#07767c] text-[#07767c] hover:bg-[#07767c] hover:text-white'
                    }`}
                  >
                    {isCurrentPlan
                      ? 'Plan Actual'
                      : isFree
                      ? 'Activar Plan Gratuito'
                      : 'Mejorar Plan'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay planes disponibles para tu tipo de usuario.</p>
            <p className="text-gray-400 text-sm mt-2">Tipo de usuario: <strong>{tipo_usuario}</strong></p>
          </div>
        )}
      </div>

      {/* FAQ o información adicional */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Preguntas Frecuentes</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-gray-900 mb-1">¿Puedo cambiar de plan?</h4>
            <p className="text-gray-600 text-sm">
              Sí, puedes cambiar tu plan en cualquier momento. El cambio se aplicará inmediatamente.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">¿Cómo cancelo mi suscripción?</h4>
            <p className="text-gray-600 text-sm">
              Puedes cancelar tu suscripción desde esta misma página cuando tengas un plan activo.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">¿Los precios incluyen impuestos?</h4>
            <p className="text-gray-600 text-sm">
              Los precios mostrados no incluyen IVA. Los impuestos se calcularán al momento del pago.
            </p>
          </div>
        </div>
      </div>
      {isPaymentModalOpen && selectedPlan && (
        <ModalPagoSuscripcion
          id_usuario={id_usuario}
          tipo_usuario={tipo_usuario}
          planPreseleccionado={selectedPlan.id_plan}
          closeModal={() => {
            setIsPaymentModalOpen(false);
            setSelectedPlan(null);
            fetchPlans(); // Recargar después de pagar
          }}
        />
      )}
    </div>
  );
};

export default SubscriptionManagement;