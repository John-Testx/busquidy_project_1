import React, { useState } from "react";

function SearchFilters({ onFilterChange }) {
    const [location, setLocation] = useState("");
    const [rating, setRating] = useState("");
    const [skills, setSkills] = useState("");
    const [search, setSearch] = useState("");
    
    const handleFilterChange = () => {
        const filters = {
            search,
            location,
            rating: rating ? parseInt(rating) : null,
            skills
        };
        onFilterChange(filters);
    };
    
    const handleReset = () => {
        setLocation("");
        setRating("");
        setSkills("");
        setSearch("");
       
        onFilterChange({
            search: "",
            location: "",
            rating: null,
            skills: ""
        });
    };
    
    return (
        <div className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl">
                {/* Header */}
                <div className="mb-6 pb-4 border-b-2 border-[#07767c]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#07767c] to-[#0a474f] rounded-lg flex items-center justify-center">
                            <svg 
                                className="w-5 h-5 text-white" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Filtros
                        </h2>
                    </div>
                </div>
                
                {/* Filter Groups */}
                <div className="space-y-5">
                    
                    {/* Buscar por nombre */}
                    <div className="filter-group">
                        <label 
                            htmlFor="search" 
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Buscar por nombre
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg 
                                    className="w-4 h-4 text-gray-400" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="search"
                                placeholder="Ej. Ricardo"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent transition-all duration-200 outline-none"
                            />
                        </div>
                    </div>
                    
                    {/* Ubicación */}
                    <div className="filter-group">
                        <label 
                            htmlFor="location" 
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Ubicación
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg 
                                    className="w-4 h-4 text-gray-400" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                                    />
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="location"
                                placeholder="Ej. Santiago"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent transition-all duration-200 outline-none"
                            />
                        </div>
                    </div>
                    
                    {/* Calificación */}
                    <div className="filter-group">
                        <label 
                            htmlFor="rating" 
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Calificación
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg 
                                    className="w-4 h-4 text-yellow-500" 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <select
                                id="rating"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white cursor-pointer"
                            >
                                <option value="">Todas</option>
                                <option value="5">⭐⭐⭐⭐⭐</option>
                                <option value="4">⭐⭐⭐⭐</option>
                                <option value="3">⭐⭐⭐</option>
                                <option value="2">⭐⭐</option>
                                <option value="1">⭐</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg 
                                    className="w-4 h-4 text-gray-400" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M19 9l-7 7-7-7" 
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    {/* Habilidades */}
                    <div className="filter-group">
                        <label 
                            htmlFor="skills" 
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Habilidades
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg 
                                    className="w-4 h-4 text-gray-400" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" 
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="skills"
                                placeholder="Ej. React, Node.js"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent transition-all duration-200 outline-none"
                            />
                        </div>
                    </div>
                    
                </div>
                
                {/* Buttons */}
                <div className="mt-6 space-y-3 pt-5 border-t border-gray-200">
                    <button 
                        onClick={handleFilterChange} 
                        className="w-full bg-gradient-to-r from-[#07767c] to-[#0a474f] text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M5 13l4 4L19 7" 
                            />
                        </svg>
                        Aplicar Filtros
                    </button>
                    <button 
                        onClick={handleReset} 
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                            />
                        </svg>
                        Restablecer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SearchFilters;