import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import { getProjectById, updateProject } from "@/api/projectsApi";
import { toast } from "react-toastify";
import LoadingScreen from "../../../LoadingScreen";
import MainLayout from "@/components/Layouts/MainLayout";
import { ArrowLeft } from "lucide-react";

function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const proj = await getProjectById(id);
        setProject(proj);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  const handleUpdate = async (updatedProject) => {
    try {
      await updateProject(id, updatedProject);
      toast.success("Proyecto actualizado correctamente");
      navigate("/myprojects");
    } catch (err) {
      console.error(err);
      toast.error("Error actualizando el proyecto");
    }
  };

  const handleGoBack = () => {
    navigate("/myprojects");
  };

  if (loading) return <LoadingScreen />;
  
  if (!project) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center py-12 px-4">
          <div className="text-center bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <p className="text-xl font-semibold text-gray-800 mb-2">Proyecto no encontrado</p>
            <p className="text-gray-500 mb-6">No se pudo cargar la información del proyecto</p>
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#07767c] text-white rounded-lg hover:bg-[#055a5f] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a Mis Proyectos
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto">
          {/* Header con botón de volver */}
          <div className="mb-6">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[#07767c] hover:text-white bg-white hover:bg-[#07767c] rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group border-2 border-[#07767c]"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Volver a Mis Proyectos</span>
            </button>
          </div>

          {/* Card contenedor del formulario */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[#07767c]/20">
            {/* Header del card */}
            <div className="bg-gradient-to-r from-[#07767c] to-[#0a9fa6] px-8 py-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
              <div className="relative z-10">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl">✏️</span>
                  Editar Proyecto
                </h1>
                <p className="text-teal-100 mt-2 text-lg">
                  Modifica la información de tu proyecto y guarda los cambios
                </p>
              </div>
            </div>

            {/* Contenido del formulario */}
            <div className="p-8 bg-gradient-to-b from-white to-gray-50">
              <ProjectForm projectData={project} onSubmit={handleUpdate} />
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-6 text-center bg-white/60 backdrop-blur-sm rounded-lg py-3 px-4 border border-[#07767c]/20">
            <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
              <span className="text-lg">💡</span>
              Los cambios se guardarán cuando completes el formulario
            </p>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}

export default EditProjectPage;