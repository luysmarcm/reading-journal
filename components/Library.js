
import Link from "next/link";
import { getEntries } from "@/lib/api";
import { Search, SlidersHorizontal, MoreHorizontal } from "lucide-react";

export default async function LibraryComponent() {
  const books = await getEntries();

  return (
    <div className="min-h-screen bg-[#fffcf9] p-8 font-sans text-stone-700">
      <div className="max-w-6xl mx-auto">
        
        {/* Header con Buscador */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-2xl font-serif flex items-center gap-2">
              Library <span role="img" aria-label="books">📚</span>
            </h1>
            <p className="text-stone-400 text-sm italic">All your books in one cozy place.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search books..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-stone-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-stone-200 transition-all shadow-sm"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-stone-200 border border-stone-100 flex-shrink-0" />
          </div>
        </header>

        {/* Tabs de Filtro Falsos (Estéticos) */}
        <div className="flex justify-between items-center mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 whitespace-nowrap">
            <button className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-pink-100 text-pink-700">All Books ({books.length})</button>
            <button className="px-4 py-1.5 rounded-full text-[11px] font-medium text-stone-400 border border-transparent hover:bg-stone-50">Reading</button>
            <button className="px-4 py-1.5 rounded-full text-[11px] font-medium text-stone-400 border border-transparent hover:bg-stone-50">Completed</button>
          </div>
          <button className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-100 rounded-md text-[11px] font-medium text-stone-600 shadow-sm">
            <SlidersHorizontal className="w-3 h-3" />
            Sort: Recently Added
          </button>
        </div>

        {/* Grid de Libros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map((b) => (
            <Link key={b.id} href={`/entry/${b.id}`} className="group">
              {/* BLOQUE IZQUIERDO: Portada e Info Básica */}
<div className="w-full md:w-[420px] flex-shrink-0 space-y-5">
  
  {/* Contenedor Flex para Foto + Texto al lado */}
  <div className="flex items-start gap-6">
    
    {/* Portada con rotación estilo Scrapbook */}
    <div className="w-32 md:w-36 flex-shrink-0">
      <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-xl border-4 border-white rotate-[-1.5deg] bg-stone-100">
        <SafeImage 
          src={entry.display_cover} 
          alt={entry.display_title} 
          className="w-full h-full object-cover" 
        />
      </div>
    </div>

    {/* Texto al lado de la foto (Título, Autor, Progreso) */}
    <div className="flex-1 pt-2 space-y-1.5">
      <h2 className="font-serif text-[18px] leading-tight text-stone-800 line-clamp-2">
        {entry.display_title}
      </h2>
      <p className="text-stone-400 text-xs italic">
        by {entry.display_author}
      </p>

      {/* BARRA DE PROGRESO (Solo si está en estado 'Reading') */}
      {entry.display_status === "Reading" && (
        <div className="pt-3 pb-2 space-y-1.5">
          <div className="flex justify-between text-[10px] text-stone-400 font-sans font-bold">
            <span>{entry.porcentaje || 0}%</span>
            <span>{entry.paginas_leidas || 0} / {entry.pages || 0} p</span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-pink-200 transition-all duration-700 ease-in-out"
              style={{ width: `${entry.porcentaje || 0}%` }}
            />
          </div>
        </div>
      )}

      <div className="pt-1">
        {renderRating(entry.rating)}
      </div>
    </div>
  </div>
  
  {/* Tags Dinámicos debajo de la foto */}
  <div className="flex flex-col gap-2.5 pt-5 border-t border-stone-100/60">
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase bg-[#f5f0eb]/70 text-[#7c6a5a] w-fit">
      <Smile size={12} className="opacity-60" /> {entry.moods?.split(',')[0] || 'Reflective'}
    </span>
    
    {/* Status dinámico con colores del mockup */}
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase w-fit ${
      entry.display_status === "Finished" 
        ? "bg-[#e1f0e9] text-[#2c7553]" 
        : entry.display_status === "Reading"
        ? "bg-[#fdf4ff] text-[#a21caf]"
        : "bg-stone-100 text-stone-500"
    }`}>
      <CheckCircle size={12} className="opacity-70" /> {entry.display_status}
    </span>
  </div>
</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}