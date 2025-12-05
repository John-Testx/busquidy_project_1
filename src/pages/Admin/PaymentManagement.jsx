import React, { useState, useEffect } from "react";
import PaymentTable from "@/components/Admin/Payment/PaymentTable";
import PaymentAnalytics from "@/components/Admin/Payment/PaymentAnalytics";
import { CreditCard, BarChart3 } from "lucide-react";
import { getPendingExecutionPayments, markPaymentAsProcessed } from "@/api/paymentApi";
import Swal from 'sweetalert2';
import { Download, ExternalLink, CheckSquare } from "lucide-react"; // Iconos nuevos

function PaymentManagement() {
  const [activeTab, setActiveTab] = useState('tabla');

  const TreasuryTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await getPendingExecutionPayments();
            setOrders(data);
        } catch (error) {
            console.error("Error cargando tesorería:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExecute = async (order) => {
        const result = await Swal.fire({
            title: '¿Confirmar Transferencia?',
            html: `
                <p>Confirma que has realizado la transferencia bancaria por:</p>
                <h3 class="text-2xl font-bold text-emerald-600 my-2">$${Number(order.monto).toLocaleString('es-CL')}</h3>
                <p>A la cuenta de: <b>${order.rut_receptor || 'N/A'}</b></p>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, Transferencia Realizada',
            confirmButtonColor: '#10B981'
        });

        if (result.isConfirmed) {
            try {
                await markPaymentAsProcessed(order.id_orden);
                Swal.fire('Procesado', 'La orden ha sido marcada como completada.', 'success');
                loadOrders();
            } catch (err) {
                Swal.fire('Error', 'No se pudo actualizar la orden.', 'error');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando órdenes...</div>;

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-amber-50">
                <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Pagos Pendientes de Ejecución (Manual)
                </h3>
                <p className="text-sm text-amber-600">Estas transacciones requieren transferencia bancaria manual.</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                            <th className="p-4">ID Orden</th>
                            <th className="p-4">Proyecto</th>
                            <th className="p-4">Beneficiario</th>
                            <th className="p-4">Monto Líquido</th>
                            <th className="p-4 text-center">Documento</th>
                            <th className="p-4 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-400">No hay pagos pendientes</td></tr>
                        ) : orders.map((order) => (
                            <tr key={order.id_orden} className="hover:bg-gray-50">
                                <td className="p-4 font-mono text-xs">#{order.id_orden}</td>
                                <td className="p-4">
                                    <span className="block font-medium text-gray-900">{order.proyecto}</span>
                                    <span className="text-xs text-gray-500">ID: {order.id_proyecto}</span>
                                </td>
                                <td className="p-4">
                                    <span className="block text-gray-900">{order.email_beneficiario}</span>
                                    <span className="text-xs text-gray-500">{order.rut_receptor || 'Sin RUT'}</span>
                                </td>
                                <td className="p-4 font-bold text-emerald-600">
                                    ${Number(order.monto).toLocaleString('es-CL')}
                                </td>
                                <td className="p-4 text-center">
                                    {order.url_pdf ? (
                                        <a href={order.url_pdf} target="_blank" rel="noopener noreferrer" 
                                           className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            <Download size={16} /> PDF
                                        </a>
                                    ) : <span className="text-gray-400">-</span>}
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => handleExecute(order)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2 ml-auto"
                                    >
                                        <CheckSquare size={16} /> Confirmar Pago
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
 
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
            <button
              onClick={() => setActiveTab('tesoreria')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'tesoreria'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
              }`}
            >
              <CreditCard size={18} />
              Tesorería (Admin)
            </button>
          </div>
        </div>
       
        {/* Content */}
        <div>
          {activeTab === 'tabla' && <PaymentTable />}
          {activeTab === 'analytics' && <PaymentAnalytics />}
          {activeTab === 'tesoreria' && <TreasuryTable />}
        </div>
      </div>
    </div>
  );
}

export default PaymentManagement;