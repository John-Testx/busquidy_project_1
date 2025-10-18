import React from 'react';
import Navbar from '../Home/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      {/* ✅ Agregamos pt-20 lg:pt-24 para compensar la altura del Navbar */}
      <main className="flex-1 overflow-y-auto pt-20 lg:pt-24">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;