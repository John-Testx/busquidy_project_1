import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMyTransactions } from '@/api/paymentApi';
import { useAuth } from '@/hooks';
import { CreditCard, Calendar, DollarSign, FileText, Package, AlertCircle } from 'lucide-react';

function MyTransactionsPage() {
  const { tipo_usuario } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, suscripcion, proyecto

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getMyTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
      toast.error('Error al cargar el historial de transacciones');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'completado': { color: 'bg-green-100 text-green-800 border-green-300', text: 'Completado' },
      'pendiente': { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', text: 'Pendiente' },
      'rechazado': { color: 'bg-red-100 text-red-800 border-red-300', text: 'Rechazado' },
      'cancelado': { color: 'bg-gray-100 text-gray-800 border-gray-300', text: 'Cancelado' },
    };
    const config = statusMap[status?.toLowerCase()] || statusMap['pendiente'];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getTypeBadge = (tipo) => {
    const typeMap = {
      'suscripcion': { icon: <Package size={14} />, color: 'bg-blue-100 text-blue-800', text: 'Suscripción' },
      'proyecto': { icon: <FileText size={14} />, color: 'bg-purple-100 text-purple-800', text: 'Proyecto' },
      'liberacion_pago': { icon: <DollarSign size={14} />, color: 'bg-green-100 text-green-800', text: 'Liberación' },
    };
    const config = typeMap[tipo] || { icon: <CreditCard size={14} />, color: 'bg-gray-100 text-gray-800', text: tipo };
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatMonto = (monto) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(monto);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.tipo_pago === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#07767c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Cargando transacciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#07767c] to-[#05595d] rounded-xl flex items-center justify-center">
              <CreditCard className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Transacciones</h1>
              <p className="text-gray-600">Historial completo de tus pagos</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#07767c] to-[#05595d] text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#07767c]'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('suscripcion')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === 'suscripcion'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-500'
            }`}
          >
            Suscripciones
          </button>
          {(tipo_usuario === 'empresa_juridico' || tipo_usuario === 'empresa_natural') && (
            <button
              onClick={() => setFilter('proyecto')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'proyecto'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-500'
              }`}
            >
              Proyectos
            </button>
          )}
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No hay transacciones
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Aún no has realizado ninguna transacción'
                : `No hay transacciones de tipo ${filter}`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id_pago}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Side: Type, Date, Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      {getTypeBadge(transaction.tipo_pago)}
                      {getStatusBadge(transaction.estado_pago)}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>{formatDate(transaction.fecha_pago)}</span>
                    </div>

                    {/* Details based on type */}
                    {transaction.tipo_pago === 'suscripcion' && transaction.plan_nombre && (
                      <div className="flex items-start gap-2">
                        <Package size={16} className="text-[#07767c] mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Plan: {transaction.plan_nombre}
                          </p>
                          {transaction.suscripcion_inicio && (
                            <p className="text-xs text-gray-600">
                              Vigencia: {formatDate(transaction.suscripcion_inicio)} - {formatDate(transaction.suscripcion_fin)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {transaction.tipo_pago === 'proyecto' && transaction.proyecto_titulo && (
                      <div className="flex items-start gap-2">
                        <FileText size={16} className="text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Proyecto: {transaction.proyecto_titulo}
                          </p>
                          <p className="text-xs text-gray-600">ID: {transaction.id_proyecto}</p>
                        </div>
                      </div>
                    )}

                    {transaction.metodo_pago && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <CreditCard size={14} />
                        <span>Método: {transaction.metodo_pago}</span>
                      </div>
                    )}

                    {transaction.referencia_externa && (
                      <div className="text-xs text-gray-500">
                        Ref: {transaction.referencia_externa}
                      </div>
                    )}
                  </div>

                  {/* Right Side: Amount */}
                  <div className="lg:text-right">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-3 rounded-xl border-2 border-green-200">
                      <DollarSign className="text-green-600" size={24} />
                      <span className="text-2xl font-bold text-green-700">
                        {formatMonto(transaction.monto)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de transacciones</p>
                <p className="text-3xl font-bold text-gray-900">{filteredTransactions.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Monto total</p>
                <p className="text-3xl font-bold text-[#07767c]">
                  {formatMonto(filteredTransactions.reduce((sum, t) => sum + Number(t.monto || 0), 0))}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTransactionsPage;