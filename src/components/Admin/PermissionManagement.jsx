import React, { useState, useEffect } from "react";
// import { getPermissions, updatePermissions } from "../../api/userApi";

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await getPermissions();
        setPermissions(data);
        setSelectedPermissions(data.filter(p => p.selected).map(p => p.id_permiso));
      } catch (error) {
        console.error("Error loading permissions:", error);
      }
    };
    fetchPermissions();
  }, []);

  const togglePermission = (permId) => {
    setSelectedPermissions(prev =>
      prev.includes(permId)
        ? prev.filter(id => id !== permId)
        : [...prev, permId]
    );
  };

  const savePermissions = async () => {
    try {
      await updatePermissions(null, selectedPermissions); // Pass user ID if needed
      alert("Permisos actualizados correctamente!");
    } catch (error) {
      console.error("Error saving permissions:", error);
    }
  };

  return (
    <div>
      <h2>Gestión de Permisos</h2>
      {permissions.map(p => (
        <div key={p.id_permiso}>
          <label>
            <input
              type="checkbox"
              checked={selectedPermissions.includes(p.id_permiso)}
              onChange={() => togglePermission(p.id_permiso)}
            />
            {p.nombre_permiso}
          </label>
        </div>
      ))}
      <button onClick={savePermissions}>Guardar Permisos</button>
    </div>
  );
};

export default PermissionManagement;
