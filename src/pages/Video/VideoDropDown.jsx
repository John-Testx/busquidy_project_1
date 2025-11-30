// src/components/Video/VideoDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Para IDs de sala únicos
import { Video, LogIn } from 'lucide-react'; // Usamos lucide-react (ya lo tienes)

const VideoDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // --- Cierra el dropdown si se hace clic fuera ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  // -------------------------------------------------

  // Lógica para crear una sala
  const handleCreateRoom = () => {
    const newRoomId = uuidv4(); // Genera un ID (ej: 'a1b2c3d4-...')
    setIsOpen(false);
    navigate(`/video/${newRoomId}`); // Navega a tu VideoCallPage
  };

  // Lógica para unirse a una sala
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomId.trim()) {
      setIsOpen(false);
      navigate(`/video/${roomId}`); // Navega a la sala con el ID
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* --- El Botón/Icono del Navbar --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-[#07767c] hover:bg-gray-50 rounded-lg transition-colors"
        aria-label="Opciones de videollamada"
      >
        <Video size={20} />
      </button>

      {/* --- El Menú Desplegable (se muestra si isOpen es true) --- */}
      {isOpen && (
        <div 
          className="absolute top-full right-0 z-50 mt-2 w-72 origin-top-right rounded-xl bg-white py-2 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Opción 1: Crear Sala */}
          <button
            onClick={handleCreateRoom}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#07767c]/5 hover:text-[#07767c] transition-colors"
          >
            <Video size={18} />
            <span>Crear sala instantánea</span>
          </button>
          
          <div className="border-t border-gray-100 my-1"></div>

          {/* Opción 2: Unirse a Sala */}
          <form onSubmit={handleJoinRoom} className="p-2 pt-1">
            <label htmlFor="room-id" className="block px-2 pb-2 text-xs font-semibold text-gray-500 uppercase">
              Unirse con ID
            </label>
            <div className="relative">
              <input
                type="text"
                id="room-id"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Pegar ID de la sala"
                className="w-full pl-3 pr-10 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#07767c]/50 focus:border-[#07767c] focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-gradient-to-r from-[#07767c] to-[#055a5f] text-white rounded-md hover:from-[#055a5f] shadow-md transition-all duration-300 flex items-center justify-center"
              >
                <LogIn size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VideoDropdown;