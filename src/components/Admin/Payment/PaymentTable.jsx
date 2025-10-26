import React, { useEffect, useState } from "react";
import { getProjectPayments, getSubscriptionPayments } from "@/api/paymentApi";
import { 
  Search, 
  Filter, 
  Calendar,
  DollarSign,
  CreditCard,
  Mail,
  User,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Package,
  TrendingUp
} from "lucide-react";

function PaymentTable() {
  const [pagoProyecto, setPagoProyecto] = useState([]);
  const [pagoSuscripcion, setPagoSuscripcion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filtroProyecto, setFiltroProyecto] = useState({
    searchTerm: '',
    estado: '',
    metodo: '',
    fechaInicio: '',
    fechaFin: ''
  });
  
  const [filtroSuscripcion, setFiltroSuscripcion] = useState({
    searchTerm: '',
    estado: '',
    plan: '',
    fechaInicio: '',
    fechaFin: ''
  });

  const cargarPagosProyectos = async () => {
    try {
      const response = await getProjectPayments();
      setPagoProyecto(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar los pagos de proyectos:', error);
      setError('Error al cargar pagos de proyectos');
    }
  };

  const cargarPagosSuscripciones = async () => {
    try {
      const response = await getSubscriptionPayments();
      setPagoSuscripcion(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar los pagos de suscripciones:', error);
      setError('Error al cargar pagos de suscripciones');
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      await Promise.all([cargarPagosProyectos(), cargarPagosSuscripciones()]);
      setLoading(false);
    };
    cargarDatos();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([cargarPagosProyectos(), cargarPagosSuscripciones()]);
    setLoading(false);
  };

  function formatDateToLocale(dateString) {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

  const filtrarPagosProyectos = (pagos) => {
    return pagos.filter(pago => {
      const matchSearchTerm = filtroProyecto.searchTerm === '' || 
        Object.values(pago).some(valor => 
          valor.toString().toLowerCase().includes(filtroProyecto.searchTerm.toLowerCase())
        );
      
      const matchEstado = filtroProyecto.estado === '' || pago.estado_pago === filtroProyecto.estado;
      const matchMetodo = filtroProyecto.metodo === '' || pago.metodo_pago === filtroProyecto.metodo;
      
      const matchFechaInicio = !filtroProyecto.fechaInicio || 
        new Date(pago.fecha_pago) >= new Date(filtroProyecto.fechaInicio);
      
      const matchFechaFin = !filtroProyecto.fechaFin || 
        new Date(pago.fecha_pago) <= new Date(filtroProyecto.fechaFin);

      return matchSearchTerm && matchEstado && matchMetodo && matchFechaInicio && matchFechaFin;
    });
  };

  const filtrarPagosSuscripciones = (pagos) => {
    return pagos.filter(pago => {
      const matchSearchTerm = filtroSuscripcion.searchTerm === '' || 
        Object.values(pago).some(valor => 
          valor.toString().toLowerCase().includes(filtroSuscripcion.searchTerm.toLowerCase())
        );
      
      const matchEstado = filtroSuscripcion.estado === '' || pago.estado_pago === filtroSuscripcion.estado;
      const matchPlan = filtroSuscripcion.plan === '' || pago.plan_suscripcion === filtroSuscripcion.plan;
      
      const matchFechaInicio = !filtroSuscripcion.fechaInicio || 
        new Date(pago.fecha_pago) >= new Date(filtroSuscripcion.fechaInicio);
      
      const matchFechaFin = !filtroSuscripcion.fechaFin || 
        new Date(pago.fecha_pago) <= new Date(filtroSuscripcion.fechaFin);

      return matchSearchTerm && matchEstado && matchPlan && matchFechaInicio && matchFechaFin;
    });
  };

  const getEstadoPagoConfig = (estado) => {
    const configs = {
      'Completado': {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: <CheckCircle className="w-3.5 h-3.5" />
      },
      'Pendiente': {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: <AlertTriangle className="w-3.5 h-3.5" />
      },
      'Fallido': {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: <XCircle className="w-3.5 h-3.5" />
      },
      'completado': {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: <CheckCircle className="w-3.5 h-3.5" />
      },
      'pendiente': {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: <AlertTriangle className="w-3.5 h-3.5" />
      },
      'fallido': {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: <XCircle className="w-3.5 h-3.5" />
      }
    };
    return configs[estado] || configs['Pendiente'];
  };

  const getEstadoSuscripcionConfig = (estado) => {
    const configs = {
      'activa': {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200'
      },
      'expirada': {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200'
      },
      'cancelada': {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200'
      }
    };
    return configs[estado] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
  };

  // Estadísticas
  const statsProyectos = {
    total: pagoProyecto.length,
    completados: pagoProyecto.filter(p => p.estado_pago === 'Completado').length,
    pendientes: pagoProyecto.filter(p => p.estado_pago === 'Pendiente').length,
    totalMonto: pagoProyecto.reduce((sum, p) => sum + Number(p.monto || 0), 0)
  };

  const statsSuscripciones = {
    total: pagoSuscripcion.length,
    activas: pagoSuscripcion.filter(s => s.estado_suscripcion === 'activa').length,
    expiradas: pagoSuscripcion.filter(s => s.estado_suscripcion === 'expirada').length,
    totalMonto: pagoSuscripcion.reduce((sum, s) => sum + Number(s.monto || 0), 0)
  };

  function renderFiltrosProyecto() {
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
                value={filtroProyecto.searchTerm}
                onChange={(e) => setFiltroProyecto({...filtroProyecto, searchTerm: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <select 
              value={filtroProyecto.estado}
              onChange={(e) => setFiltroProyecto({...filtroProyecto, estado: e.target.value})}
              className="pl-9 pr-8 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
            >
              <option value="">Estado de Pago</option>
              <option value="Completado">Completado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Fallido">Fallido</option>
            </select>
          </div>

          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <select 
              value={filtroProyecto.metodo}
              onChange={(e) => setFiltroProyecto({...filtroProyecto, metodo: e.target.value})}
              className="pl-9 pr-8 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
            >
              <option value="">Método de Pago</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="PayPal">PayPal</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>

          <input 
            type="date" 
            value={filtroProyecto.fechaInicio}
            onChange={(e) => setFiltroProyecto({...filtroProyecto, fechaInicio: e.target.value})}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm"
          />
          
          <input 
            type="date" 
            value={filtroProyecto.fechaFin}
            onChange={(e) => setFiltroProyecto({...filtroProyecto, fechaFin: e.target.value})}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm"
          />
        </div>
      </div>
    );
  }

  function renderFiltrosSuscripcion() {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
        <div className="flex flex-wrap gap-3">
          {/* Búsqueda */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar por ID, correo, plan..." 
                value={filtroSuscripcion.searchTerm}
                onChange={(e) => setFiltroSuscripcion({...filtroSuscripcion, searchTerm: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <select 
              value={filtroSuscripcion.estado}
              onChange={(e) => setFiltroSuscripcion({...filtroSuscripcion, estado: e.target.value})}
              className="pl-9 pr-8 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
            >
              <option value="">Estado de Pago</option>
              <option value="completado">Completado</option>
              <option value="fallido">Fallido</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>

          <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <select 
              value={filtroSuscripcion.plan}
              onChange={(e) => setFiltroSuscripcion({...filtroSuscripcion, plan: e.target.value})}
              className="pl-9 pr-8 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
            >
              <option value="">Plan de Suscripción</option>
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
            </select>
          </div>

          <input 
            type="date" 
            value={filtroSuscripcion.fechaInicio}
            onChange={(e) => setFiltroSuscripcion({...filtroSuscripcion, fechaInicio: e.target.value})}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm"
          />
          
          <input 
            type="date" 
            value={filtroSuscripcion.fechaFin}
            onChange={(e) => setFiltroSuscripcion({...filtroSuscripcion, fechaFin: e.target.value})}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm"
          />
        </div>
      </div>
    );
  }

  function renderPagoProyectoTable() {
    const pagosFiltrados = filtrarPagosProyectos(pagoProyecto);

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
              Mostrando {pagosFiltrados.length} de {pagoProyecto.length} pagos
            </p>
          </div>
          <button
            onClick={handleRefresh}
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
            <p className="text-2xl md:text-3xl font-bold text-gray-800">{statsProyectos.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-400">
            <p className="text-xs md:text-sm text-gray-600 font-medium">Completados</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600">{statsProyectos.completados}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-400">
            <p className="text-xs md:text-sm text-gray-600 font-medium">Pendientes</p>
            <p className="text-2xl md:text-3xl font-bold text-yellow-600">{statsProyectos.pendientes}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-emerald-400">
            <p className="text-xs md:text-sm text-gray-600 font-medium">Total Ingresos</p>
            <p className="text-lg md:text-xl font-bold text-emerald-600">
              {formatCurrency(statsProyectos.totalMonto)}
            </p>
          </div>
        </div>

        {/* Filtros */}
        {renderFiltrosProyecto()}

        {/* Tabla */}
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Método</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pagosFiltrados.map((pago, index) => {
                  const estadoConfig = getEstadoPagoConfig(pago.estado_pago);
                  
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
                        <span className="text-base font-bold text-emerald-600 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {formatCurrency(pago.monto)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDateToLocale(pago.fecha_pago)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${estadoConfig.bg} ${estadoConfig.text} ${estadoConfig.border}`}>
                          {estadoConfig.icon}
                          {pago.estado_pago}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {pago.metodo_pago}
                        </span>
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
              const estadoConfig = getEstadoPagoConfig(pago.estado_pago);
              
              return (
                <div key={pago.id_pago} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-lg font-bold text-[#07767c]">#{pago.id_pago}</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${estadoConfig.bg} ${estadoConfig.text} ${estadoConfig.border}`}>
                      {estadoConfig.icon}
                      {pago.estado_pago}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{pago.correo}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span className="text-lg font-bold text-emerald-600">
                          {formatCurrency(pago.monto)}
                        </span>
                      </div>
                      
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {pago.metodo_pago}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDateToLocale(pago.fecha_pago)}
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
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-lg font-medium">No se encontraron pagos</p>
              <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderPagoSuscripcionTable() {
    const pagosFiltrados = filtrarPagosSuscripciones(pagoSuscripcion);

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
              Mostrando {pagosFiltrados.length} de {pagoSuscripcion.length} suscripciones
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-400">
            <p className="text-xs md:text-sm text-gray-600 font-medium">Total Suscripciones</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-800">{statsSuscripciones.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-emerald-400">
            <p className="text-xs md:text-sm text-gray-600 font-medium">Activas</p>
            <p className="text-2xl md:text-3xl font-bold text-emerald-600">{statsSuscripciones.activas}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-400">
            <p className="text-xs md:text-sm text-gray-600 font-medium">Expiradas</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">{statsSuscripciones.expiradas}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-400">
            <p className="text-xs md:text-sm text-gray-600 font-medium">Total Ingresos</p>
            <p className="text-lg md:text-xl font-bold text-purple-600">
              {formatCurrency(statsSuscripciones.totalMonto)}
            </p>
          </div>
        </div>

        {/* Filtros */}
        {renderFiltrosSuscripcion()}

        {/* Tabla */}
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
                          {estadoPagoConfig.icon}
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
                        {estadoPagoConfig.icon}
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
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#07767c] animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

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
      {renderPagoProyectoTable()}
      {renderPagoSuscripcionTable()}
    </div>
  );
}

export default PaymentTable;