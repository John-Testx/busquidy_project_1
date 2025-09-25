import React, { useState } from "react";

/**
 * columns: [
 *   { key: "id", label: "ID" },
 *   { key: "name", label: "Nombre", render: (value, row) => <b>{value}</b> },
 *   { key: "estado", label: "Estado", render: (value) => <span className={`badge ${value}`}>{value}</span> },
 *   { key: "acciones", label: "Acciones", render: (value, row) => <button onClick={() => onEdit(row)}>Editar</button> }
 * ]
 * data: [{...}]
 * actions: { onEdit, onDelete, ... }
 * tableClassName: clase CSS personalizada para la tabla
 */
function AdminTable({ 
    columns, 
    data, 
    actions = {},
    searchPlaceholder = "Buscar...",
    emptyMessage = "No hay datos disponibles.",
    tableClassName = "admin-table" // <-- nueva prop para la clase de la tabla
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

    // Filtrado simple por texto
    const filteredData = data.filter(row =>
        searchTerm === "" ||
        columns.some(col => {
            const value = row[col.key];
            return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
    );

    // Ordenamiento
    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return filteredData;
        return [...filteredData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="admin-table-container">
            <div className="admin-table-search">
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <table className={tableClassName}>
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.key}
                                className={col.sortable ? "sortable" : ""}
                                onClick={() => col.sortable && handleSort(col.key)}
                            >
                                {col.label}
                                {col.sortable && (
                                    <span className="sort-icon">
                                        {sortConfig.key === col.key
                                            ? sortConfig.direction === "ascending" ? "▲" : "▼"
                                            : "▲"}
                                    </span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.length > 0 ? (
                        sortedData.map((row, idx) => (
                            <tr key={row.id || row.id_proyecto || row.id_pago || idx}>
                                {columns.map(col => (
                                    <td key={col.key}>
                                        {col.render
                                            ? col.render(row[col.key], row, actions)
                                            : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="empty-message">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminTable;