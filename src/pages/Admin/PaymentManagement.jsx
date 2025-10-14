import React, { useState } from "react";
import PaymentTable from "../../components/Admin/Payment/PaymentTable";
import PaymentAnalytics from "../../components/Admin/Payment/PaymentAnalytics";

function PaymentManagement() {
    const [activeTab, setActiveTab] = useState('tabla');
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Gestión de Pagos y Transacciones
                </h1>
                
                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex rounded-lg bg-white shadow-md p-1">
                        <button
                            onClick={() => setActiveTab('tabla')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                activeTab === 'tabla'
                                    ? 'bg-[#07767c] text-white shadow-lg'
                                    : 'text-gray-600 hover:text-[#07767c]'
                            }`}
                        >
                            Tabla de Pagos
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                activeTab === 'analytics'
                                    ? 'bg-[#07767c] text-white shadow-lg'
                                    : 'text-gray-600 hover:text-[#07767c]'
                            }`}
                        >
                            Análisis de Pagos
                        </button>
                    </div>
                </div>
                
                {/* Content */}
                <div className="bg-white rounded-xl shadow-lg">
                    {activeTab === 'tabla' ? <PaymentTable /> : <PaymentAnalytics />}
                </div>
            </div>
        </div>
    );
}

export default PaymentManagement;