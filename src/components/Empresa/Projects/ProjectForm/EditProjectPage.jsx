import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import { getProjectById, updateProject } from "@/api/projectsApi";
import { toast } from "react-toastify";
import LoadingScreen from "../../../LoadingScreen";
import MainLayout from "@/components/Layouts/MainLayout";

function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  const loadProject = async () => {
    try {
      const proj = await getProjectById(id); // <- fetch only this project
      setProject(proj);                       // <- set it to state
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
      await updateProject(id, updatedProject); // Your API call
      toast.success("Proyecto actualizado correctamente");
      navigate("/myprojects"); // Redirect back to view projects
    } catch (err) {
      console.error(err);
      toast.error("Error actualizando el proyecto");
    }
  };

  if (loading) return <LoadingScreen />;
  if (!project) return <p className="text-center py-12 text-gray-500">Proyecto no encontrado</p>;

  return (
    <>
        <MainLayout>
            <main className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-5xl">
                    <ProjectForm projectData={project} onSubmit={handleUpdate}/>
                </div>
            </main>
        </ MainLayout>
    </>
  );
}

export default EditProjectPage;
