import axios from 'axios';

export const getProjects = async (userId) => {
    const response = await axios.get(`http://localhost:3001/api/projects/get/${userId}`);
    return response.data;
};

export const deleteProject = async (projectId) => {
    await axios.delete(`http://localhost:3001/api/projects/delete/${projectId}`);
};

export const checkCompanyProfile = async (userId) => {
    const response = await axios.get(`http://localhost:3001/api/empresa/get/${userId}`);
    return response.data.isPerfilIncompleto;
};
