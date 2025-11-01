import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarFreelancer from '@/components/FreeLancer/SidebarFreelancer';
import Navbar from '@/components/Home/Navbar';

function FreelancerProfileLayout () {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <div className="flex pt-20">
        <SidebarFreelancer />
        
        {/* Main Content Area - SIN padding ni max-width */}
        <main className="flex-1 ml-0 lg:ml-72 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FreelancerProfileLayout;