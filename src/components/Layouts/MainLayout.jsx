// MainLayout.jsx - Versión actualizada
import React from 'react';
import { Navbar, Footer } from '@/components/Home';
import { useAuth } from '@/hooks';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const MainLayout = ({ children, fullHeight = false, noPadding = false }) => {
  const { user } = useAuth();

// Determinar si mostrar banner de verificación
const showVerificationBanner = user && user.estado_verificacion !== 'verificado';
  return (
    <div className={`flex flex-col ${fullHeight ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Navbar />
        {showVerificationBanner && (
          <div className={`w-full ${
            user.estado_verificacion === 'no_verificado' ? 'bg-yellow-500' :
            user.estado_verificacion === 'en_revision' ? 'bg-blue-500' :
            user.estado_verificacion === 'rechazado' ? 'bg-red-500' : 'bg-gray-500'
          } text-white py-3 px-4 flex items-center justify-between shadow-md`}>
            <div className="flex items-center gap-3">
              {user.estado_verificacion === 'no_verificado' && <AlertCircle size={20} />}
              {user.estado_verificacion === 'en_revision' && <Clock size={20} />}
              {user.estado_verificacion === 'rechazado' && <AlertCircle size={20} />}
              
              <span className="font-medium">
                {user.estado_verificacion === 'no_verificado' && 'Debes verificar tu cuenta para usar todas las funciones.'}
                {user.estado_verificacion === 'en_revision' && 'Tu cuenta está en revisión. Te notificaremos cuando sea aprobada.'}
                {user.estado_verificacion === 'rechazado' && 'Tus documentos fueron rechazados. Revisa los comentarios y vuelve a subirlos.'}
              </span>
            </div>
            
            <Link 
              to="/verificar-documentos"
              className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {user.estado_verificacion === 'no_verificado' && 'Verificar Ahora'}
              {user.estado_verificacion === 'en_revision' && 'Ver Estado'}
              {user.estado_verificacion === 'rechazado' && 'Subir Documentos'}
            </Link>
          </div>
        )}
      <main className={`flex-grow ${!noPadding ? 'pt-20' : ''} ${fullHeight ? 'overflow-hidden' : ''}`}>
        {children}
      </main>
      {!fullHeight && <Footer />}
    </div>
  );
};

export default MainLayout;