import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = ({ message = "Cargando..." }) => {
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
      {/* Spinner con efecto de anillos */}
      <div className="relative">
        {/* Anillo exterior */}
        <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-[#07767c]/20 animate-ping"></div>
        
        {/* Anillo medio */}
        <div className="absolute inset-2 w-20 h-20 rounded-full border-4 border-[#40E0D0]/30 animate-spin" style={{ animationDuration: '3s' }}></div>
        
        {/* Círculo principal */}
        <div className="relative w-24 h-24 rounded-full border-4 border-gray-200 border-t-[#07767c] animate-spin flex items-center justify-center">
          <Loader2 className="text-[#07767c] animate-spin" size={32} style={{ animationDirection: 'reverse' }} />
        </div>
      </div>

      {/* Texto */}
      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {message}
        </h2>
        <div className="flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-[#07767c] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-[#07767c] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-[#07767c] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mt-6 w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#07767c] via-[#40E0D0] to-[#07767c] rounded-full"
          style={{
            animation: 'shimmer 2s ease-in-out infinite',
            backgroundSize: '200% 100%'
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;