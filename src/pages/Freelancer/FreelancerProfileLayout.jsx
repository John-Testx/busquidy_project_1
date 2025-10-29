import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarFreelancer from '@/components/FreeLancer/SidebarFreelancer';
import { Footer, Navbar } from '@/components/Home/';

function FreelancerProfileLayout () {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      <div className="flex pt-20">
        <SidebarFreelancer />
        
        {/* Main Content Area */}
        <main className="flex-1 ml-0 lg:ml-72 transition-all duration-300">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FreelancerProfileLayout;