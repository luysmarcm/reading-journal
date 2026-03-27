import { LayoutGrid } from "lucide-react";

const PageHeader = ({ 
  title = "Reading Diary", 
  subtitle = "Una colección de tus pensamientos y memorias de lectura.", 
  icon: Icon = LayoutGrid 
}) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-serif text-stone-800 tracking-tight flex items-center gap-3">
          {/* El componente Icon se renderiza aquí */}
          <Icon size={28} className="text-stone-300 flex-shrink-0" /> 
          {title}
        </h1>
        <p className="text-stone-400 text-sm font-sans italic">
          {subtitle}
        </p>
      </div>
      
      {/* Espacio opcional para acciones (como el botón de "Nuevo" o "Filtros") */}
      <div className="flex items-center gap-3">
        {/* Aquí podrías pasar {children} si quisieras agregar botones a la derecha */}
      </div>
    </header>
  );
};

export default PageHeader;