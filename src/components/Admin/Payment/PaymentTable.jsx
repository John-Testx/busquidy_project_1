import React, { useEffect, useState } from "react";
import { getPagosProyectos, getPagosSuscripciones } from "../../../api/paymentApi";

function PaymentTable() {
    const [pagoProyecto, setPagoProyecto] = useState([]);
    const [pagoSuscripcion, setPagoSuscripcion] = useState([]);
    
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
            const response = await getPagosProyectos();
            setPagoProyecto(response.data);
        } catch (error) {
            console.error('Error al cargar los pagos de proyectos:', error);
        }
    };

    const cargarPagosSuscripciones = async () => {
        try {
            const response = await getPagosSuscripciones();
            setPagoSuscripcion(response.data);
        } catch (error) {
            console.error('Error al cargar los pagos de suscripciones:', error);
        }
    };

    useEffect(() => {
        cargarPagosProyectos();
        cargarPagosSuscripciones();
    }, []);

    function formatDateToLocale(dateString) {
        if (!dateString) return 'Fecha no disponible';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-CL', {
            dateStyle: 'short',
        }).format(date);
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

    function renderFiltrosProyecto() {
        return (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg mb-4 flex flex-wrap gap-3">
                <input 
                    type="text" 
                    placeholder="Buscar..." 
                    value={filtroProyecto.searchTerm}
                    onChange={(e) => setFiltroProyecto({...filtroProyecto, searchTerm: e.target.value})}
                    className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent outline-none transition-all"
                />
                <select 
                    value={filtroProyecto.estado}
                    onChange={(e) => setFiltroProyecto({...filtroProyecto, estado: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent outline-none transition-all bg-white"
                >
                    <option value="">Estado de Pago</option>
                    <option value="Completado">Completado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Fallido">Fallido</option>
                </select>
                <select 
                    value={filtroProyecto.metodo}
                    onChange={(e) => setFiltroProyecto({...filtroProyecto, metodo: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent outline-none transition-all bg-white"
                >
                    <option value="">Método de Pago</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Transferencia">Transferencia</option>
                </select>
                <input 
                    type="date" 
                    value={filtroProyecto.fechaInicio}
                    onChange={(e) => setFiltroProyecto({...filtroProyecto, fechaInicio: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent outline-none transition-all"
                />
                <input 
                    type="date" 
                    value={filtroProyecto.fechaFin}
                    onChange={(e) => setFiltroProyecto({...filtroProyecto, fechaFin: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent outline-none transition-all"
                />
            </div>
        );
    }

    function renderFiltrosSuscripcion() {
        return (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg mb-4 flex flex-wrap gap-3">
                <input 
                    type="text" 
                    placeholder="Buscar..." 
                    value={filtroSuscripcion.searchTerm}
                    onChange={(e) => setFiltroSuscripcion({...filtroSuscripcion, searchTerm: e.target.value})}
                    className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent outline-none transition-all"
                />
                <select 
                    value={filtroSuscripcion.estado}
                    onChange={(e) => setFiltroSuscripcion({...filtroSuscripcion, estado: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent outline-none transition-all bg-white"
                >
                    <option value="">Estado de Pago</option>
                    <option value="completado">Completado</option>
                    <option value="fallido">Fallido</option>
                    <option value="pendiente">Pendiente</option>
                </select>
                <select 
                    value={filtroSuscripcion.plan}
                    onChange={(e) => setFiltroSuscripcion({...filtroSuscripcion, plan: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent outline-none transition-all bg-white"
                >
                    <option value="">Plan de Suscripción</option>
                    <option value="mensual">Mensual</option>
                    <option value="anual">Anual</option>
                </select>
                <input 
                    type="date" 
                    value={filtroSuscripcion.fechaInicio}
                    onChange={(e) => setFiltroSuscripcion({...filtroSuscripcion, fechaInicio: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent outline-none transition-all"
                />
                <input 
                    type="date" 
                    value={filtroSuscripcion.fechaFin}
                    onChange={(e) => setFiltroSuscripcion({...filtroSuscripcion, fechaFin: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent outline-none transition-all"
                />
            </div>
        );
    }

    function renderPagoProyectoTable() {
        const pagosFiltrados = filtrarPagosProyectos(pagoProyecto);

        return (
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 px-6 pt-6">Pagos de Proyectos</h2>
                <div className="px-6">
                    {renderFiltrosProyecto()}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#07767c] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">ID Pago</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">ID Usuario</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Correo Electrónico</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Monto</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Fecha de Pago</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Método</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {pagosFiltrados.map((pago, index) => (
                                <tr key={pago.id_pago} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{pago.id_pago}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{pago.id_usuario}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{pago.correo}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{pago.monto}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{formatDateToLocale(pago.fecha_pago)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{pago.estado_pago}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{pago.metodo_pago}</td>
                                    <td className="px-6 py-4 text-sm space-x-2">
                                        <button className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-sm">
                                            Reembolsar
                                        </button>
                                        <button className="px-3 py-1.5 bg-[#07767c] text-white text-xs font-semibold rounded-lg hover:bg-[#055a5f] transition-colors shadow-sm">
                                            Resolver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {pagosFiltrados.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 m-6 rounded-lg">
                        No se encontraron resultados
                    </div>
                )}
            </div>
        );
    }

    function renderPagoSuscripcionTable() {
        const pagosFiltrados = filtrarPagosSuscripciones(pagoSuscripcion);

        return (
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 px-6">Pagos de Suscripciones</h2>
                <div className="px-6">
                    {renderFiltrosSuscripcion()}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#07767c] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">ID Pago</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">ID Usuario</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Correo</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Monto</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Plan</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Fecha Pago</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Estado Pago</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Estado Suscripción</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Método</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Inicio</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Fin</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {pagosFiltrados.map((pago, index) => (
                                <tr key={pago.id_pago} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{pago.id_pago}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{pago.id_usuario}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{pago.correo}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{pago.monto}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{pago.nombre_plan}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{formatDateToLocale(pago.fecha_pago)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{pago.estado_pago}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            pago.estado_suscripcion === 'activa' ? 'bg-green-100 text-green-800' :
                                            pago.estado_suscripcion === 'expirada' ? 'bg-blue-100 text-blue-800' :
                                            pago.estado_suscripcion === 'cancelada' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {pago.estado_suscripcion || 'Sin definir'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{pago.metodo_pago}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{formatDateToLocale(pago.fecha_inicio)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{formatDateToLocale(pago.fecha_fin)}</td>
                                    <td className="px-6 py-4 text-sm space-x-2">
                                        <button className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-sm">
                                            Reembolsar
                                        </button>
                                        <button className="px-3 py-1.5 bg-[#07767c] text-white text-xs font-semibold rounded-lg hover:bg-[#055a5f] transition-colors shadow-sm">
                                            Resolver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {pagosFiltrados.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 m-6 rounded-lg">
                        No se encontraron resultados
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-6">
            {renderPagoProyectoTable()}
            {renderPagoSuscripcionTable()}
        </div>
    );
}

export default PaymentTable;