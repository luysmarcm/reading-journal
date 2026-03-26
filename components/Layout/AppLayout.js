import React from 'react';
import Sidebar from './Sidebar'; // Importa el componente Sidebar que creamos anteriormente
import Navbar from './Navbar';

const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#FDF5F0] overflow-hidden font-serif">
      {/* Sidebar - Fijo a la izquierda */}
      <Sidebar />

      {/* Área Principal (Navbar + Contenido) */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Navbar */}
        <Navbar />

        {/* Contenido de la Página */}
        <main className="flex-1 px-8 py-10 bg-[#FFFAF7]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;