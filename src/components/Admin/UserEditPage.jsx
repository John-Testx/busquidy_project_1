import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDetails, updateUserDetails } from "../../api/userApi";

const UserEditPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const userDetails = await getUserDetails(Number(id));
            setUser(userDetails);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
        };
        fetchUser();
    }, [id]);

  const saveUser = async () => {
  try {
    await updateUserDetails(user.id_usuario, user);
    navigate("/adminhome/usermanagement/users"); // full path
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

  if (!user) return <p>Cargando...</p>;
  
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>
      <label className="block mb-2">Correo</label>
      <input
        type="email"
        value={user.correo}
        onChange={(e) => setUser({ ...user, correo: e.target.value })}
        className="w-full p-2 border rounded mb-4"
      />
      <label className="block mb-2">Tipo de usuario</label>
      <select
        value={user.tipo_usuario}
        onChange={(e) => setUser({ ...user, tipo_usuario: e.target.value })}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="freelancer">Freelancer</option>
        <option value="empresa">Empresa</option>
        <option value="administrador">Administrador</option>
      </select>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate("/adminhome/usermanagement/users")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          onClick={saveUser}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default UserEditPage;
