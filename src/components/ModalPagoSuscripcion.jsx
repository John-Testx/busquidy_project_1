import React from 'react';
import useSubscription from '../hooks/useSubscription';

const ModalPagoSuscripcion = ({ id_usuario, tipo_usuario, closeModal }) => {
    const {
        loading,
        error,
        planSeleccionado,
        setPlanSeleccionado,
        metodoPago,
        setMetodoPago,
        planesActuales,
        handlePayment,
        getPlanSeleccionado
    } = useSubscription(id_usuario, tipo_usuario);

    const currentPlan = getPlanSeleccionado();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-[modalSlideIn_0.3s_ease-out]">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#07767c] to-[#0a9199] px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            Suscripción {tipo_usuario.charAt(0).toUpperCase() + tipo_usuario.slice(1)}
                        </h2>
                    </div>
                    <button
                        onClick={closeModal}
                        className="text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200 hover:rotate-90"
                        aria-label="Cerrar modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-[slideIn_0.3s_ease-out]">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Plan Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Selecciona tu plan
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {planesActuales.map(plan => (
                                <button
                                    key={plan.id_plan}
                                    onClick={() => setPlanSeleccionado(plan.id_plan)}
                                    className={`
                                        p-4 rounded-xl border-2 transition-all duration-200 text-left
                                        ${planSeleccionado === plan.id_plan
                                            ? 'border-[#07767c] bg-[#07767c]/5 shadow-md scale-105'
                                            : 'border-gray-200 bg-white hover:border-[#0a9199] hover:shadow-sm'
                                        }
                                    `}
                                >
                                    <div className="font-bold text-gray-800 text-lg mb-1">
                                        {plan.nombre}
                                    </div>
                                    <div className="text-2xl font-extrabold text-[#07767c]">
                                        ${plan.precio.toLocaleString()}
                                        <span className="text-sm font-normal text-gray-500 ml-1">CLP</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Plan Details */}
                    {currentPlan && (
                        <div className="bg-gradient-to-br from-[#07767c]/5 to-cyan-50 rounded-xl p-6 mb-6 border border-[#07767c]/20">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-[#07767c]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                                Beneficios Incluidos
                            </h3>
                            <ul className="space-y-3">
                                {currentPlan.beneficios.map((beneficio, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">{beneficio}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Payment Method Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Método de Pago
                        </label>
                        <select
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#07767c] focus:ring-4 focus:ring-[#07767c]/10 transition-all outline-none bg-white text-gray-800 font-medium"
                        >
                            <option value="webpay">💳 Webpay</option>
                            <option value="transferencia">🏦 Transferencia Bancaria</option>
                        </select>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 px-6 py-5 flex flex-col sm:flex-row gap-3 sm:justify-end border-t border-gray-200">
                    <button
                        onClick={closeModal}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold bg-white hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handlePayment}
                        disabled={loading || !currentPlan}
                        className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#07767c] to-[#0a9199] hover:from-[#055a5f] hover:to-[#077d84] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Procesando...</span>
                            </>
                        ) : (
                            currentPlan && (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <span>Pagar ${currentPlan.precio.toLocaleString()} CLP</span>
                                </>
                            )
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalPagoSuscripcion;