import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarFreelancer from '../../components/FreeLancer/SidebarFreelancer';
import { Footer, Navbar } from '@/components/Home/';

// Este componente ahora actúa como la plantilla para todas las páginas del panel de freelancer
function FreelancerProfileLayout () {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex pt-20">
        <SidebarFreelancer />
        {/* El 'ml-64' es clave: deja espacio para la barra lateral fija de 256px (w-64) */}
        <main className="flex-1 ml-64 p-4 sm:p-6 md:p-8">
          {/* Outlet renderizará el componente de la ruta hija (Panel, Perfil, Disponibilidad, etc.) */}
          <Outlet />
        </main>
      </div>
      {/* Puedes decidir si quieres el footer en estas páginas internas */}
      {/* <Footer /> */}
    </div>
  );
};

export default FreelancerProfileLayout;