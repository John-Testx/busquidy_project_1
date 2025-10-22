import { useState, useEffect } from 'react';
import apiClient from '@/api/apiClient'; // Importamos tu cliente de Axios

/**
 * Hook personalizado para realizar peticiones GET.
 * @param {string} url - El endpoint de la API al que se quiere llamar.
 */
const useFetch = (url) => {
  const [data, setData] = useState(null); // Para guardar los datos de la respuesta
  const [loading, setLoading] = useState(true); // Para saber si la petición está en proceso
  const [error, setError] = useState(null); // Para guardar cualquier error

  useEffect(() => {
    // Se usa para evitar un bug si el componente se desmonta mientras se hace el fetch
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get(url, { signal: abortController.signal });
        setData(response.data);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Función de limpieza: se ejecuta si el componente se desmonta
    return () => abortController.abort();

  }, [url]); // Se volverá a ejecutar cada vez que la URL cambie

  return { data, loading, error };
};

export default useFetch;