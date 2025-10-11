import React, { useState, useEffect } from "react";

function ProjectForm({ projectData, onSubmit }) {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    habilidades_requeridas: "",
    presupuesto: "",
    duracion_estimada: "",
    fecha_limite: "",
    ubicacion: "",
    tipo_contratacion: "",
    metodologia_trabajo: ""
  });

  useEffect(() => {
  if (projectData) {
    const formattedData = { ...projectData };

    if (formattedData.fecha_limite) {
      const date = new Date(formattedData.fecha_limite);
      // Convert to YYYY-MM-DD format
      formattedData.fecha_limite = date.toISOString().split("T")[0];
    }

    setForm(formattedData);
  }
}, [projectData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-10 border border-gray-100"
    >
      <h2 className="text-3xl font-bold text-center text-[#07767c] mb-2">
        {projectData ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Completa los campos para definir todos los detalles de tu proyecto.
      </p>

      {/* ─────────────── Sección 1 ─────────────── */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
          🧾 Detalles Básicos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Título
            </label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ej: Desarrollo de plataforma web"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#07767c] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Categoría
            </label>
            <input
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              placeholder="Ej: Tecnología, Diseño, Marketing..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#07767c] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe en detalle los objetivos y requerimientos del proyecto..."
              rows={4}
              className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-[#07767c] focus:outline-none"
              required
            />
          </div>
        </div>
      </section>

      {/* ─────────────── Sección 2 ─────────────── */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
          💼 Requerimientos y Presupuesto
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Habilidades Requeridas
            </label>
            <input
              name="habilidades_requeridas"
              value={form.habilidades_requeridas}
              onChange={handleChange}
              placeholder="Ej: React, Node.js, UX/UI..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#07767c] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Presupuesto
            </label>
            <input
              name="presupuesto"
              value={form.presupuesto}
              onChange={handleChange}
              placeholder="Ej: 500000 CLP"
              type="number"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#07767c] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Duración Estimada
            </label>
            <input
              name="duracion_estimada"
              value={form.duracion_estimada}
              onChange={handleChange}
              placeholder="Ej: 4 semanas"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#07767c] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Fecha Límite
            </label>
            <input
              name="fecha_limite"
              value={form.fecha_limite}
              onChange={handleChange}
              type="date"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#07767c] focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* ─────────────── Sección 3 ─────────────── */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
          ⚙️ Condiciones del Proyecto
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Ubicación
            </label>
            <input
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              placeholder="Ej: Santiago, remoto..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#07767c] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tipo de Contratación
            </label>
            <input
              name="tipo_contratacion"
              value={form.tipo_contratacion}
              onChange={handleChange}
              placeholder="Ej: Freelance, tiempo completo..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#07767c] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">
              Metodología de Trabajo
            </label>
            <input
              name="metodologia_trabajo"
              value={form.metodologia_trabajo}
              onChange={handleChange}
              placeholder="Ej: Scrum, Kanban..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#07767c] focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* ─────────────── Botón ─────────────── */}
      <button
        type="submit"
        className="w-full bg-[#07767c] hover:bg-[#055a5f] text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Guardar Cambios
      </button>
    </form>
  );
}

export default ProjectForm;
