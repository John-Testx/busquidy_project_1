import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarFreelancer from '@/components/FreeLancer/SidebarFreelancer';
import Navbar from '@/components/Home/Navbar';
import { checkProfileExists } from "@/api/freelancerApi";
import { useAuth } from "@/hooks";

function FreelancerProfileLayout() {
  const { id_usuario, isAuthenticated } = useAuth();
  const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);

  useEffect(() => {
    const fetchProfileStatus = async () => {
      if (isAuthenticated && id_usuario) {
        try {
          const response = await checkProfileExists(id_usuario);
          setIsPerfilIncompleto(response.isPerfilIncompleto);
        } catch (err) {
          console.error("Error verificando perfil:", err);
        }
      }
    };
    
    fetchProfileStatus();
  }, [id_usuario, isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <div className="flex pt-20">
        <SidebarFreelancer isPerfilIncompleto={isPerfilIncompleto} />
        
        {/* Main Content Area */}
        <main className="flex-1 ml-0 lg:ml-72 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default FreelancerProfileLayout;