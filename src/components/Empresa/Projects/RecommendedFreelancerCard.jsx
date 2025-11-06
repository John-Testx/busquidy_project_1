import React from 'react';
// import { Card, CardBody, CardFooter, Avatar, Button, Chip } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { StarIcon } from 'lucide-react';

function RecommendedFreelancerCard({ freelancer }) {
  const navigate = useNavigate();

  // Función para ver el perfil público del freelancer
  const handleViewProfile = () => {
    navigate(`/empresa/view-freelancer/${freelancer.id_usuario}`);
  };

  // Funciones placeholder para contactar o invitar
  const handleContact = () => {
    // Aquí puedes integrar la lógica para iniciar un chat
    console.log(`Contactar a ${freelancer.nombres}`);
    navigate('/chat');
  };

  const handleInvite = () => {
    // Aquí puedes integrar la lógica para "invitar a postular"
    // (Esto requeriría un nuevo endpoint o modal)
    console.log(`Invitar a ${freelancer.nombres}`);
  };

  // Reemplazamos <Card> con <div> y aplicamos clases de Tailwind
  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-md border border-gray-200">
      
      {/* Reemplazamos <CardBody> con <div> */}
      <div className="flex flex-col items-center text-center p-6">
        
        {/* Reemplazamos <Avatar> con <img>
        <img
          src={freelancer.avatar_url || 'https://via.placeholder.com/150'}
          alt="Foto de perfil"
          className="w-24 h-24 rounded-full text-large mb-3 object-cover border border-gray-100"
        /> */}
        
        <h4 className="font-bold text-lg text-gray-800">
          {freelancer.nombres} {freelancer.apellidos}
        </h4>
        <p className="text-sm text-gray-500">
          {freelancer.descripcion?.substring(0, 80) || "Freelancer de Busquidy"}...
        </p>

        <div className="flex gap-1 items-center my-2">
          <StarIcon className="w-5 h-5 text-yellow-500" />
          <span className="font-bold text-gray-700">{parseFloat(freelancer.calificacion_promedio || 0).toFixed(1)}</span>
          <span className="text-sm text-gray-500">(calificación)</span>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {/* Reemplazamos <Chip> con <div> */}
          <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {freelancer.ciudad || "Remoto"}
          </div>
        </div>
      </div>
      
      {/* Reemplazamos <CardFooter> con <div> */}
      <div className="grid grid-cols-3 gap-2 px-6 pb-6">
        
        {/* Reemplazamos <Button> con <button> */}
        <button 
          type="button"
          className="text-sm font-medium text-blue-600 border border-blue-600 rounded-md px-3 py-1.5 hover:bg-blue-50 transition-colors"
          onClick={handleViewProfile}
        >
          Ver Perfil
        </button>
        
        <button 
          type="button"
          className="text-sm font-medium text-white bg-purple-600 rounded-md px-3 py-1.5 hover:bg-purple-700 transition-colors"
          onClick={handleContact}
        >
          Contactar
        </button>
        
        <button 
          type="button"
          className="text-sm font-medium text-white bg-blue-600 rounded-md px-3 py-1.5 hover:bg-blue-700 transition-colors"
          onClick={handleInvite}
        >
          Invitar
        </button>
      </div>
    </div>
  );
};

export default RecommendedFreelancerCard;