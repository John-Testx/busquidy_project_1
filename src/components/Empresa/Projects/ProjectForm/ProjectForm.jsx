import React, { useState, useEffect } from "react";

function ProjectForm({ projectData, onSubmit, terminologia, tipoParaBackend }) {
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
    metodologia_trabajo: "",
    tipo: tipoParaBackend || "proyecto" 
  });

  useEffect(() => {
    if (projectData) {
      const formattedData = { ...projectData };

      if (formattedData.fecha_limite) {
        const date = new Date(formattedData.fecha_limite);
        formattedData.fecha_limite = date.toISOString().split("T")[0];
      }

      setForm(formattedData);
    }
  }, [projectData]);

  useEffect(() => {
    if (tipoParaBackend) {
      setForm(prev => ({ ...prev, tipo: tipoParaBackend }));
    }
  }, [tipoParaBackend]);

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
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header del formulario */}
      <div className="text-center pb-6 border-b-2 border-[#07767c]/20">
        <h2 className="text-3xl font-bold text-[#07767c] mb-2">
          {projectData ? `Editar ${terminologia?.singular || 'Proyecto'}` : `Crear Nuev${terminologia?.singular === 'Tarea' ? 'a' : 'o'} ${terminologia?.singular || 'Proyecto'}`}
        </h2>
        <p className="text-gray-600">
          Completa los campos para definir todos los detalles de tu {terminologia?.singular.toLowerCase() || 'proyecto'}.
        </p>
      </div>

      {/* ─────────────── Sección 1 ─────────────── */}
      <section className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-[#07767c]/20 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-[#07767c] rounded-lg flex items-center justify-center text-white text-xl shadow-md">
            🧾
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            Detalles Básicos
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-gray-800 font-semibold mb-2 text-sm">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ej: Desarrollo de plataforma web"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-[#07767c] focus:outline-none transition-all bg-white shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-2 text-sm">
              Categoría
            </label>
            <input
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              placeholder="Ej: Tecnología, Diseño, Marketing..."
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-[#07767c] focus:outline-none transition-all bg-white shadow-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-800 font-semibold mb-2 text-sm">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe en detalle los objetivos y requerimientos del proyecto..."
              rows={5}
              className="w-full p-3 border-2 border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#07767c] focus:border-[#07767c] focus:outline-none transition-all bg-white shadow-sm"
              required
            />
          </div>
        </div>
      </section>

      {/* ─────────────── Sección 2 ─────────────── */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-[#07767c]/20 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-[#07767c] rounded-lg flex items-center justify-center text-white text-xl shadow-md">
            💼
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            Requerimientos y Presupuesto
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-gray-800 font-semibold mb-2 text-sm">
              Habilidades Requeridas
            </label>
            <input
              name="habilidades_requeridas"
              value={form.habilidades_requeridas}
              onChange={handleChange}
              placeholder="Ej: React, Node.js, UX/UI..."
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-[#07767c] focus:outline-none transition-all bg-white shadow-sm"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-2 text-sm">
              Presupuesto
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                name="presupuesto"
                value={form.presupuesto}
                onChange={handleChange}
                placeholder="500000"
                type="number"
                className="w-full p-3 pl-8 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-[#07767c] focus:outline-none transition-all bg-white shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-2 text-sm">
              Duración Estimada
            </label>
            <input
              name="duracion_estimada"
              value={form.duracion_estimada}
              onChange={handleChange}
              placeholder="Ej: 4 semanas"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-[#07767c] focus:outline-none transition-all bg-white shadow-sm"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-2 text-sm">
              Fecha Límite
            </label>
            <input
              name="fecha_limite"
              value={form.fecha_limite}
              onChange={handleChange}
              type="date"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-[#07767c] focus:outline-none transition-all bg-white shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* ─────────────── Sección 3 ─────────────── */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-[#07767c]/20 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-[#07767c] rounded-lg flex items-center justify-center text-white text-xl shadow-md">
            ⚙️
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            Condiciones del Proyecto
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-gray-800 font-semibold mb-2 text-sm">
              Ubicación
            </label>
            <input
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              placeholder="Ej: Santiago, remoto..."
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-[#07767c] focus:outline-none transition-all bg-white shadow-sm"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-2 text-sm">
              Tipo de Contratación
            </label>
            <input
              name="tipo_contratacion"
              value={form.tipo_contratacion}
              onChange={handleChange}
              placeholder="Ej: Freelance, tiempo completo..."
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-[#07767c] focus:outline-none transition-all bg-white shadow-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-800 font-semibold mb-2 text-sm">
              Metodología de Trabajo
            </label>
            <input
              name="metodologia_trabajo"
              value={form.metodologia_trabajo}
              onChange={handleChange}
              placeholder="Ej: Scrum, Kanban..."
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-[#07767c] focus:outline-none transition-all bg-white shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* ─────────────── Botón ─────────────── */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#07767c] to-[#0a9fa6] hover:from-[#055a5f] hover:to-[#07767c] text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
        >
          <span className="text-2xl">💾</span>
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;