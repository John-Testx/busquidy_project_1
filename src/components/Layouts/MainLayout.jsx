// MainLayout.jsx - Versión actualizada
import React from 'react';
import { Navbar, Footer } from '@/components/Home';

const MainLayout = ({ children, fullHeight = false, noPadding = false }) => {
  return (
    <div className={`flex flex-col ${fullHeight ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Navbar />
      <main className={`flex-grow ${!noPadding ? 'pt-20' : ''} ${fullHeight ? 'overflow-hidden' : ''}`}>
        {children}
      </main>
      {!fullHeight && <Footer />}
    </div>
  );
};

export default MainLayout;