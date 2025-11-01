import React from "react";
import Select from "react-select";
import 'bootstrap-icons/font/bootstrap-icons.css';

function SearchPublicationSection({ 
  filters, 
  showMoreFilters, 
  onFilterChange, 
  onUpdateFilter,
  onClearFilters, 
  onToggleMoreFilters 
}) {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#07767c' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(7, 118, 124, 0.1)' : 'none',
      borderRadius: '0.5rem',
      minHeight: '38px',
      borderWidth: '1.5px',
      '&:hover': {
        borderColor: '#07767c'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#07767c' : state.isFocused ? '#e0f2f3' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      fontSize: '0.875rem',
      padding: '8px 12px',
      '&:hover': {
        backgroundColor: state.isSelected ? '#07767c' : '#e0f2f3'
      }
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: '0.875rem',
      color: '#6b7280'
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '0.875rem',
      color: '#374151'
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '2px 8px'
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '4px',
      color: '#6b7280'
    })
  };

  const carreraOptions = [
    { value: "todos", label: "Todas" },
    { value: "informatica", label: "Informática" },
    { value: "diseno", label: "Diseño" }
  ];

  const regionOptions = [
    { value: "todos", label: "Todas" },
    { value: "norte", label: "Norte" },
    { value: "sur", label: "Sur" }
  ];

  const comunaOptions = [
    { value: "todos", label: "Todas" },
    { value: "comuna1", label: "Comuna 1" },
    { value: "comuna2", label: "Comuna 2" },
    { value: "comuna3", label: "Comuna 3" }
  ];

  const jornadaOptions = [
    { value: "todos", label: "Todas" },
    { value: "completa", label: "Completa" },
    { value: "parcial", label: "Parcial" }
  ];

  const areaTrabajoOptions = [
    { value: "todos", label: "Todas" },
    { value: "informatica", label: "Informática" },
    { value: "diseno", label: "Diseño" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onUpdateFilter(name, value);
  };

  const handleSelectChange = (name) => (selectedOption) => {
    onUpdateFilter(name, selectedOption.value);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Search Bar Principal */}
        <div className="flex flex-col lg:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:border-[#07767c] focus:ring-2 focus:ring-[#07767c]/20 hover:border-gray-400" 
              placeholder="Buscar proyectos por título, empresa o palabra clave..." 
              name="searchText"
              value={filters.searchText}
              onChange={handleInputChange}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-gradient-to-br from-[#07767c] to-[#40E0D0] rounded-lg flex items-center justify-center">
              <i className="bi bi-search text-white text-sm"></i>
            </div>
          </div>
          
          <div className="flex gap-2">
            <select 
              className="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-sm text-gray-700 font-medium transition-all duration-200 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%2307767c%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_12px_center] bg-[length:14px] pr-10 hover:border-[#07767c] focus:outline-none focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c]"
              name="projectSize"
              value={filters.projectSize}
              onChange={handleInputChange}
            >
              <option value="todos">Todos los tamaños</option>
              <option value="mediano">Mediano</option>
              <option value="pequeno">Pequeño</option>
              <option value="micro">Micro</option>
            </select>
            
            <button 
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#40E0D0] text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-md hover:from-[#05595d] hover:to-[#07767c]"
            >
              <i className="bi bi-search text-base"></i>
              <span>Buscar</span>
            </button>
          </div>
        </div>

        {/* Filtros rápidos - CENTRADOS */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <select 
            className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm text-gray-700 font-medium transition-all duration-200 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2710%27%20height=%2710%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%23666%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_10px_center] bg-[length:12px] pr-8 hover:bg-white hover:border-[#07767c] focus:outline-none focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c]"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleInputChange}
          >
            <option value="ordenar-por">Ordenar por</option>
            <option value="relevancia">Más relevantes</option>
            <option value="fecha">Más recientes</option>
            <option value="salario">Mejor pagados</option>
          </select>

          <select 
            className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm text-gray-700 font-medium transition-all duration-200 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2710%27%20height=%2710%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%23666%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_10px_center] bg-[length:12px] pr-8 hover:bg-white hover:border-[#07767c] focus:outline-none focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c]"
            name="date"
            value={filters.date}
            onChange={handleInputChange}
          >
            <option value="fecha">Fecha</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
          </select>

          <select 
            className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm text-gray-700 font-medium transition-all duration-200 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2710%27%20height=%2710%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%23666%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_10px_center] bg-[length:12px] pr-8 hover:bg-white hover:border-[#07767c] focus:outline-none focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c]"
            name="modality"
            value={filters.modality}
            onChange={handleInputChange}
          >
            <option value="modalidad">Modalidad</option>
            <option value="remoto">Remoto</option>
            <option value="presencial">Presencial</option>
            <option value="hibrido">Híbrido</option>
          </select>

          <select 
            className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm text-gray-700 font-medium transition-all duration-200 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2710%27%20height=%2710%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%23666%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_10px_center] bg-[length:12px] pr-8 hover:bg-white hover:border-[#07767c] focus:outline-none focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c]"
            name="experience"
            value={filters.experience}
            onChange={handleInputChange}
          >
            <option value="experiencia">Experiencia</option>
            <option value="sin-experiencia">Sin experiencia</option>
            <option value="1ano">1 año</option>
            <option value="2ano">2 años</option>
            <option value="3-4ano">3-4 años</option>
            <option value="5-10ano">5-10 años</option>
            <option value="mas10anos">Más de 10 años</option>
          </select>

          {/* Separador visual */}
          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
              showMoreFilters 
                ? 'bg-[#07767c] text-white shadow-md' 
                : 'bg-transparent border-2 border-[#07767c] text-[#07767c] hover:bg-[#07767c] hover:text-white'
            }`}
            onClick={onToggleMoreFilters}
          >
            <i className={`bi ${showMoreFilters ? 'bi-funnel-fill' : 'bi-funnel'}`}></i>
            <span>{showMoreFilters ? "Menos filtros" : "Más filtros"}</span>
          </button>
        </div>

        {/* Filtros avanzados - SIN OVERFLOW HIDDEN */}
        <div 
          className={`transition-all duration-300 ease-in-out ${
            showMoreFilters ? 'max-h-[600px] opacity-100 pb-4' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <i className="bi bi-sliders2 text-[#07767c]"></i>
                Filtros avanzados
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
                  onClick={onClearFilters}
                >
                  <i className="bi bi-x-circle"></i>
                  Limpiar todo
                </button>
                <button 
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#07767c] to-[#40E0D0] text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-md hover:from-[#05595d] hover:to-[#07767c]"
                >
                  <i className="bi bi-check-circle"></i>
                  Aplicar
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                  <i className="bi bi-mortarboard text-[#07767c] text-sm"></i>
                  Carrera
                </label>
                <Select 
                  options={carreraOptions} 
                  placeholder="Todas..." 
                  isSearchable={true} 
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  onChange={handleSelectChange('career')}
                  value={carreraOptions.find(opt => opt.value === filters.career)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                  <i className="bi bi-geo-alt text-[#07767c] text-sm"></i>
                  Región
                </label>
                <Select 
                  options={regionOptions} 
                  placeholder="Todas..." 
                  isSearchable={true} 
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  onChange={handleSelectChange('region')}
                  value={regionOptions.find(opt => opt.value === filters.region)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                  <i className="bi bi-pin-map text-[#07767c] text-sm"></i>
                  Comuna
                </label>
                <Select 
                  options={comunaOptions} 
                  placeholder="Todas..." 
                  isSearchable={true} 
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  onChange={handleSelectChange('commune')}
                  value={comunaOptions.find(opt => opt.value === filters.commune)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                  <i className="bi bi-clock text-[#07767c] text-sm"></i>
                  Jornada
                </label>
                <Select 
                  options={jornadaOptions} 
                  placeholder="Todas..." 
                  isSearchable={true} 
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  onChange={handleSelectChange('workday')}
                  value={jornadaOptions.find(opt => opt.value === filters.workday)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                  <i className="bi bi-briefcase text-[#07767c] text-sm"></i>
                  Área de trabajo
                </label>
                <Select 
                  options={areaTrabajoOptions} 
                  placeholder="Todas..." 
                  isSearchable={true} 
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  onChange={handleSelectChange('workArea')}
                  value={areaTrabajoOptions.find(opt => opt.value === filters.workArea)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPublicationSection;