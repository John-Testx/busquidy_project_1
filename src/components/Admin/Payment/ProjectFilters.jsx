import React from "react";
import { Search, Filter, CreditCard } from "lucide-react";

const ProjectFilters = React.memo(({ filtro, setFiltro }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
      <div className="flex flex-wrap gap-3">
        {/* Búsqueda */}
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar por ID, correo, monto..." 
              value={filtro.searchTerm}
              onChange={(e) => setFiltro({...filtro, searchTerm: e.target.value})}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Filtro Estado */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <select 
            value={filtro.estado}
            onChange={(e) => setFiltro({...filtro, estado: e.target.value})}
            className="pl-9 pr-8 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
          >
            <option value="">Estado de Pago</option>
            <option value="Completado">Completado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Fallido">Fallido</option>
          </select>
        </div>

        {/* Filtro Método */}
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <select 
            value={filtro.metodo}
            onChange={(e) => setFiltro({...filtro, metodo: e.target.value})}
            className="pl-9 pr-8 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
          >
            <option value="">Método de Pago</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="PayPal">PayPal</option>
            <option value="Transferencia">Transferencia</option>
          </select>
        </div>

        {/* Filtro Fechas */}
        <input 
          type="date" 
          value={filtro.fechaInicio}
          onChange={(e) => setFiltro({...filtro, fechaInicio: e.target.value})}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm"
        />
        
        <input 
          type="date" 
          value={filtro.fechaFin}
          onChange={(e) => setFiltro({...filtro, fechaFin: e.target.value})}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm"
        />
      </div>
    </div>
  );
});

ProjectFilters.displayName = 'ProjectFilters';

export default ProjectFilters;