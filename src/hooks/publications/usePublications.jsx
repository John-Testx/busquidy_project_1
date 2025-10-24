import { useState, useEffect, useMemo, useCallback } from 'react';
import { getPublications, getFreelancerApplications, createApplication } from '@/api/publicationsApi';

const usePublications = (userType, id_usuario, filters) => {
  const [publications, setPublications] = useState([]);
  const [appliedPublications, setAppliedPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalMessage, setModalMessage] = useState({ show: false, message: '' });

  // Fetch applied publications for freelancers
  useEffect(() => {
    const fetchAppliedPublications = async () => {
      if (userType === 'freelancer' && id_usuario) {
        try {
          const data = await getFreelancerApplications(id_usuario);
          setAppliedPublications(data.map(app => app.id_publicacion));
        } catch (error) {
          console.error('Error fetching applied publications:', error);
          setError('Error al cargar las postulaciones');
        }
      }
    };
    fetchAppliedPublications();
  }, [userType, id_usuario]);

  // Fetch all publications
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
        const data = await getPublications();
        const activePublications = data.filter(pub => pub.estado_publicacion === 'activo');
        setPublications(activePublications);
        setError(null);
      } catch (error) {
        console.error('Error fetching publications:', error);
        setError('Error al cargar las publicaciones');
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  // Filter and sort publications
  const filteredPublications = useMemo(() => {
    let result = [...publications];

    // Search filter
    if (filters.searchText) {
      result = result.filter(pub => 
        pub.titulo.toLowerCase().includes(filters.searchText.toLowerCase())
      );
    }

    // Sort filter
    if (filters.sortBy === 'fecha') {
      result = result.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion));
    } else if (filters.sortBy === 'salario') {
      result = result.sort((a, b) => b.presupuesto - a.presupuesto);
    }

    // Date filter
    const today = new Date();
    if (filters.date === 'hoy') {
      result = result.filter(pub => {
        const pubDate = new Date(pub.fecha_publicacion);
        return pubDate.toDateString() === today.toDateString();
      });
    } else if (filters.date === 'semana') {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      result = result.filter(pub => {
        const pubDate = new Date(pub.fecha_publicacion);
        return pubDate >= oneWeekAgo;
      });
    } else if (filters.date === 'mes') {
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(today.getMonth() - 1);
      result = result.filter(pub => {
        const pubDate = new Date(pub.fecha_publicacion);
        return pubDate >= oneMonthAgo;
      });
    }

    return result;
  }, [publications, filters]);

  // Check if publication is applied
  const isPublicationApplied = useCallback((id_publicacion) => {
    return appliedPublications.includes(id_publicacion);
  }, [appliedPublications]);

  // Apply to publication
  const applyToPublication = useCallback(async (id_publicacion) => {
    try {
      if (userType !== 'freelancer') {
        setModalMessage({
          show: true,
          message: 'Solo los freelancers pueden postular a publicaciones.'
        });
        return { success: false };
      }

      await createApplication(id_publicacion, id_usuario);
      
      setModalMessage({
        show: true,
        message: 'Postulación enviada exitosamente.'
      });
      setAppliedPublications(prev => [...prev, id_publicacion]);
      
      return { success: true };
    } catch (error) {
      console.error('Error applying to publication:', error);
      setModalMessage({
        show: true,
        message: 'Error al enviar la postulación.'
      });
      return { success: false };
    }
  }, [userType, id_usuario]);

  // Close modal
  const closeModal = useCallback(() => {
    setModalMessage({ show: false, message: '' });
  }, []);

  return {
    publications,
    filteredPublications,
    appliedPublications,
    loading,
    error,
    modalMessage,
    isPublicationApplied,
    applyToPublication,
    closeModal
  };
};

export default usePublications;