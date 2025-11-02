import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, TrendingUp, Zap, X, Lock, BadgeCheck, Ban, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks";
import { getSubscriptionPlans, getActiveSubscription, cancelSubscription } from "@/api/paymentApi";
import { toast } from 'react-toastify';
import ModalPagoSuscripcion from "@/components/ModalPagoSuscripcion";
import LoginModal from "@/components/Home/Modals/LoginModal";
import LoginSecondaryModal from "@/components/Home/Modals/LoginSecondaryModal";
import LoadingScreen from "@/components/LoadingScreen";
import MainLayout from "@/components/Layouts/MainLayout";

function PreciosPage() {
  const navigate = useNavigate();
  const { isAuthenticated, tipo_usuario, id_usuario, refresh } = useAuth();
  
  const [planes, setPlanes] = useState({
    empresa_juridico: [],
    empresa_natural: [],
    freelancer: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLoginSecondaryModal, setShowLoginSecondaryModal] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState(null); // ⭐ NUEVO
  const [isCanceling, setIsCanceling] = useState(false); // ⭐ NUEVO

  useEffect(() => {
    fetchAllPlans();
  }, [isAuthenticated, tipo_usuario]);

  const fetchAllPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const planesVacios = {
        empresa_juridico: [],
        empresa_natural: [],
        freelancer: []
      };
      setPlanes(planesVacios);

      if (isAuthenticated) {
        // ⭐ Obtener suscripción activa si está autenticado
        try {
          const activeSub = await getActiveSubscription();
          setActiveSubscription(activeSub);
        } catch (err) {
          if (err?.response?.status !== 404) {
            console.error('Error fetching active subscription:', err);
          }
          setActiveSubscription(null);
        }

        if (tipo_usuario) {
          const planesUsuario = await getSubscriptionPlans(tipo_usuario);
          
          setPlanes(prevPlanes => ({
             ...prevPlanes,
             [tipo_usuario]: planesUsuario || []
          }));
        }
      } else {
        const [planesEmpresaJuridico, planesEmpresaNatural, planesFreelancer] = await Promise.all([
          getSubscriptionPlans("empresa_juridico"),
          getSubscriptionPlans("empresa_natural"),
          getSubscriptionPlans("freelancer")
        ]);

        setPlanes({
          empresa_juridico: planesEmpresaJuridico || [],
          empresa_natural: planesEmpresaNatural || [],
          freelancer: planesFreelancer || []
        });
      }
      
    } catch (err) {
      console.error("Error cargando planes:", err);
      setError("No pudimos cargar los planes. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ NUEVA FUNCIÓN para cancelar suscripción
  const handleCancelSubscription = async () => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar tu suscripción? Tu plan seguirá activo hasta la fecha de vencimiento, pero no se renovará.')) {
      return;
    }

    try {
      setIsCanceling(true);
      const response = await cancelSubscription();
      toast.success(response.message || 'Suscripción cancelada con éxito.');
      fetchAllPlans(); // Recargar datos
    } catch (err) {
      console.error('Error canceling subscription:', err);
      toast.error(err.response?.data?.error || 'Error al cancelar la suscripción.');
    } finally {
      setIsCanceling(false);
    }
  };

  const handleSelectPlan = (plan, tipoUsuario) => {
    if (!isAuthenticated) {
      setSelectedPlan({ ...plan, tipo_usuario: tipoUsuario });
      setShowLoginModal(true);
      return;
    }

    if (tipo_usuario !== tipoUsuario) {
      alert(`Este plan es para usuarios tipo "${tipoUsuario}". Tu cuenta es de tipo "${tipo_usuario}".`);
      return;
    }

    setSelectedPlan({ ...plan, tipo_usuario: tipoUsuario });
    setIsPaymentModalOpen(true);
  };

  const handleLoginSuccess = () => {
    refresh();
    setShowLoginModal(false);
    setShowLoginSecondaryModal(false);
    
    if (selectedPlan) {
      setIsPaymentModalOpen(true);
    }
  };

  const PlanCard = ({ plan, tipoUsuario, destacado = false, compacto = false }) => {
    const beneficios = Array.isArray(plan.beneficios) ? plan.beneficios : [];
    const planPrice = parseFloat(plan.precio) || 0; // ⭐ NUEVO
    const isCurrentPlan = isAuthenticated && activeSubscription && activeSubscription.Plan?.id_plan === plan.id_plan; // ⭐ NUEVO
    
    return (
      <div className={`relative bg-white rounded-2xl border-2 transition-all duration-300 ${
        destacado 
          ? 'border-[#07767c] shadow-xl hover:shadow-2xl hover:-translate-y-2' 
          : 'border-gray-200 hover:border-[#40E0D0] hover:shadow-2xl hover:-translate-y-2'
      }`}>
        {destacado && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#07767c] to-[#40E0D0] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
            <Sparkles className="inline w-4 h-4 mr-1" />
            Más Popular
          </div>
        )}

        <div className={`${compacto ? 'p-6' : 'p-8'} ${destacado ? 'pt-12' : ''}`}>
          {/* Header */}
          <div className="text-center mb-4">
            <h3 className={`${compacto ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 mb-2`}>{plan.nombre}</h3>
            <div className="flex items-baseline justify-center gap-2">
              <span className={`${compacto ? 'text-4xl' : 'text-5xl'} font-extrabold text-[#07767c]`}>
                ${planPrice.toLocaleString("es-CL")} {/* ⭐ SIN DECIMALES */}
              </span>
              <span className="text-gray-500 font-medium">
                / {plan.duracion_dias} días
              </span>
            </div>
            {planPrice > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                ≈ ${Math.round(planPrice / (plan.duracion_dias / 30)).toLocaleString('es-CL')} por mes
              </p>
            )}
          </div>

          {/* Descripción */}
          {plan.descripcion && (
            <p className={`text-center text-gray-600 mb-4 ${compacto ? 'min-h-[2rem] text-sm' : 'min-h-[3rem]'}`}>
              {plan.descripcion}
            </p>
          )}

          {/* Beneficios */}
          <div className={`space-y-2 mb-6 ${compacto ? 'max-h-48 overflow-y-auto' : ''}`}>
            {beneficios.length > 0 ? (
              beneficios.map((beneficio, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className={`${compacto ? 'w-4 h-4' : 'w-5 h-5'} text-green-500 flex-shrink-0 mt-0.5`} />
                  <span className={`text-gray-700 ${compacto ? 'text-xs' : 'text-sm'}`}>{beneficio}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center italic">Sin beneficios especificados</p>
            )}
          </div>

          {/* Botón */}
          <button
            onClick={() => handleSelectPlan(plan, tipoUsuario)}
            disabled={isCurrentPlan} // ⭐ DESHABILITAR SI ES EL PLAN ACTUAL
            className={`w-full ${compacto ? 'py-3' : 'py-3.5'} rounded-xl font-bold ${compacto ? 'text-sm' : 'text-base'} transition-all duration-300 ${
              isCurrentPlan
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' // ⭐ ESTILO DESHABILITADO
                : destacado
                ? 'bg-gradient-to-r from-[#07767c] to-[#40E0D0] text-white hover:shadow-xl hover:from-[#05595d] hover:to-[#07767c]'
                : 'bg-white border-2 border-[#07767c] text-[#07767c] hover:bg-[#07767c] hover:text-white'
            }`}
          >
            {isCurrentPlan ? 'Plan Actual' : 'Contratar Ahora'} {/* ⭐ CAMBIAR TEXTO */}
          </button>
        </div>
      </div>
    );
  };

  // Función para obtener el plan gratuito o el más barato
  const getPlanGratuito = (planesArray) => {
    const planGratis = planesArray.find(plan => plan.precio === 0 || plan.precio === "0");
    if (planGratis) return planGratis;
    
    if (planesArray.length > 0) {
      return planesArray.reduce((min, plan) => 
        parseFloat(plan.precio) < parseFloat(min.precio) ? plan : min
      );
    }
    
    return null;
  };

  // Vista para usuarios NO autenticados
  const VistaNoAutenticado = () => {
    const planEmpresaJuridico = getPlanGratuito(planes.empresa_juridico);
    const planEmpresaNatural = getPlanGratuito(planes.empresa_natural);
    const planFreelancer = getPlanGratuito(planes.freelancer);

    const planesGratuitos = [
      { plan: planEmpresaJuridico, tipo: 'empresa_juridico', titulo: 'Empresas (Cliente Jurídico)', icono: TrendingUp, gradiente: 'from-blue-500 to-indigo-600' },
      { plan: planEmpresaNatural, tipo: 'empresa_natural', titulo: 'Empresas (Cliente Natural)', icono: Zap, gradiente: 'from-purple-500 to-pink-600' },
      { plan: planFreelancer, tipo: 'freelancer', titulo: 'Freelancers (Estudiantes)', icono: Sparkles, gradiente: 'from-green-500 to-emerald-600' }
    ].filter(item => item.plan !== null);

    if (planesGratuitos.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No hay planes disponibles en este momento</p>
        </div>
      );
    }

    return (
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Planes <span className="text-[#07767c]">Gratuitos</span>
          </h2>
          <p className="text-lg text-gray-600">
            Comienza sin costo y descubre todo lo que podemos ofrecerte
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {planesGratuitos.map(({ plan, tipo, titulo, icono: Icono, gradiente }) => (
            <div key={tipo} className="flex flex-col">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <div className={`w-8 h-8 bg-gradient-to-br ${gradiente} rounded-lg flex items-center justify-center`}>
                  <Icono className="text-white" size={16} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{titulo}</h3>
              </div>
              
              <PlanCard 
                plan={plan} 
                tipoUsuario={tipo}
                compacto={true}
              />
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-[#07767c]/10 to-[#40E0D0]/10 rounded-2xl border-2 border-[#07767c]/30 p-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#07767c] to-[#40E0D0] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Quieres ver más planes?
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              Inicia sesión para acceder a todos nuestros planes premium y encontrar el perfecto para ti
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-10 py-4 bg-gradient-to-r from-[#07767c] to-[#40E0D0] text-white font-bold text-lg rounded-xl hover:shadow-xl hover:from-[#05595d] hover:to-[#07767c] transition-all duration-300"
            >
              Iniciar Sesión para Ver Más
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Vista para usuarios autenticados
  const VistaAutenticado = () => {
    const planesUsuario = planes[tipo_usuario] || [];

    if (planesUsuario.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No hay planes disponibles para tu tipo de usuario</p>
        </div>
      );
    }

    const tipoInfo = {
      empresa_juridico: {
        titulo: 'Planes para tu Empresa',
        subtitulo: 'Ideal para empresas constituidas legalmente',
        icono: TrendingUp,
        gradiente: 'from-blue-500 to-indigo-600'
      },
      empresa_natural: {
        titulo: 'Planes para tu Empresa',
        subtitulo: 'Perfecto para emprendedores y profesionales independientes',
        icono: Zap,
        gradiente: 'from-purple-500 to-pink-600'
      },
      freelancer: {
        titulo: 'Planes para Freelancers',
        subtitulo: 'Diseñado para estudiantes y freelancers emergentes',
        icono: Sparkles,
        gradiente: 'from-green-500 to-emerald-600'
      }
    };

    const info = tipoInfo[tipo_usuario];
    const Icono = info.icono;

    return (
      <div className="space-y-8">
        {/* ⭐ MOSTRAR SUSCRIPCIÓN ACTIVA */}
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

        {/* PLANES DISPONIBLES */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-10 h-10 bg-gradient-to-br ${info.gradiente} rounded-lg flex items-center justify-center shadow-md`}>
              <Icono className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{info.titulo}</h2>
              <p className="text-gray-600">{info.subtitulo}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {planesUsuario.map((plan, index) => (
              <PlanCard 
                key={plan.id_plan} 
                plan={plan} 
                tipoUsuario={tipo_usuario}
                destacado={index === 1}
              />
            ))}
          </div>
        </section>
      </div>
    );
  };
  
  if (loading) return <LoadingScreen />;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Planes y <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#07767c] to-[#40E0D0]">Precios</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isAuthenticated 
                ? `Elige el plan perfecto para ti como ${tipo_usuario === 'empresa_juridico' ? 'Empresa Jurídica' : tipo_usuario === 'empresa_natural' ? 'Empresa Natural' : 'Freelancer'}`
                : 'Elige el plan perfecto para ti y comienza a transformar tu forma de trabajar'
              }
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
              <X className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-800 font-medium">{error}</p>
                <button 
                  onClick={fetchAllPlans}
                  className="text-red-600 hover:text-red-700 font-semibold text-sm mt-2"
                >
                  Intentar nuevamente
                </button>
              </div>
            </div>
          )}

          {/* Mostrar vista según autenticación */}
          {isAuthenticated ? <VistaAutenticado /> : <VistaNoAutenticado />}

          {/* CTA Final */}
          <div className="bg-gradient-to-r from-[#07767c] to-[#40E0D0] rounded-2xl p-12 text-center text-white shadow-2xl mt-16">
            <h2 className="text-3xl font-bold mb-4">¿Necesitas ayuda para elegir?</h2>
            <p className="text-xl mb-8 text-white/90">
              Nuestro equipo está listo para asesorarte y encontrar el plan perfecto para ti
            </p>
            <button 
              onClick={() => navigate("/soportehome")}
              className="px-8 py-3 bg-white text-[#07767c] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            >
              Contactar Soporte
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      {isPaymentModalOpen && selectedPlan && (
        <ModalPagoSuscripcion
          id_usuario={id_usuario}
          tipo_usuario={selectedPlan.tipo_usuario}
          planPreseleccionado={selectedPlan.id_plan}
          closeModal={() => {
            setIsPaymentModalOpen(false);
            setSelectedPlan(null);
            fetchAllPlans(); // Recargar después de pagar
          }}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => {
            setShowLoginModal(false);
            setSelectedPlan(null);
          }}
          onOpenSecondary={() => {
            setShowLoginModal(false);
            setShowLoginSecondaryModal(true);
          }}
          onOpenRegister={() => {
            setShowLoginModal(false);
            setSelectedPlan(null);
          }}
        />
      )}

      {showLoginSecondaryModal && (
        <LoginSecondaryModal
          onClose={() => {
            setShowLoginSecondaryModal(false);
            setSelectedPlan(null);
          }}
          onBack={() => {
            setShowLoginSecondaryModal(false);
            setShowLoginModal(true);
          }}
          onSuccess={handleLoginSuccess}
        />
      )}
    </MainLayout>
  );
}

export default PreciosPage;