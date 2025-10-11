import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Default editable field
const EditableField = ({ label, value, onChange, type = "text", multiline = false }) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#07767c] focus:outline-none"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#07767c] focus:outline-none"
      />
    )}
  </div>
);

// Schema defining sections and fields
const sectionSchemas = {
  empresa: {
    "empresa-info": [
      { key: "nombre_empresa", label: "Nombre de la Empresa" },
      { key: "identificacion_fiscal", label: "RUT" },
      { key: "direccion", label: "Dirección" },
      { key: "telefono_contacto", label: "Teléfono" },
      { key: "correo_empresa", label: "Correo Electrónico" },
      { key: "pagina_web", label: "Página Web" },
      { key: "descripcion", label: "Descripción", multiline: true },
      { key: "sector_industrial", label: "Sector/Industria" },
    ],
    "representante-info": [
      { key: "nombre_completo", label: "Nombre Completo" },
      { key: "cargo", label: "Cargo" },
      { key: "correo_representante", label: "Correo Electrónico" },
      { key: "telefono_representante", label: "Teléfono" },
    ],
    "empresa-access": [
      { key: "correo", label: "Correo Electrónico", dataKey: "perfilUsuario" },
      { key: "tipo_usuario", label: "Tipo de Usuario", readonly: true, dataKey: "perfilUsuario" },
    ],
  },
  freelancer: {
    "freelancer-info": [
      { key: "nombre_completo", label: "Nombre Completo" },
      { key: "habilidades", label: "Habilidades", multiline: true },
      { key: "descripcion", label: "Descripción", multiline: true },
    ],
    "freelancer-access": [
      { key: "correo", label: "Correo Electrónico", dataKey: "perfilUsuario" },
      { key: "tipo_usuario", label: "Tipo de Usuario", readonly: true, dataKey: "perfilUsuario" },
    ],
  },
};

// Labels for sections
const sectionLabels = {
  "empresa-info": "Información de la Empresa",
  "representante-info": "Información del Representante",
  "empresa-access": "Acceso",
  "freelancer-info": "Información del Freelancer",
  "freelancer-access": "Acceso",
};

function PerfilCard({ userType, id_usuario }) {
  const [perfilData, setPerfilData] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    setActiveSection(Object.keys(sectionSchemas[userType])[0]);
    loadPerfil();
  }, []);

  const loadPerfil = async () => {
    try {
      const endpoint =
        userType === "empresa"
          ? `http://localhost:3001/api/empresa/get/perfil-empresa/${id_usuario}`
          : `http://localhost:3001/api/freelancer/get/perfil-freelancer/${id_usuario}`;
      const response = await axios.get(endpoint);
      setPerfilData(response.data);
    } catch (error) {
      console.error("Error cargando perfil:", error);
      toast.error("Error cargando perfil");
    }
  };

  const handleSaveSection = async () => {
    try {
      const endpoint =
        userType === "empresa"
          ? `http://localhost:3001/api/empresa/update/${id_usuario}`
          : `http://localhost:3001/api/freelancer/update/${id_usuario}`;

      await axios.put(endpoint, perfilData);
      toast.success("Datos actualizados correctamente");
      loadPerfil();
    } catch (error) {
      console.error(error);
      toast.error("Error actualizando datos");
    }
  };

  const renderFields = (sectionKey) => {
    if (!perfilData) return null;
    const fields = sectionSchemas[userType][sectionKey];
    return fields.map((field) => {
      const dataKey = field.dataKey || (userType === "empresa" && sectionKey.includes("empresa") ? "perfilEmpresa" : sectionKey.includes("representante") ? "perfilRepresentante" : "perfilUsuario");
      const value = perfilData[dataKey]?.[field.key] ?? "";

      if (field.render) {
        return <div key={field.key}>{field.render(value, (val) => updateField(dataKey, field.key, val))}</div>;
      }

      if (field.readonly) {
        return (
          <div key={field.key} className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
            <p className="w-full p-2 border rounded-lg bg-gray-100">{value}</p>
          </div>
        );
      }

      return (
        <EditableField
          key={field.key}
          label={field.label}
          value={value}
          multiline={field.multiline || false}
          type={field.type || "text"}
          onChange={(val) => updateField(dataKey, field.key, val)}
        />
      );
    });
  };

  const updateField = (dataKey, fieldKey, value) => {
    setPerfilData((prev) => ({
      ...prev,
      [dataKey]: { ...prev[dataKey], [fieldKey]: value },
    }));
  };

  const sections = Object.keys(sectionSchemas[userType]);

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-10 gap-6">
      {/* Sidebar */}
      <aside className="md:w-64 border-r p-4 bg-white rounded-lg shadow-lg">
        <ul>
          {sections.map((section) => (
            <li
              key={section}
              onClick={() => setActiveSection(section)}
              className={`cursor-pointer mb-2 p-2 rounded ${
                activeSection === section ? "bg-[#07767c] text-white font-semibold" : "hover:bg-gray-100"
              }`}
            >
              {sectionLabels[section]}
            </li>
          ))}
        </ul>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-white rounded-lg shadow-lg p-6">
        {renderFields(activeSection)}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSaveSection}
            className="bg-[#07767c] text-white px-4 py-2 rounded-lg hover:bg-[#055a5f] transition"
          >
            Guardar
          </button>
          <button
            onClick={loadPerfil}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
        </div>
      </main>
    </div>
  );
}

export default PerfilCard;
