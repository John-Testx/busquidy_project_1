import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import axios from "axios";
import TableCommon from "../../common/TableCommon";
import "../../styles/Admin/UserTable.css";
import { getUsuarios, deleteUsuario } from "../../api/userApi"; // <-- Import API functions


const UserTable = () => {
    const [usuarios, setUsuarios] = useState([]);

    // Función para cargar la lista de usuarios desde la base de datos
    const cargarUsuarios = async () => {
        try {
            const data = await getUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error('Error al cargar la lista de usuarios:', error);
        }
    };

    // Función para eliminar un usuario
    const eliminarUsuario = async (id_usuario) => {
        try {
            await deleteUsuario(id_usuario);
            cargarUsuarios();
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    };

    
    useEffect(() => {
        cargarUsuarios();
    }, []);

    // Definición de columnas para TableCommon
    const columns = [
        { key: "id_usuario", label: "ID Usuario", sortable: true },
        { key: "idRol", label: "ID Rol", sortable: true },
        { key: "correo", label: "Correo Electrónico", sortable: true },
        {
            key: "premium",
            label: "Premium",
            sortable: true,
            render: (value) => (
                <span className={`badge ${value === 'Sí' ? "premium" : "no-premium"}`}>
                    {value}
                </span>
            )
        },
        { key: "tipo_usuario", label: "Rol", sortable: true },
        {
            key: "acciones",
            label: "Acciones",
            render: (value, row) => (
                <div className="action-buttons">
                    <button className="edit-user-btn">
                        <Pencil size={16} />
                    </button>
                    <button
                        className="delete-btn"
                        onClick={() => eliminarUsuario(row.id_usuario)}
                    >
                        <i className="bi bi-trash" style={{ margin: "0 auto", fontSize: "16px" }}></i>
                    </button>
                </div>
            )
        }
    ];

    // Filtrar usuarios para no mostrar administradores
    const usuariosFiltrados = usuarios.filter(
        (usuario) => usuario.tipo_usuario.toLowerCase() !== "administrador"
    );

    return (
        <div className="user-management">
            <div className="user-container">
                <div className="header-section">
                    <h1>Gestión de Usuarios</h1>
                </div>
                <div className="table-container">
                    <TableCommon
                        columns={columns}
                        data={usuariosFiltrados}
                        searchPlaceholder="Buscar usuarios..."
                        tableClassName="user-table" 
                        emptyMessage="No hay usuarios registrados en la base de datos"
                    />
                </div>
            </div>
        </div>
    );
};

export default UserTable;