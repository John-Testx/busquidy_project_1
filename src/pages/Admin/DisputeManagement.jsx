import React from "react";
import DisputeTable from "@/components/Admin/Dispute/DisputeTable";
import { Scale } from "lucide-react";

function DisputeManagement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-[#07767c] to-[#055a5f] rounded-xl shadow-lg">
              <Scale className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                Gestión de Disputas
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Administra pagos retenidos y procesa reembolsos
              </p>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <DisputeTable />
      </div>
    </div>
  );
}

export default DisputeManagement;