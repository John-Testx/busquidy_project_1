import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaStar, FaTags, FaFilter, FaUndo } from 'react-icons/fa';

function SearchFilters({ onFilterChange }) {
    const [location, setLocation] = useState("");
    const [rating, setRating] = useState("");
    const [skills, setSkills] = useState("");
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState(0);
    
    const handleFilterChange = () => {
        const filters = {
            search,
            location,
            rating: rating ? parseInt(rating) : null,
            skills
        };
        
        // Contar filtros activos
        let count = 0;
        if (search) count++;
        if (location) count++;
        if (rating) count++;
        if (skills) count++;
        setActiveFilters(count);
        
        onFilterChange(filters);
    };
    
    const handleReset = () => {
        setLocation("");
        setRating("");
        setSkills("");
        setSearch("");
        setActiveFilters(0);
       
        onFilterChange({
            search: "",
            location: "",
            rating: null,
            skills: ""
        });
    };
    
    return (
        <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
                {/* Header con gradiente */}
                <div className="bg-gradient-to-br from-[#07767c] to-[#05595d] px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <FaFilter className="text-white text-lg" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Filtros de Búsqueda
                                </h2>
                                {activeFilters > 0 && (
                                    <p className="text-white/80 text-xs mt-0.5">
                                        {activeFilters} {activeFilters === 1 ? 'filtro activo' : 'filtros activos'}
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        {activeFilters > 0 && (
                            <div className="w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{activeFilters}</span>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Filter Groups */}
                <div className="p-6 space-y-5">
                    
                    {/* Buscar por nombre */}
                    <div className="filter-group">
                        <label 
                            htmlFor="search" 
                            className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3"
                        >
                            <FaSearch className="text-[#07767c]" />
                            Buscar por nombre
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="search"
                                placeholder="Ej. Ricardo García"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-all duration-200 outline-none hover:border-gray-300"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Ubicación */}
                    <div className="filter-group">
                        <label 
                            htmlFor="location" 
                            className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3"
                        >
                            <FaMapMarkerAlt className="text-[#07767c]" />
                            Ubicación
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="location"
                                placeholder="Ej. Santiago, Valparaíso"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-all duration-200 outline-none hover:border-gray-300"
                            />
                            {location && (
                                <button
                                    onClick={() => setLocation("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Calificación */}
                    <div className="filter-group">
                        <label 
                            htmlFor="rating" 
                            className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3"
                        >
                            <FaStar className="text-[#07767c]" />
                            Calificación mínima
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star.toString())}
                                    className={`flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all duration-200 ${
                                        rating === star.toString()
                                            ? 'bg-gradient-to-br from-[#07767c] to-[#05595d] border-[#07767c] text-white shadow-lg scale-105'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-[#07767c]/30 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="text-lg mb-1">
                                        {rating === star.toString() ? '⭐' : '☆'}
                                    </span>
                                    <span className="text-xs font-bold">{star}</span>
                                </button>
                            ))}
                        </div>
                        {rating && (
                            <button
                                onClick={() => setRating("")}
                                className="mt-2 text-xs text-gray-500 hover:text-[#07767c] font-medium transition-colors"
                            >
                                Limpiar calificación
                            </button>
                        )}
                    </div>
                    
                    {/* Habilidades */}
                    <div className="filter-group">
                        <label 
                            htmlFor="skills" 
                            className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3"
                        >
                            <FaTags className="text-[#07767c]" />
                            Habilidades
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="skills"
                                placeholder="Ej. React, Node.js, Python"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-all duration-200 outline-none hover:border-gray-300"
                            />
                            {skills && (
                                <button
                                    onClick={() => setSkills("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Separa múltiples habilidades con comas
                        </p>
                    </div>
                    
                </div>
                
                {/* Buttons */}
                <div className="px-6 pb-6 space-y-3">
                    <button 
                        onClick={handleFilterChange} 
                        className="w-full bg-gradient-to-r from-[#07767c] to-[#05595d] text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <FaSearch className="text-sm" />
                        <span>Aplicar Filtros</span>
                    </button>
                    
                    {activeFilters > 0 && (
                        <button 
                            onClick={handleReset} 
                            className="w-full bg-white border-2 border-gray-300 text-gray-700 font-bold py-4 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <FaUndo className="text-sm" />
                            <span>Limpiar Filtros</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchFilters;