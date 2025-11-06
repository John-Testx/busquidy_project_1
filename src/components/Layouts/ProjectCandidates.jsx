import React, { useState, useEffect } from 'react';
import { getRecommendedFreelancers } from "@/api/freelancerApi";
import { getPostulationsForProject } from "@/api/publicationsApi";
import RecommendedFreelancerCard from '@/components/Empresa/Projects/RecommendedFreelancerCard';
import PostulationCard from '@/components/Empresa/Projects/PostulationCard';
import { Star, Users, Loader2 } from 'lucide-react';

/**
 * A container component to display project candidates,
 * featuring tabs for AI Recommendations and Postulations.
 * * @param {object} projectDetails - The full project details object.
 */
const ProjectCandidates = ({ projectDetails }) => {
  // Tab state: 'recommendations' or 'postulations'
  const [activeTab, setActiveTab] = useState('recommendations');

  // Data state
  const [recommendations, setRecommendations] = useState([]);
  const [postulations, setPostulations] = useState([]);

  // Loading and Error state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure we have the projectDetails object and its properties before fetching
    console.log('Project details received in ProjectCandidates:', projectDetails);
    if (!projectDetails || !projectDetails.id_proyecto) {
      setIsLoading(false);
      setError('Detalles del proyecto no encontrados.');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching candidates for project:', projectDetails);
        const { id_proyecto, titulo, descripcion, habilidades_requeridas, categoria } = projectDetails;
        console.log('Project details:', { id_proyecto, titulo, descripcion, habilidades_requeridas, categoria });

        // Fetch both recommendations and postulations concurrently
        const [recsResponse, postsResponse] = await Promise.all([
          getRecommendedFreelancers(titulo, descripcion, habilidades_requeridas, categoria),
          getPostulationsForProject(id_proyecto),
        ]);

        // Assuming API returns data in a .data property or directly
        setRecommendations(recsResponse.data || recsResponse || []);
        setPostulations(postsResponse.data || postsResponse || []);

      } catch (err) {
        console.error('Error fetching project candidates:', err);
        setError(err.message || 'Error al cargar los candidatos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectDetails]); // Re-fetch if the projectDetails object changes

  // Helper to render a loading spinner
  const renderLoading = () => (
    <div className="flex justify-center items-center p-12">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="ml-3 text-gray-600">Cargando candidatos...</p>
    </div>
  );

  // Helper to render an error message
  const renderError = () => (
    <div className="p-8 text-center bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-700 font-semibold">Oops! Hubo un error</p>
      <p className="text-red-600 text-sm mt-1">{error}</p>
    </div>
  );

  // Helper to render an empty state message
  const renderEmptyState = (message) => (
    <div className="text-center text-gray-500 p-8 py-12 bg-gray-50/70 rounded-lg border border-dashed">
      <p>{message}</p>
    </div>
  );

  // Helper for dynamic tab button styling
  const getTabClassName = (tabName) => {
    const isActive = activeTab === tabName;
    return `
      flex items-center justify-center gap-2 w-1/2 p-4 text-sm md:text-base font-semibold 
      transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50
      ${
        isActive
          ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
          : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600 border-b-2 border-transparent'
      }
    `;
  };

  return (
    <div className="w-full bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden my-6">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 bg-gray-50/50">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={getTabClassName('recommendations')}
          aria-selected={activeTab === 'recommendations'}
          role="tab"
        >
          <Star size={18} className="shrink-0" />
          <span className="hidden sm:inline">Recomendados (IA)</span>
          <span className="sm:hidden">Recomendados</span>
          {/* Count Bubble */}
          <span className="ml-1 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {recommendations.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('postulations')}
          className={getTabClassName('postulations')}
          aria-selected={activeTab === 'postulations'}
          role="tab"
        >
          <Users size={18} className="shrink-0" />
          <span>Postulaciones</span>
          {/* Count Bubble */}
          <span className="ml-1 bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {postulations.length}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 md:p-6" role="tabpanel">
        {isLoading
          ? renderLoading()
          : error
          ? renderError()
          : activeTab === 'recommendations'
          ? // Recommendations Content
            recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {recommendations.map((freelancer) => (
                  <RecommendedFreelancerCard
                    key={freelancer.id}
                    freelancer={freelancer}
                    projectId={projectDetails.id_proyecto} // Pass projectId
                  />
                ))}
              </div>
            ) : (
              renderEmptyState(
                'Nuestro motor de IA está trabajando. Vuelve a consultar más tarde para ver las recomendaciones.'
              )
            )
          : // Postulations Content
          postulations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {postulations.map((postulation) => (
                <PostulationCard
                  key={postulation.id}
                  postulation={postulation}
                />
              ))}
            </div>
          ) : (
            renderEmptyState('Aún no hay postulaciones para este proyecto.')
          )}
      </div>
    </div>
  );
};

export default ProjectCandidates;