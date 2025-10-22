import React from 'react';
import { useProjectPayment } from '@/hooks';

const ModalPublicarProyecto = ({ 
  id_usuario, 
  projectData, // ✅ CAMBIO: Recibe objeto con { id_proyecto, titulo, presupuesto }
  closeModal
}) => {
  const { loading, error, initiatePayment } = useProjectPayment();

  const API_URL_FRONT = import.meta.env.VITE_API_URL_FRONT || 'http://localhost:5173';

  console.log("ModalPublicarProyecto recibió projectData:", projectData);

  const handlePayment = async () => {
    const paymentData = {
      amount: projectData.presupuesto, // ✅ CAMBIO: Usar presupuesto dinámico
      buyOrder: `BO-${projectData.id_proyecto}`,
      sessionId: `Session-${id_usuario}`,
      returnUrl: `${API_URL_FRONT}/payment/return?next=${encodeURIComponent('/myprojects')}`,
      projectId: projectData.id_proyecto,
      companyId: id_usuario,
    };

    console.log("Datos de pago a enviar:", paymentData);
    await initiatePayment(paymentData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-[modalSlideIn_0.3s_ease-out]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#07767c] to-[#0a9199] px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">{projectData.titulo}</h2> {/* ✅ CAMBIO: Título dinámico */}
          </div>
          <button 
            onClick={closeModal} 
            className="text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200 hover:rotate-90"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="bg-gradient-to-br from-[#07767c]/5 to-cyan-50 p-6 rounded-xl border border-[#07767c]/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#07767c] to-[#0a9199] rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Costo de publicación</p>
                {/* ✅ CAMBIO: Mostrar presupuesto dinámico */}
                <p className="text-3xl font-bold text-[#07767c]">
                  ${Number(projectData.presupuesto).toLocaleString('es-CL')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div className="flex gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">¿Por qué pagar?</p>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Al publicar tu proyecto, el monto será retenido de forma segura hasta que el trabajo sea completado y aprobado. Esto protege tanto a tu empresa como al freelancer.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#07767c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ¿Qué incluye?
            </h3>
            <ul className="space-y-2">
              {[
                'Publicación destacada del proyecto',
                'Acceso a freelancers verificados',
                'Sistema de pago seguro (Escrow)',
                'Soporte prioritario',
                'Gestión de postulaciones'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex gap-3">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-900 mb-1">Error al procesar el pago</p>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 flex gap-4 border-t border-gray-200">
          <button
            onClick={closeModal}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#0a9199] hover:from-[#055a5f] hover:to-[#077d84] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pagar con Webpay
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ModalPublicarProyecto;