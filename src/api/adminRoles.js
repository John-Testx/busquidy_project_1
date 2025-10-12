import axios from "axios";


export const getAllAdminRoles = async () => {
  const { data } = await axios.get("http://localhost:3001/api/admin/role/get");
//   console.log(data);
  return data;
};

export const createAdminRole = async (role) => {
  const { data } = await axios.post("http://localhost:3001/api/admin/role/create", role);
  return data;
};

export const updateAdminRole = async (id, role) => {
  const { data } = await axios.put(`http://localhost:3001/api/admin/role/${id}`, role);
  return data;
};

export const deleteAdminRole = async (id) => {
  const { data } = await axios.delete(`http://localhost:3001/api/admin/role/${id}`);
  return data;
};