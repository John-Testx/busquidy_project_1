import React, { useState, useMemo } from "react";
import { Package, RefreshCw } from "lucide-react";
import ProjectFilters from "./ProjectFilters";
import ProjectTableDisplay from "./ProjectTableDisplay";
import { formatCurrency } from "@/common/utils";

const ProjectPaymentSection = React.memo(({ pagos, loading, onRefresh }) => {
  const [filtro, setFiltro] = useState({
    searchTerm: '',
    estado: '',
    metodo: '',
    fechaInicio: '',
    fechaFin: ''
  });

  // Filtrar pagos con useMemo para optimizar rendimiento
  const pagosFiltrados = useMemo(() => {
    return pagos.filter(pago => {
      const matchSearchTerm = filtro.searchTerm === '' || 
        Object.values(pago).some(valor => 
          valor?.toString().toLowerCase().includes(filtro.searchTerm.toLowerCase())
        );
      
      const matchEstado = filtro.estado === '' || pago.estado_pago === filtro.estado;
      const matchMetodo = filtro.metodo === '' || pago.metodo_pago === filtro.metodo;
      
      const matchFechaInicio = !filtro.fechaInicio || 
        new Date(pago.fecha_pago) >= new Date(filtro.fechaInicio);
      
      const matchFechaFin = !filtro.fechaFin || 
        new Date(pago.fecha_pago) <= new Date(filtro.fechaFin);

      return matchSearchTerm && matchEstado && matchMetodo && matchFechaInicio && matchFechaFin;
    });
  }, [pagos, filtro]);

  // Calcular estadísticas con useMemo
  const stats = useMemo(() => ({
    total: pagos.length,
    completados: pagos.filter(p => p.estado_pago === 'Completado').length,
    pendientes: pagos.filter(p => p.estado_pago === 'Pendiente').length,
    totalMonto: pagos.reduce((sum, p) => sum + Number(p.monto || 0), 0)
  }), [pagos]);

  return (
    <div className="space-y-6 mb-12">
      {/* Header y Estadísticas */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-7 h-7 text-[#07767c]" />
            Pagos de Proyectos
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Mostrando {pagosFiltrados.length} de {pagos.length} pagos
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">Recargar</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-400">
          <p className="text-xs md:text-sm text-gray-600 font-medium">Total Pagos</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-400">
          <p className="text-xs md:text-sm text-gray-600 font-medium">Completados</p>
          <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.completados}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-400">
          <p className="text-xs md:text-sm text-gray-600 font-medium">Pendientes</p>
          <p className="text-2xl md:text-3xl font-bold text-yellow-600">{stats.pendientes}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-emerald-400">
          <p className="text-xs md:text-sm text-gray-600 font-medium">Total Ingresos</p>
          <p className="text-lg md:text-xl font-bold text-emerald-600">
            {formatCurrency(stats.totalMonto)}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <ProjectFilters filtro={filtro} setFiltro={setFiltro} />

      {/* Tabla */}
      <ProjectTableDisplay pagosFiltrados={pagosFiltrados} />
    </div>
  );
});

ProjectPaymentSection.displayName = 'ProjectPaymentSection';

export default ProjectPaymentSection;