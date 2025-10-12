import React, { useEffect, useState } from "react";
import { getUsuarios } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

const UserListPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUsuarios().then(setUsuarios);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Usuarios</h2>
      <ul className="space-y-4">
        {usuarios.map((user) => (
          <li
            key={user.id_usuario}
            className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{user.correo}</p>
              <p className="text-sm text-gray-500">{user.tipo_usuario}</p>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => navigate(`/admin/users/edit/${user.id_usuario}`)}
            >
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserListPage;
