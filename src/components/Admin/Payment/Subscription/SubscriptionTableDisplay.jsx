import React from "react";
import {
  User,
  Mail,
  DollarSign,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { formatDateToLocale, formatCurrency, getEstadoPagoConfig, getEstadoSuscripcionConfig } from "@/common/utils";

const SubscriptionTableDisplay = React.memo(({ pagosFiltrados }) => {
  const getIconComponent = (iconName) => {
    const icons = {
      CheckCircle: CheckCircle,
      AlertTriangle: AlertTriangle,
      XCircle: XCircle
    };
    const IconComponent = icons[iconName] || AlertTriangle;
    return <IconComponent className="w-3.5 h-3.5" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#07767c] to-[#055a5f]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Correo</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Monto</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Plan</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Fecha Pago</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Estado Pago</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Estado Suscripción</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Método</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Inicio</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Fin</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pagosFiltrados.map((pago, index) => {
              const estadoPagoConfig = getEstadoPagoConfig(pago.estado_pago);
              const estadoSuscripcionConfig = getEstadoSuscripcionConfig(pago.estado_suscripcion);
              
              return (
                <tr 
                  key={pago.id_pago} 
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[#07767c]/5 transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-[#07767c]">
                      #{pago.id_pago}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{pago.id_usuario}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 truncate max-w-[200px]">{pago.correo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-base font-bold text-purple-600 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {formatCurrency(pago.monto)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {pago.nombre_plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDateToLocale(pago.fecha_pago)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${estadoPagoConfig.bg} ${estadoPagoConfig.text} ${estadoPagoConfig.border}`}>
                      {getIconComponent(estadoPagoConfig.iconName)}
                      {pago.estado_pago}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${estadoSuscripcionConfig.bg} ${estadoSuscripcionConfig.text} ${estadoSuscripcionConfig.border}`}>
                      {pago.estado_suscripcion || 'Sin definir'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {pago.metodo_pago}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDateToLocale(pago.fecha_inicio)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDateToLocale(pago.fecha_fin)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95">
                        Reembolsar
                      </button>
                      <button className="px-3 py-1.5 bg-[#07767c] text-white text-xs font-medium rounded-lg hover:bg-[#055a5f] transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95">
                        Resolver
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {pagosFiltrados.map((pago) => {
          const estadoPagoConfig = getEstadoPagoConfig(pago.estado_pago);
          const estadoSuscripcionConfig = getEstadoSuscripcionConfig(pago.estado_suscripcion);
          
          return (
            <div key={pago.id_pago} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <span className="text-lg font-bold text-[#07767c]">#{pago.id_pago}</span>
                <div className="flex flex-col gap-1 items-end">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${estadoPagoConfig.bg} ${estadoPagoConfig.text} ${estadoPagoConfig.border}`}>
                    {getIconComponent(estadoPagoConfig.iconName)}
                    {pago.estado_pago}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${estadoSuscripcionConfig.bg} ${estadoSuscripcionConfig.text} ${estadoSuscripcionConfig.border}`}>
                    {pago.estado_suscripcion || 'Sin definir'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{pago.correo}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    <span className="text-lg font-bold text-purple-600">
                      {formatCurrency(pago.monto)}
                    </span>
                  </div>
                  
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {pago.nombre_plan}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Inicio: {formatDateToLocale(pago.fecha_inicio)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Fin: {formatDateToLocale(pago.fecha_fin)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center px-2 py-1 rounded-md font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {pago.metodo_pago}
                  </span>
                  <span className="text-gray-500">
                    {formatDateToLocale(pago.fecha_pago)}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button className="flex-1 px-3 py-2 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors">
                  Reembolsar
                </button>
                <button className="flex-1 px-3 py-2 bg-[#07767c] text-white text-xs font-medium rounded-lg hover:bg-[#055a5f] transition-colors">
                  Resolver
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {pagosFiltrados.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-lg font-medium">No se encontraron suscripciones</p>
          <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
});

SubscriptionTableDisplay.displayName = 'SubscriptionTableDisplay';

export default SubscriptionTableDisplay;