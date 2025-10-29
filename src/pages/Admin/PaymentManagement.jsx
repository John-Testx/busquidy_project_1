import React, { useState } from "react";
import PaymentTable from "@/components/Admin/Payment/PaymentTable";
import PaymentAnalytics from "@/components/Admin/Payment/PaymentAnalytics";
import { CreditCard, BarChart3 } from "lucide-react";

function PaymentManagement() {
  const [activeTab, setActiveTab] = useState('tabla');
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-[#07767c] to-[#055a5f] rounded-xl shadow-lg">
              <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                Gestión de Pagos
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Administra transacciones y analiza ingresos
              </p>
            </div>
          </div>
        </div>
       
        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-xl bg-white shadow-lg p-1.5">
            <button
              onClick={() => setActiveTab('tabla')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'tabla'
                  ? 'bg-gradient-to-r from-[#07767c] to-[#055a5f] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#07767c] hover:bg-gray-50'
              }`}
            >
              <CreditCard size={18} />
              Tabla de Pagos
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-[#07767c] to-[#055a5f] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#07767c] hover:bg-gray-50'
              }`}
            >
              <BarChart3 size={18} />
              Análisis de Pagos
            </button>
          </div>
        </div>
       
        {/* Content */}
        <div>
          {activeTab === 'tabla' ? <PaymentTable /> : <PaymentAnalytics />}
        </div>
      </div>
    </div>
  );
}

export default PaymentManagement;