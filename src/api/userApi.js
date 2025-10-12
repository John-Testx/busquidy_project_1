import axios from "axios";


export const getUsuarios = async () => {
  const response = await axios.get('http://localhost:3001/api/users/get/usuarios');
  return response.data;
};

export const deleteUsuario = async (id_usuario) => {
  await axios.delete(`http://localhost:3001/api/users/delete/${id_usuario}`);
};

export const updateUserStatus = (id, isActive) =>
  axios.patch(`http://localhost:3001/api/users/${id}/status`, { is_active: isActive });

export const getUserDetails = (id) => axios.get(`http://localhost:3001/api/users/${id}`).then(res => res.data);

export const updateUserDetails = (id, data) =>
  axios.patch(`http://localhost:3001/api/users/${id}`, data);

export const getAdminRoles = (adminId) =>
  axios.get(`http://localhost:3001/api/admin/roles/${adminId}`).then(res => res.data);

export const updateAdminRoles = (adminId, roles) =>
  axios.patch(`http://localhost:3001/api/admins/${adminId}/roles`, { roles });

export async function createFreelancerProfile(freelancerData, id_usuario, token) {
  try {
    const response = await fetch(
      "http://localhost:3001/api/freelancer/create-perfil-freelancer",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...freelancerData, id_usuario }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Return the error info so the component can handle it
      throw new Error(data.error || "Error al crear el perfil: " + (data.details || ""));
    }

    return data; // Successful response
  } catch (error) {
    // Rethrow so UI handles both network and server errors
    throw error;
  }
}