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
    <div className="flex flex-col space-y-4">
      {/* Search Input */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-xs"
        />
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="text-gray-400 text-xs">
                        {sortConfig.key === col.key
                          ? sortConfig.direction === "ascending"
                            ? "▲"
                            : "▼"
                          : "▲"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.length > 0 ? (
              sortedData.map((row, idx) => (
                <tr
                  key={row.id || row.id_proyecto || row.id_pago || idx}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {col.render 
                        ? col.render(row[col.key] ?? "", row, actions)
                        : (row[col.key] ?? "")
                      }
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTable;