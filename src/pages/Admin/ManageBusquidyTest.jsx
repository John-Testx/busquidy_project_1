import React, { useState, useEffect } from "react";
import apiClient from "@/api/apiClient";
import MainLayout from "@/components/Layouts/MainLayout";
import SidebarAdmin from "@/components/Admin/SidebarAdmin";
import { Edit, Trash2, Plus, Save, X } from "lucide-react";

const ManageBusquidyTest = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // State for the form (Edit/Create)
  const [formData, setFormData] = useState({
    enunciado: "",
    modulo: "Compromiso",
    dimension: "Afectivo",
    orden: 0,
    is_publicada: 1
  });

  // Load questions
  const fetchQuestions = async () => {
    try {
      const res = await apiClient.get("/admin/test/questions");
      setQuestions(res.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Group questions for display
  const groupedQuestions = questions.reduce((acc, q) => {
    const key = `${q.modulo} - ${q.dimension}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(q);
    return acc;
  }, {});

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta pregunta?")) {
      await apiClient.delete(`/admin/test/questions/${id}`);
      fetchQuestions();
    }
  };

  const handleEdit = (q) => {
    setEditingId(q.id_pregunta);
    setFormData({ ...q });
  };

  const handleSave = async () => {
    if (editingId) {
      // Update
      await apiClient.put(`/admin/test/questions/${editingId}`, formData);
    } else {
      // Create
      await apiClient.post("/admin/test/questions", formData);
    }
    setEditingId(null);
    setFormData({
      enunciado: "",
      modulo: "Compromiso",
      dimension: "Afectivo",
      orden: questions.length + 1,
      is_publicada: 1
    });
    fetchQuestions();
  };

  return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Gestión Test Busquidy</h1>
            <button 
              onClick={() => setEditingId("NEW")}
              className="bg-[#07767c] text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Plus size={18} /> Nueva Pregunta
            </button>
          </div>

          {/* FORMULARIO DE EDICIÓN/CREACIÓN */}
          {(editingId !== null) && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-[#07767c]/20">
              <h3 className="font-bold mb-4">{editingId === "NEW" ? "Crear Pregunta" : "Editar Pregunta"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Módulo</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={formData.modulo}
                    onChange={e => setFormData({...formData, modulo: e.target.value})}
                  >
                    <option value="Compromiso">Compromiso</option>
                    <option value="Responsabilidad">Responsabilidad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dimensión</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={formData.dimension}
                    onChange={e => setFormData({...formData, dimension: e.target.value})}
                  >
                    {formData.modulo === "Compromiso" ? (
                      <>
                        <option value="Afectivo">Afectivo (Querer)</option>
                        <option value="Continuidad">Continuidad (Necesitar)</option>
                        <option value="Normativo">Normativo (Deber)</option>
                      </>
                    ) : (
                      <>
                        <option value="Fiabilidad">Fiabilidad (Diligencia)</option>
                        <option value="Transparencia">Transparencia (Honestidad)</option>
                        <option value="Propiedad">Propiedad (Accountability)</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Enunciado (Pregunta)</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded"
                    value={formData.enunciado}
                    onChange={e => setFormData({...formData, enunciado: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Orden</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded"
                    value={formData.orden}
                    onChange={e => setFormData({...formData, orden: e.target.value})}
                  />
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.is_publicada}
                    onChange={e => setFormData({...formData, is_publicada: e.target.checked ? 1 : 0})}
                    className="mr-2"
                  />
                  <label>Publicada</label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditingId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                <button onClick={handleSave} className="px-4 py-2 bg-[#07767c] text-white rounded hover:bg-[#055a5f]">Guardar</button>
              </div>
            </div>
          )}

          {/* LISTA DE PREGUNTAS */}
          {loading ? <p>Cargando...</p> : (
            <div className="space-y-6">
              {Object.entries(groupedQuestions).map(([groupName, groupQuestions]) => (
                <div key={groupName} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 font-bold text-gray-700 uppercase text-sm tracking-wider">
                    {groupName}
                  </div>
                  <div className="divide-y divide-gray-200">
                    {groupQuestions.map((q) => (
                      <div key={q.id_pregunta} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">Orden: {q.orden}</span>
                            {!q.is_publicada && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">Oculta</span>}
                          </div>
                          <p className="text-gray-800">{q.enunciado}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button onClick={() => handleEdit(q)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(q.id_pregunta)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
};

export default ManageBusquidyTest;