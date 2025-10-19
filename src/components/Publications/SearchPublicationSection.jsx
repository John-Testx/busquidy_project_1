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
      '&:hover': {
        borderColor: '#07767c'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#07767c' : state.isFocused ? '#e0f2f3' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#07767c' : '#e0f2f3'
      }
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
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
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-7xl mx-auto my-8">
      {/* Header decorativo */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-[#07767c] to-[#40E0D0] rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-800">Buscar Publicaciones</h2>
      </div>

      {/* Search Bar Container */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-grow relative">
          <input 
            type="text" 
            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 shadow-sm focus:outline-none focus:border-[#07767c] focus:ring-4 focus:ring-[#07767c]/10" 
            placeholder="Buscar por nombre del proyecto..." 
            name="searchText"
            value={filters.searchText}
            onChange={handleInputChange}
          />
          <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-[#07767c] text-xl"></i>
        </div>
        
        <div className="md:w-48">
          <select 
            className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-sm text-gray-800 transition-all duration-300 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%2307767c%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_12px_center] bg-[length:14px] pr-10 hover:bg-gray-50 hover:border-[#07767c] focus:outline-none focus:ring-4 focus:ring-[#07767c]/10"
            name="projectSize"
            value={filters.projectSize}
            onChange={handleInputChange}
          >
            <option value="todos">Tamaño: Todos</option>
            <option value="mediano">Mediano</option>
            <option value="pequeno">Pequeño</option>
            <option value="micro">Micro</option>
          </select>
        </div>
        
        <button 
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#07767c] to-[#05595d] text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:from-[#05595d] hover:to-[#043d42] hover:-translate-y-0.5 hover:shadow-xl"
        >
          <i className="bi bi-search text-lg"></i>
          <span>Buscar</span>
        </button>
      </div>

      {/* Main Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <select 
          className="px-4 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-lg text-sm text-gray-800 transition-all duration-300 cursor-pointer max-w-xs appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2710%27%20height=%2710%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%2307767c%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_10px_center] bg-[length:12px] pr-8 hover:bg-white hover:border-[#07767c] focus:outline-none focus:ring-2 focus:ring-[#07767c]/20"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleInputChange}
        >
          <option value="ordenar-por">Ordenar por</option>
          <option value="relevancia">Relevancia</option>
          <option value="fecha">Fecha</option>
          <option value="salario">Salario</option>
        </select>
        <select 
          className="px-4 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-lg text-sm text-gray-800 transition-all duration-300 cursor-pointer max-w-xs appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2710%27%20height=%2710%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%2307767c%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_10px_center] bg-[length:12px] pr-8 hover:bg-white hover:border-[#07767c] focus:outline-none focus:ring-2 focus:ring-[#07767c]/20"
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
          className="px-4 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-lg text-sm text-gray-800 transition-all duration-300 cursor-pointer max-w-xs appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2710%27%20height=%2710%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%2307767c%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_10px_center] bg-[length:12px] pr-8 hover:bg-white hover:border-[#07767c] focus:outline-none focus:ring-2 focus:ring-[#07767c]/20"
          name="modality"
          value={filters.modality}
          onChange={handleInputChange}
        >
          <option value="modalidad">Modalidad</option>
          <option value="remoto">Remoto</option>
          <option value="presencial">Presencial</option>
        </select>
        <select 
          className="px-4 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-lg text-sm text-gray-800 transition-all duration-300 cursor-pointer max-w-xs appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2710%27%20height=%2710%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%2307767c%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_10px_center] bg-[length:12px] pr-8 hover:bg-white hover:border-[#07767c] focus:outline-none focus:ring-2 focus:ring-[#07767c]/20"
          name="disability"
          value={filters.disability}
          onChange={handleInputChange}
        >
          <option value="discapacidad">Discapacidad</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>
        <select 
          className="px-4 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-lg text-sm text-gray-800 transition-all duration-300 cursor-pointer max-w-xs appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2710%27%20height=%2710%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%2307767c%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_10px_center] bg-[length:12px] pr-8 hover:bg-white hover:border-[#07767c] focus:outline-none focus:ring-2 focus:ring-[#07767c]/20"
          name="experience"
          value={filters.experience}
          onChange={handleInputChange}
        >
          <option value="discapacidad">Experiencia</option>
          <option value="sin-experiencia">Sin experiencia</option>
          <option value="1ano">1 año</option>
          <option value="2ano">2 años</option>
          <option value="3-4ano">3-4 años</option>
          <option value="5-10ano">5-10 años</option>
          <option value="mas10anos">Más de 10 años</option>
        </select>
      </div>

      {/* Toggle Filters Button */}
      <div className="flex justify-center mb-4">
        <button 
          className="flex items-center gap-2 bg-transparent text-[#07767c] font-semibold cursor-pointer transition-all duration-300 px-4 py-2.5 rounded-lg hover:bg-[#07767c]/5"
          onClick={onToggleMoreFilters}
        >
          <i className={`bi ${showMoreFilters ? 'bi-chevron-up' : 'bi-chevron-down'} text-lg`}></i>
          <span>{showMoreFilters ? "Ocultar filtros" : "Mostrar más filtros"}</span>
        </button>
      </div>
      
      {/* Additional Filters */}
      <div 
        className={`transition-all duration-500 ease-in-out bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl overflow-hidden ${
          showMoreFilters ? 'max-h-[1000px] opacity-100 p-6 mt-4 border-2 border-gray-200' : 'max-h-0 opacity-0 p-0'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Carrera</label>
            <Select 
              options={carreraOptions} 
              placeholder="Todas" 
              isSearchable={true} 
              styles={customStyles} 
              onChange={handleSelectChange('career')}
              value={carreraOptions.find(opt => opt.value === filters.career)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Región</label>
            <Select 
              options={regionOptions} 
              placeholder="Todas" 
              isSearchable={true} 
              styles={customStyles}
              onChange={handleSelectChange('region')}
              value={regionOptions.find(opt => opt.value === filters.region)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Comuna</label>
            <Select 
              options={comunaOptions} 
              placeholder="Todas" 
              isSearchable={true} 
              styles={customStyles}
              onChange={handleSelectChange('commune')}
              value={comunaOptions.find(opt => opt.value === filters.commune)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Jornada</label>
            <Select 
              options={jornadaOptions} 
              placeholder="Todas" 
              isSearchable={true} 
              styles={customStyles}
              onChange={handleSelectChange('workday')}
              value={jornadaOptions.find(opt => opt.value === filters.workday)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Área de trabajo</label>
            <Select 
              options={areaTrabajoOptions} 
              placeholder="Todas" 
              isSearchable={true} 
              styles={customStyles}
              onChange={handleSelectChange('workArea')}
              value={areaTrabajoOptions.find(opt => opt.value === filters.workArea)}
            />
          </div>
          <div className="col-span-full flex justify-center gap-4 mt-6">
            <button 
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f0ad4e] to-[#e09835] text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:from-[#e09835] hover:to-[#c87f2a] hover:-translate-y-0.5 hover:shadow-lg"
              onClick={onClearFilters}
            >
              <i className="bi bi-x-circle"></i>
              <span>Limpiar filtros</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPublicationSection;