import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import FormExperiencia from './Forms/FormExperiencia';
import FormEducacionSuperior from './Forms/FormEducacionSuperior';
import FormEducacionBasica from './Forms/FormEducacionBasica';
import FormCurso from './Forms/FormCurso';
import FormIdioma from './Forms/FormIdioma';
import FormHabilidad from './Forms/FormHabilidad';
import FormPresentacion from './Forms/FormPresentacion';
import FormPretensiones from './Forms/FormPretensiones';
import FormInclusionLaboral from './Forms/FormInclusionLaboral';      // NUEVO
import FormEmprendimiento from './Forms/FormEmprendimiento';          // NUEVO
import FormInformacionGeneral from './Forms/FormInformacionGeneral';  // NUEVO
import FormFormacion from './Forms/FormFormacion';                    // NUEVO

/**
 * Modal reutilizable para gestionar las secciones del perfil
 */
function ModalGestionSeccion({ 
  isOpen, 
  onClose, 
  mode, 
  sectionName, 
  currentItem,
  onSubmit 
}) {
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Inicializar formData cuando cambie el currentItem
  useEffect(() => {
    if (mode === 'edit' && currentItem) {
      setFormData(currentItem);
    } else {
      setFormData({});
    }
  }, [mode, currentItem]);

  if (!isOpen) return null;

  const handleFormChange = (newData) => {
    setFormData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let result;
      if (mode === 'add') {
        result = await onSubmit(formData);
      } else {
        // Para edit, necesitamos el ID del ítem
        const itemId = currentItem?.id_trabajo_practica || 
                       currentItem?.id_educacion_superior || 
                       currentItem?.id_educacion_basica_media ||
                       currentItem?.id_curso ||
                       currentItem?.id_idioma ||
                       currentItem?.id_habilidad ||
                       currentItem?.id_inclusion_laboral ||
                       currentItem?.id_emprendimiento ||
                       currentItem?.id_nivel_educacional;
        result = await onSubmit(itemId, formData);
      }

      if (result?.success) {
        alert(result.message);
        onClose();
      } else {
        alert(result?.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error en submit:', error);
      alert('Error al procesar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  // Renderizar el formulario correspondiente según la sección
  const renderForm = () => {
    const commonProps = {
      formData,
      onChange: handleFormChange,
      mode
    };

    switch (sectionName) {
      case 'experiencia':
        return <FormExperiencia {...commonProps} />;
      
      case 'educacion_superior':
        return <FormEducacionSuperior {...commonProps} />;
      
      case 'educacion_basica':
        return <FormEducacionBasica {...commonProps} />;
      
      case 'curso':
        return <FormCurso {...commonProps} />;
      
      case 'idioma':
        return <FormIdioma {...commonProps} />;
      
      case 'habilidad':
        return <FormHabilidad {...commonProps} />;
      
      case 'presentacion':
        return <FormPresentacion {...commonProps} />;
      
      case 'pretensiones':
        return <FormPretensiones {...commonProps} />;
      
      case 'inclusion_laboral':                          // NUEVO
        return <FormInclusionLaboral {...commonProps} />;
      
      case 'emprendimiento':                             // NUEVO
        return <FormEmprendimiento {...commonProps} />;
      
      case 'informacion_general':                        // NUEVO
        return <FormInformacionGeneral {...commonProps} />;
      
      case 'formacion':                                  // NUEVO
        return <FormFormacion {...commonProps} />;
      
      default:
        return <p className="text-red-600">Sección no reconocida: {sectionName}</p>;
    }
  };

  const getTitulo = () => {
    const titulos = {
      experiencia: 'Experiencia Laboral',
      educacion_superior: 'Educación Superior',
      educacion_basica: 'Educación Básica/Media',
      curso: 'Curso/Certificación',
      idioma: 'Idioma',
      habilidad: 'Habilidad',
      presentacion: 'Presentación',
      pretensiones: 'Pretensiones Laborales',
      inclusion_laboral: 'Inclusión Laboral',          // NUEVO
      emprendimiento: 'Emprendimiento',                // NUEVO
      informacion_general: 'Información General',      // NUEVO
      formacion: 'Nivel Educacional'                   // NUEVO
    };
    
    const accion = mode === 'add' ? 'Agregar' : 'Editar';
    return `${accion} ${titulos[sectionName] || 'Sección'}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{getTitulo()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={submitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {renderForm()}

          {/* Actions */}
          <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalGestionSeccion;