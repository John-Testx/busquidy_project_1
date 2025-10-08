import axios from "axios";

export const getUsuarios = async () => {
  const response = await axios.get('http://localhost:3001/api/users/get/usuarios');
  return response.data;
};

export const deleteUsuario = async (id_usuario) => {
  await axios.delete(`http://localhost:3001/api/users/delete/${id_usuario}`);
};