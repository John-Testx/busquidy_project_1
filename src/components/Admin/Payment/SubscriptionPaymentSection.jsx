import React, { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import SubscriptionFilters from "./SubscriptionFilters";
import SubscriptionTableDisplay from "./SubscriptionTableDisplay";
import { formatCurrency } from "@/common/utils";

const SubscriptionPaymentSection = React.memo(({ pagos }) => {
  const [filtro, setFiltro] = useState({
    searchTerm: '',
    estado: '',
    plan: '',
    fechaInicio: '',
    fechaFin: ''
  });

  // Filtrar pagos con useMemo
  const pagosFiltrados = useMemo(() => {
    return pagos.filter(pago => {
      const matchSearchTerm = filtro.searchTerm === '' || 
        Object.values(pago).some(valor => 
          valor?.toString().toLowerCase().includes(filtro.searchTerm.toLowerCase())
        );
      
      const matchEstado = filtro.estado === '' || pago.estado_pago === filtro.estado;
      const matchPlan = filtro.plan === '' || pago.plan_suscripcion === filtro.plan;
      
      const matchFechaInicio = !filtro.fechaInicio || 
        new Date(pago.fecha_pago) >= new Date(filtro.fechaInicio);
      
      const matchFechaFin = !filtro.fechaFin || 
        new Date(pago.fecha_pago) <= new Date(filtro.fechaFin);

      return matchSearchTerm && matchEstado && matchPlan && matchFechaInicio && matchFechaFin;
    });
  }, [pagos, filtro]);

  // Calcular estadísticas con useMemo
  const stats = useMemo(() => ({
    total: pagos.length,
    activas: pagos.filter(s => s.estado_suscripcion === 'activa').length,
    expiradas: pagos.filter(s => s.estado_suscripcion === 'expirada').length,
    totalMonto: pagos.reduce((sum, s) => sum + Number(s.monto || 0), 0)
  }), [pagos]);

  return (
    <div className="space-y-6">
      {/* Header y Estadísticas */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-[#07767c]" />
            Pagos de Suscripciones
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Mostrando {pagosFiltrados.length} de {pagos.length} suscripciones
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-400">
          <p className="text-xs md:text-sm text-gray-600 font-medium">Total Suscripciones</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-emerald-400">
          <p className="text-xs md:text-sm text-gray-600 font-medium">Activas</p>
          <p className="text-2xl md:text-3xl font-bold text-emerald-600">{stats.activas}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-400">
          <p className="text-xs md:text-sm text-gray-600 font-medium">Expiradas</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">{stats.expiradas}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-400">
          <p className="text-xs md:text-sm text-gray-600 font-medium">Total Ingresos</p>
          <p className="text-lg md:text-xl font-bold text-purple-600">
            {formatCurrency(stats.totalMonto)}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <SubscriptionFilters filtro={filtro} setFiltro={setFiltro} />

      {/* Tabla */}
      <SubscriptionTableDisplay pagosFiltrados={pagosFiltrados} />
    </div>
  );
});

SubscriptionPaymentSection.displayName = 'SubscriptionPaymentSection';

export default SubscriptionPaymentSection;