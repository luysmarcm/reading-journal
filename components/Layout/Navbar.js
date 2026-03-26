import React from 'react';
import { Search } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-40 w-full px-6 py-4 bg-[#FDF5F0]/80 backdrop-blur-sm border-b border-gray-100">
      <div className="flex items-center justify-between gap-6 px-4 py-2 bg-white rounded-2xl shadow-[0_1px_6px_0_rgba(0,0,0,0.02)]">
        
        {/* Lado Izquierdo: Saludo */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#4A3F3F]">Hello, Luysmar</h1>
            <span className="text-xl text-[#F2B07E]" role="img" aria-label="sparkle">✨</span>
          </div>
          <p className="text-sm text-gray-400 mt-0.5 font-light">
            Welcome to your aesthetic reading space.
          </p>
        </div>

        {/* Centro: Barra de Búsqueda */}
        {/* <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
            <Search size={18} strokeWidth={1.5} />
          </div>
          <input
            type="search"
            placeholder="Search books, authors..."
            className="w-full h-11 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-full text-sm text-[#4A3F3F] placeholder:text-gray-400 placeholder:font-light focus:ring-1 focus:ring-[#F5D5D9] focus:border-[#F5D5D9] transition"
          />
        </div> */}

        {/* Lado Derecho: Avatar */}
        {/* <div className="flex items-center">
          <button className="flex items-center justify-center size-10 rounded-full border border-gray-100 overflow-hidden group">
            <img 
              src="/path/to/avatar.jpg" // Cambia esto por la ruta real de tu imagen
              alt="Clara's Avatar" 
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        </div> */}

      </div>
    </nav>
  );
};

export default Navbar;