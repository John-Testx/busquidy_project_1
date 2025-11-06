import React from "react";
import { AlertTriangle } from "lucide-react";
import usePaymentData from "@/hooks/payment/usePaymentData";
import { ProjectPaymentSection } from './Project';
import { SubscriptionPaymentSection } from './Subscription';
import LoadingScreen from "@/components/LoadingScreen";

function PaymentTable() {
  const { pagoProyecto, pagoSuscripcion, loading, error, handleRefresh } = usePaymentData();

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-red-600 font-medium">Error al cargar los datos</p>
          <p className="text-sm text-gray-600 mt-2">Por favor, intenta nuevamente</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-6 py-2 bg-[#07767c] text-white rounded-lg hover:bg-[#055a5f] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProjectPaymentSection 
        pagos={pagoProyecto} 
        loading={loading} 
        onRefresh={handleRefresh} 
      />
      <SubscriptionPaymentSection 
        pagos={pagoSuscripcion} 
      />
    </div>
  );
}

export default PaymentTable;