import React, { useState } from "react";
import Select from "react-select";
// import "../../../styles/Freelancer/SearchPublicationSection.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

function SearchPublicationSection({ onFilterChange }) {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchText: '',
    projectSize: 'todos',
    sortBy: 'relevancia',
    date: 'todos',
    modality: 'todos',
    disability: 'todos',
    experience: 'todos',
    career: 'todos',
    region: 'todos',
    commune: 'todos',
    workday: 'todos',
    workArea: 'todos'
  });

  const customStyles = {
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

  const toggleFilters = () => {
    setShowMoreFilters(!showMoreFilters);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSelectChange = (name) => (selectedOption) => {
    const updatedFilters = { ...filters, [name]: selectedOption.value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSearch = () => {
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      searchText: '',
      projectSize: 'todos',
      sortBy: 'relevancia',
      date: 'todos',
      modality: 'todos',
      disability: 'todos',
      experience: 'todos',
      career: 'todos',
      region: 'todos',
      commune: 'todos',
      workday: 'todos',
      workArea: 'todos'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 max-w-6xl mx-auto my-5">
      {/* Search Bar Container */}
      <div className="flex flex-col md:flex-row gap-2.5 mb-5">
        <input 
          type="text" 
          className="flex-grow px-4 py-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-300 shadow-sm focus:outline-none focus:border-[#07767c] focus:ring-4 focus:ring-[#07767c]/10" 
          placeholder="Buscar por nombre..." 
          name="searchText"
          value={filters.searchText}
          onChange={handleInputChange}
        />
        <div>
          <select 
            className="w-full md:w-auto px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-sm text-gray-800 transition-all duration-300 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%2307767c%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_10px_center] bg-[length:12px] pr-8 hover:bg-gray-100 hover:border-[#07767c] focus:outline-none focus:ring-4 focus:ring-[#07767c]/10"
            name="projectSize"
            value={filters.projectSize}
            onChange={handleInputChange}
          >
            <option value="todos">Proyecto</option>
            <option value="mediano">Mediano</option>
            <option value="pequeno">Pequeño</option>
            <option value="micro">Micro</option>
          </select>
        </div>
        <button 
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#07767c] text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:bg-[#055b63] hover:-translate-y-0.5 hover:shadow-lg"
          onClick={handleSearch}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Buscar
        </button>
      </div>

      {/* Main Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-5">
        <select 
          className="px-4 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-lg text-sm text-gray-800 transition-all duration-300 cursor-pointer max-w-xs appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%2307767c%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_10px_center] bg-[length:12px] pr-8 hover:bg-gray-100 hover:border-[#07767c] focus:outline-none focus:ring-4 focus:ring-[#07767c]/10"
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
          className="px-4 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-lg text-sm text-gray-800 transition-all duration-300 cursor-pointer max-w-xs appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%2307767c%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_10px_center] bg-[length:12px] pr-8 hover:bg-gray-100 hover:border-[#07767c] focus:outline-none focus:ring-4 focus:ring-[#07767c]/10"
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
          className="px-4 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-lg text-sm text-gray-800 transition-all duration-300 cursor-pointer max-w-xs appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%2307767c%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_10px_center] bg-[length:12px] pr-8 hover:bg-gray-100 hover:border-[#07767c] focus:outline-none focus:ring-4 focus:ring-[#07767c]/10"
          name="modality"
          value={filters.modality}
          onChange={handleInputChange}
        >
          <option value="modalidad">Modalidad</option>
          <option value="remoto">Remoto</option>
          <option value="presencial">Presencial</option>
        </select>

        <select 
          className="px-4 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-lg text-sm text-gray-800 transition-all duration-300 cursor-pointer max-w-xs appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%2307767c%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_10px_center] bg-[length:12px] pr-8 hover:bg-gray-100 hover:border-[#07767c] focus:outline-none focus:ring-4 focus:ring-[#07767c]/10"
          name="disability"
          value={filters.disability}
          onChange={handleInputChange}
        >
          <option value="discapacidad">Discapacidad</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>

        <select 
          className="px-4 py-2.5 bg-gray-50 border-2 border-gray-300 rounded-lg text-sm text-gray-800 transition-all duration-300 cursor-pointer max-w-xs appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2012%2012%27%20fill=%27none%27%20stroke=%27%2307767c%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%272%204%206%208%2010%204%27/%3e%3c/svg%3e')] bg-no-repeat bg-[right_10px_center] bg-[length:12px] pr-8 hover:bg-gray-100 hover:border-[#07767c] focus:outline-none focus:ring-4 focus:ring-[#07767c]/10"
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
          className="flex items-center gap-2 bg-transparent text-[#07767c] font-semibold cursor-pointer transition-all duration-300 px-3 py-2 rounded-md hover:bg-[#07767c]/5 hover:text-[#055b63]"
          onClick={toggleFilters}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
          </svg>
          {showMoreFilters ? "Ocultar filtros" : "Mostrar más filtros"}
        </button>
      </div>
      
      {/* Additional Filters */}
      <div 
        className={`transition-all duration-500 ease-in-out bg-gray-50 rounded-xl overflow-hidden ${
          showMoreFilters ? 'max-h-[1000px] opacity-100 p-5 mt-4' : 'max-h-0 opacity-0 p-0'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {/* Carrera */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Carrera</label>
            <Select 
              options={carreraOptions} 
              placeholder="Todas" 
              isSearchable={true} 
              styles={customStyles} 
              onChange={handleSelectChange('career')}
            />
          </div>

          {/* Región */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Región</label>
            <Select 
              options={regionOptions} 
              placeholder="Todas" 
              isSearchable={true} 
              onChange={handleSelectChange('region')}
            />
          </div>

          {/* Comuna */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Comuna</label>
            <Select 
              options={comunaOptions} 
              placeholder="Todas" 
              isSearchable={true} 
              onChange={handleSelectChange('commune')}
            />
          </div>

          {/* Jornada */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Jornada</label>
            <Select 
              options={jornadaOptions} 
              placeholder="Todas" 
              isSearchable={true} 
              onChange={handleSelectChange('workday')}
            />
          </div>

          {/* Área de trabajo */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Área de trabajo</label>
            <Select 
              options={areaTrabajoOptions} 
              placeholder="Todas" 
              isSearchable={true} 
              onChange={handleSelectChange('workArea')}
            />
          </div>

          {/* Filter Buttons */}
          <div className="col-span-full flex justify-center gap-4 mt-5">
            <button 
              className="flex items-center gap-2 px-5 py-2.5 bg-[#07767c] text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:bg-[#055b63]"
              onClick={handleSearch}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
              </svg>
              Aplicar filtros
            </button>
            <button 
              className="flex items-center gap-2 px-5 py-2.5 bg-[#f0ad4e] text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:bg-[#e09835]"
              onClick={handleClearFilters}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/>
              </svg>
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPublicationSection;