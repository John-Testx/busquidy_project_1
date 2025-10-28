import { useState, useEffect } from 'react';
import { getProjectPayments, getSubscriptionPayments } from '@/api/paymentApi';

/**
 * Custom hook para gestionar los datos de pagos (proyectos y suscripciones)
 * @returns {Object} Estados y funciones para manejar datos de pagos
 */
const usePaymentData = () => {
  const [pagoProyecto, setPagoProyecto] = useState([]);
  const [pagoSuscripcion, setPagoSuscripcion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([cargarPagosProyectos(), cargarPagosSuscripciones()]);
    setLoading(false);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      await Promise.all([cargarPagosProyectos(), cargarPagosSuscripciones()]);
      setLoading(false);
    };
    cargarDatos();
  }, []);

  return {
    pagoProyecto,
    pagoSuscripcion,
    loading,
    error,
    handleRefresh,
  };
};

export default usePaymentData;