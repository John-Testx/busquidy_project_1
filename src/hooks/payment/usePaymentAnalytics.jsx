import { useState, useEffect, useMemo } from 'react';
import { groupBy, sumBy } from 'lodash';
import { getProjectPayments, getSubscriptionPayments } from '@/api/paymentApi';

const usePaymentAnalytics = () => {
  const [proyectosPagos, setProyectosPagos] = useState([]);
  const [suscripcionesPagos, setSuscripcionesPagos] = useState([]);
  const [tipoVisualizacion, setTipoVisualizacion] = useState('barras');
  const [tipoGrafico, setTipoGrafico] = useState('general');
  const [filtroProyectos, setFiltroProyectos] = useState('todos');
  const [filtroSuscripciones, setFiltroSuscripciones] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch de datos
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        setLoading(true);
        const [proyectosResponse, suscripcionesResponse] = await Promise.all([
          getProjectPayments(),
          getSubscriptionPayments()
        ]);
        setProyectosPagos(proyectosResponse.data);
        setSuscripcionesPagos(suscripcionesResponse.data);
        setError(null);
      } catch (error) {
        console.error('Error al cargar los pagos:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

  // Datos filtrados
  const filteredProyectosPagos = useMemo(() => {
    return proyectosPagos.filter(pago => {
      if (filtroProyectos === 'completados') 
        return pago.estado_pago === 'completado';
      if (filtroProyectos === 'pendientes') 
        return pago.estado_pago === 'pendiente';
      return true;
    });
  }, [proyectosPagos, filtroProyectos]);

  const filteredSuscripcionesPagos = useMemo(() => {
    return suscripcionesPagos.filter(pago => {
      if (filtroSuscripciones === 'activas') 
        return pago.estado_suscripcion === 'activa';
      if (filtroSuscripciones === 'vencidas') 
        return pago.estado_suscripcion === 'expirada';
      return true;
    });
  }, [suscripcionesPagos, filtroSuscripciones]);

  // Agrupamiento por mes
  const groupedProyectosPagos = useMemo(() => {
    return groupBy(filteredProyectosPagos, pago => {
      const fecha = new Date(pago.fecha_pago);
      return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    });
  }, [filteredProyectosPagos]);

  const groupedSuscripcionesPagos = useMemo(() => {
    return groupBy(filteredSuscripcionesPagos, pago => {
      const fecha = new Date(pago.fecha_pago);
      return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    });
  }, [filteredSuscripcionesPagos]);

  // Meses únicos ordenados
  const uniqueMonths = useMemo(() => {
    return [...new Set([
      ...Object.keys(groupedProyectosPagos),
      ...Object.keys(groupedSuscripcionesPagos)
    ])].sort();
  }, [groupedProyectosPagos, groupedSuscripcionesPagos]);

  // Datos para gráfico de barras de proyectos
  const proyectosBarData = useMemo(() => {
    return uniqueMonths.map(mes => ({
      mes,
      Proyectos: sumBy(groupedProyectosPagos[mes] || [], 'monto')
    }));
  }, [uniqueMonths, groupedProyectosPagos]);

  // Datos para gráfico de barras de suscripciones
  const suscripcionesBarData = useMemo(() => {
    return uniqueMonths.map(mes => ({
      mes,
      Suscripciones: sumBy(groupedSuscripcionesPagos[mes] || [], 'monto')
    }));
  }, [uniqueMonths, groupedSuscripcionesPagos]);

  // Datos para gráfico de barras general
  const generalBarData = useMemo(() => {
    return uniqueMonths.map(mes => ({
      mes,
      Proyectos: sumBy(groupedProyectosPagos[mes] || [], 'monto'),
      Suscripciones: sumBy(groupedSuscripcionesPagos[mes] || [], 'monto')
    }));
  }, [uniqueMonths, groupedProyectosPagos, groupedSuscripcionesPagos]);

  // Datos para gráfico de pastel general
  const generalPieData = useMemo(() => {
    return [
      {
        name: 'Proyectos',
        value: sumBy(filteredProyectosPagos, 'monto'),
        color: '#07767c'
      },
      {
        name: 'Suscripciones',
        value: sumBy(filteredSuscripcionesPagos, 'monto'),
        color: '#10b981'
      }
    ];
  }, [filteredProyectosPagos, filteredSuscripcionesPagos]);

  // Datos para gráfico de pastel de proyectos
  const proyectosPieData = useMemo(() => {
    return [
      {
        name: 'Proyectos Pagados',
        value: sumBy(filteredProyectosPagos.filter(p => p.estado_pago === 'completado'), 'monto'),
        color: '#07767c'
      },
      {
        name: 'Proyectos Pendientes',
        value: sumBy(filteredProyectosPagos.filter(p => p.estado_pago === 'pendiente'), 'monto'),
        color: '#f59e0b'
      }
    ];
  }, [filteredProyectosPagos]);

  // Datos para gráfico de pastel de suscripciones
  const suscripcionesPieData = useMemo(() => {
    return [
      {
        name: 'Suscripciones Activas',
        value: sumBy(filteredSuscripcionesPagos.filter(s => s.estado_suscripcion === 'activa'), 'monto'),
        color: '#10b981'
      },
      {
        name: 'Suscripciones Vencidas',
        value: sumBy(filteredSuscripcionesPagos.filter(s => s.estado_suscripcion === 'expirada'), 'monto'),
        color: '#ef4444'
      }
    ];
  }, [filteredSuscripcionesPagos]);

  // Totales para las tarjetas de resumen
  const totales = useMemo(() => {
    const totalProyectos = sumBy(filteredProyectosPagos, 'monto');
    const totalSuscripciones = sumBy(filteredSuscripcionesPagos, 'monto');
    return {
      proyectos: totalProyectos,
      suscripciones: totalSuscripciones,
      general: totalProyectos + totalSuscripciones
    };
  }, [filteredProyectosPagos, filteredSuscripcionesPagos]);

  return {
    // Estados
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
    
    // Datos procesados
    proyectosBarData,
    suscripcionesBarData,
    generalBarData,
    generalPieData,
    proyectosPieData,
    suscripcionesPieData,
    totales
  };
};

export default usePaymentAnalytics;