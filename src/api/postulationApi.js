import apiClient from './apiClient';

const BASE_URL = '/postulations';

/**
 * ✅ Contratar a un freelancer
 */
export const hireFreelancer = async (id_postulacion) => {
  const response = await apiClient.post(`${BASE_URL}/${id_postulacion}/hire`);
  return response.data;
};