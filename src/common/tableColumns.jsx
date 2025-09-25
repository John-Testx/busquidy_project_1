import { Pencil, XCircle } from "lucide-react";

// Helper for formatting dates
export const formatDate = (dateString) => {
  if (!dateString) return 'No disponible';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'Fecha inválida';
  }
};

export const projectColumns = (actions) => [
  { key: "id_proyecto", label: "ID Proyecto", sortable: true },
  { key: "id_empresa", label: "ID Empresa", sortable: true },
  { key: "titulo", label: "Título", sortable: true },
  {
    key: "estado_publicacion",
    label: "Estado",
    sortable: true,
    render: (value) => (
      <span className={`badge ${(value || '').toLowerCase().replace(/\s+/g, '-')}`}>
        {value || 'Sin definir'}
      </span>
    )
  },
  {
    key: "fecha_creacion",
    label: "Fecha Creación",
    sortable: true,
    render: (value) => value ? formatDate(value) : 'No publicado'
  },
  {
    key: "fecha_publicacion",
    label: "Fecha Publicación",
    sortable: true,
    render: (value) => value ? formatDate(value) : 'No publicado'
  },
  { key: "categoria", label: "Categoría", sortable: true, render: (value) => value || 'No especificada' },
  {
    key: "publicaciones",
    label: "Publicaciones",
    render: (value) =>
      value && value.length > 0 ? (
        <ul>
          {value.map((pub, index) => (
            <li key={index}>{pub.titulo || `Publicación ${index + 1}`}</li>
          ))}
        </ul>
      ) : (
        <span className="no-publications">Sin publicaciones</span>
      )
  },
  {
    key: "acciones",
    label: "Acciones",
    render: (value, row) => (
      <div className="action-buttons">
        <button
          className="reject-btn"
          title="Despublicar"
          onClick={() => actions.confirmDespostProject(row.id_proyecto)}
        >
          <XCircle size={16} />
        </button>
        <button className="edit-btn" title="Modificar">
          <Pencil size={16} />
        </button>
        <button
          className="delete-btn"
          title="Eliminar"
          onClick={() => actions.confirmDeleteProject(row.id_proyecto)}
        >
          <i className="bi bi-trash" style={{ margin: "0 auto", fontSize: "16px" }}></i>
        </button>
      </div>
    )
  }
];

// Puedes agregar más columnas para otras tablas aquí
export const userColumns = (actions) => [
  // ...definición de columnas para usuarios...
];