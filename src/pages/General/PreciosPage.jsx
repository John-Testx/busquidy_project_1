import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, TrendingUp, Zap, X } from "lucide-react";
import { useAuth } from "@/hooks";
import { getSubscriptionPlans } from "@/api/paymentApi";
import ModalPagoSuscripcion from "@/components/ModalPagoSuscripcion";
import LoginModal from "@/components/Home/Modals/LoginModal";
import LoginSecondaryModal from "@/components/Home/Modals/LoginSecondaryModal";
import LoadingScreen from "@/components/LoadingScreen";
import MainLayout from "@/components/Layouts/MainLayout";

function PreciosPage() {
  const navigate = useNavigate();
  const { isAuthenticated, tipo_usuario, id_usuario } = useAuth();
  
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

  // Cargar planes al montar
  useEffect(() => {
    fetchAllPlans();
  }, []);

  const fetchAllPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener planes para cada tipo de usuario
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
    } catch (err) {
      console.error("Error cargando planes:", err);
      setError("No pudimos cargar los planes. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan, tipoUsuario) => {
    if (!isAuthenticated) {
      // Si no está autenticado, guardar el plan y abrir modal de login
      setSelectedPlan({ ...plan, tipo_usuario: tipoUsuario });
      setShowLoginModal(true);
      return;
    }

    // Verificar que el tipo de usuario coincida
    if (tipo_usuario !== tipoUsuario) {
      alert(`Este plan es para usuarios tipo "${tipoUsuario}". Tu cuenta es de tipo "${tipo_usuario}".`);
      return;
    }

    // Si está autenticado y el tipo coincide, abrir modal de pago
    setSelectedPlan({ ...plan, tipo_usuario: tipoUsuario });
    setIsPaymentModalOpen(true);
  };

  const handleLoginSuccess = () => {
    // Después del login exitoso, si hay un plan seleccionado, abrir modal de pago
    setShowLoginModal(false);
    setShowLoginSecondaryModal(false);
    
    if (selectedPlan) {
      setIsPaymentModalOpen(true);
    }
  };

  const PlanCard = ({ plan, tipoUsuario, destacado = false }) => {
    const beneficios = Array.isArray(plan.beneficios) ? plan.beneficios : [];
    
    return (
      <div className={`relative bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
        destacado 
          ? 'border-[#07767c] shadow-xl scale-105' 
          : 'border-gray-200 hover:border-[#40E0D0]'
      }`}>
        {destacado && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#07767c] to-[#40E0D0] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
            <Sparkles className="inline w-4 h-4 mr-1" />
            Más Popular
          </div>
        )}

        <div className={`p-8 ${destacado ? 'pt-12' : ''}`}>
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.nombre}</h3>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-extrabold text-[#07767c]">
                ${plan.precio?.toLocaleString("es-CL")}
              </span>
              <span className="text-gray-500 font-medium">/mes</span>
            </div>
          </div>

          {/* Descripción */}
          {plan.descripcion && (
            <p className="text-center text-gray-600 mb-6 min-h-[3rem]">
              {plan.descripcion}
            </p>
          )}

          {/* Beneficios */}
          <div className="space-y-3 mb-8">
            {beneficios.length > 0 ? (
              beneficios.map((beneficio, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{beneficio}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center italic">Sin beneficios especificados</p>
            )}
          </div>

          {/* Botón */}
          <button
            onClick={() => handleSelectPlan(plan, tipoUsuario)}
            className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-300 ${
              destacado
                ? 'bg-gradient-to-r from-[#07767c] to-[#40E0D0] text-white hover:shadow-xl hover:from-[#05595d] hover:to-[#07767c]'
                : 'bg-white border-2 border-[#07767c] text-[#07767c] hover:bg-[#07767c] hover:text-white'
            }`}
          >
            Contratar Ahora
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <LoadingScreen />;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Planes y <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#07767c] to-[#40E0D0]">Precios</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Elige el plan perfecto para ti y comienza a transformar tu forma de trabajar
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

          {/* Planes para Empresas (Cliente Jurídico) */}
          {planes.empresa_juridico.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Empresas (Cliente Jurídico)</h2>
                  <p className="text-gray-600">Ideal para empresas constituidas legalmente</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {planes.empresa_juridico.map((plan, index) => (
                  <PlanCard 
                    key={plan.id_plan} 
                    plan={plan} 
                    tipoUsuario="empresa_juridico"
                    destacado={index === 1} 
                  />
                ))}
              </div>
            </section>
          )}

          {/* Planes para Empresas (Cliente Natural) */}
          {planes.empresa_natural.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Empresas (Cliente Natural)</h2>
                  <p className="text-gray-600">Perfecto para emprendedores y profesionales independientes</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {planes.empresa_natural.map((plan, index) => (
                  <PlanCard 
                    key={plan.id_plan} 
                    plan={plan} 
                    tipoUsuario="empresa_natural"
                    destacado={index === 1}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Planes para Freelancers (Estudiantes) */}
          {planes.freelancer.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Freelancers (Estudiantes)</h2>
                  <p className="text-gray-600">Diseñado para estudiantes y freelancers emergentes</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {planes.freelancer.map((plan, index) => (
                  <PlanCard 
                    key={plan.id_plan} 
                    plan={plan} 
                    tipoUsuario="freelancer"
                    destacado={index === 1}
                  />
                ))}
              </div>
            </section>
          )}

          {/* CTA Final */}
          <div className="bg-gradient-to-r from-[#07767c] to-[#40E0D0] rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">¿Necesitas ayuda para elegir?</h2>
            <p className="text-xl mb-8 text-white/90">
              Nuestro equipo está listo para asesorarte y encontrar el plan perfecto para ti
            </p>
            <button 
              onClick={() => navigate("/soportehome")}
              className="px-8 py-3 bg-white text-[#07767c] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
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
          closeModal={() => {
            setIsPaymentModalOpen(false);
            setSelectedPlan(null);
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