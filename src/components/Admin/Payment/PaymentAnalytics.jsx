import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import usePaymentAnalytics from '@/hooks/usePaymentAnalytics';

const PaymentAnalytics = () => {
  const {
    tipoVisualizacion,
    setTipoVisualizacion,
    tipoGrafico,
    setTipoGrafico,
    filtroProyectos,
    setFiltroProyectos,
    filtroSuscripciones,
    setFiltroSuscripciones,
    loading,
    error,
    proyectosBarData,
    suscripcionesBarData,
    generalBarData,
    generalPieData,
    proyectosPieData,
    suscripcionesPieData,
    totales
  } = usePaymentAnalytics();

  const renderBarChart = (data, dataKeys, names) => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="mes" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip 
          formatter={(value, name) => [
            new Intl.NumberFormat('es-CL', { 
              style: 'currency', 
              currency: 'CLP' 
            }).format(value), 
            name
          ]}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        {Array.isArray(dataKeys) ? 
          dataKeys.map((key, index) => (
            <Bar 
              key={key} 
              dataKey={key} 
              fill={index === 0 ? '#07767c' : '#10b981'} 
              name={names[index]}
              radius={[8, 8, 0, 0]}
            />
          )) : 
          <Bar 
            dataKey={dataKeys} 
            fill="#07767c" 
            name={names}
            radius={[8, 8, 0, 0]}
          />
        }
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = (data) => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine
          outerRadius={120}
          innerRadius={60}
          fill="#8884d8"
          dataKey="value"
          isAnimationActive
          label={({ name, percent, value }) => `${name}: ${(percent * 100).toFixed(0)}% (${
            new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP'
            }).format(value)
          })`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [
            new Intl.NumberFormat('es-CL', { 
              style: 'currency', 
              currency: 'CLP' 
            }).format(value), 
            'Monto'
          ]}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderContent = () => {
    const chartTypeButtons = (
      <div className="flex justify-center gap-3 mb-6">
        <button 
          onClick={() => setTipoGrafico('general')}
          className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
            tipoGrafico === 'general'
              ? 'bg-[#07767c] text-white shadow-lg'
              : 'bg-white text-gray-600 border-2 border-[#07767c] hover:bg-[#07767c] hover:text-white'
          }`}
        >
          General
        </button>
        <button 
          onClick={() => setTipoGrafico('proyectos')}
          className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
            tipoGrafico === 'proyectos'
              ? 'bg-[#07767c] text-white shadow-lg'
              : 'bg-white text-gray-600 border-2 border-[#07767c] hover:bg-[#07767c] hover:text-white'
          }`}
        >
          Proyectos
        </button>
        <button 
          onClick={() => setTipoGrafico('suscripciones')}
          className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
            tipoGrafico === 'suscripciones'
              ? 'bg-[#07767c] text-white shadow-lg'
              : 'bg-white text-gray-600 border-2 border-[#07767c] hover:bg-[#07767c] hover:text-white'
          }`}
        >
          Suscripciones
        </button>
      </div>
    );

    if (tipoVisualizacion === 'barras') {
      return (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Proyectos:</label>
              <select 
                value={filtroProyectos} 
                onChange={(e) => setFiltroProyectos(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent outline-none transition-all"
              >
                <option value="todos">Todos</option>
                <option value="completados">Completados</option>
                <option value="pendientes">Pendientes</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Suscripciones:</label>
              <select 
                value={filtroSuscripciones} 
                onChange={(e) => setFiltroSuscripciones(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent outline-none transition-all"
              >
                <option value="todos">Todos</option>
                <option value="activas">Activas</option>
                <option value="vencidas">Vencidas</option>
              </select>
            </div>
          </div>
          {chartTypeButtons}
          <div>
            {tipoGrafico === 'proyectos' && renderBarChart(proyectosBarData, 'Proyectos', 'Pagos de Proyectos')}
            {tipoGrafico === 'suscripciones' && renderBarChart(suscripcionesBarData, 'Suscripciones', 'Pagos de Suscripciones')}
            {tipoGrafico === 'general' && renderBarChart(
              generalBarData, 
              ['Proyectos', 'Suscripciones'], 
              ['Pagos de Proyectos', 'Pagos de Suscripciones']
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Proyectos:</label>
              <select 
                value={filtroProyectos} 
                onChange={(e) => setFiltroProyectos(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent outline-none transition-all"
              >
                <option value="todos">Todos</option>
                <option value="completados">Completados</option>
                <option value="pendientes">Pendientes</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Suscripciones:</label>
              <select 
                value={filtroSuscripciones} 
                onChange={(e) => setFiltroSuscripciones(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent outline-none transition-all"
              >
                <option value="todos">Todos</option>
                <option value="activas">Activas</option>
                <option value="vencidas">Vencidas</option>
              </select>
            </div>
          </div>
          {chartTypeButtons}
          <div>
            {tipoGrafico === 'general' && renderPieChart(generalPieData)}
            {tipoGrafico === 'proyectos' && renderPieChart(proyectosPieData)}
            {tipoGrafico === 'suscripciones' && renderPieChart(suscripcionesPieData)}
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error al cargar los datos. Por favor, intenta nuevamente.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Análisis de Pagos</h2>
      
      {/* Visualization Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg bg-gray-100 p-1 shadow-md">
          <button 
            onClick={() => setTipoVisualizacion('barras')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              tipoVisualizacion === 'barras'
                ? 'bg-[#07767c] text-white shadow-lg'
                : 'text-gray-600 hover:text-[#07767c]'
            }`}
          >
            Gráfico de Barras
          </button>
          <button 
            onClick={() => setTipoVisualizacion('pastel')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              tipoVisualizacion === 'pastel'
                ? 'bg-[#07767c] text-white shadow-lg'
                : 'text-gray-600 hover:text-[#07767c]'
            }`}
          >
            Gráfico de Pastel
          </button>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="mb-8">
        {renderContent()}
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#07767c] to-[#055a5f] rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2 opacity-90">Total Proyectos</h3>
          <p className="text-3xl font-bold">
            {totales.proyectos.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2 opacity-90">Total Suscripciones</h3>
          <p className="text-3xl font-bold">
            {totales.suscripciones.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2 opacity-90">Total General</h3>
          <p className="text-3xl font-bold">
            {totales.general.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentAnalytics;