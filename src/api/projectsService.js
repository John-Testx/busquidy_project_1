import axios from 'axios';

export const getProjects = async (userId) => {
    const response = await axios.get(`http://localhost:3001/api/projects/get/${userId}`);
    return response.data;
};

// Get a single project by ID (for edit page)
export const getProjectById = async (id_proyecto) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/projects/getProject/${id_proyecto}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error al obtener proyecto");
  }
};

// Update project
export const updateProject = async (id_proyecto, projectData) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/api/projects/updateProject/${id_proyecto}`,
      projectData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error al actualizar proyecto");
  }
};

export const deleteProject = async (projectId) => {
    await axios.delete(`http://localhost:3001/api/projects/delete/${projectId}`);
};

export const checkCompanyProfile = async (userId) => {
    const response = await axios.get(`http://localhost:3001/api/empresa/get/${userId}`);
    return response.data.isPerfilIncompleto;
};
