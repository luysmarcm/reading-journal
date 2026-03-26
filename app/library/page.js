
import Link from "next/link";
import { getEntries } from "@/lib/api";
import { Search, SlidersHorizontal, MoreHorizontal } from "lucide-react";

export default async function Home() {
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
              <div className="bg-white rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-stone-100 h-full transition-all hover:shadow-md hover:-translate-y-1">
                
                {/* Portada / Cover Placeholder */}
                <div className="relative aspect-[3/4] rounded-lg mb-4 overflow-hidden bg-stone-50 border border-stone-50 flex flex-col items-center justify-center p-6 text-center group-hover:bg-stone-100 transition-colors">
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-bold px-2 py-0.5 rounded-full text-stone-500 tracking-wider shadow-sm uppercase">
                    {b.status || "TBR"}
                  </span>
                  
                  {/* Si tienes b.coverUrl úsalo aquí, si no, mostramos el título estilo minimal */}
                  {b.cover ? (
                    <img src={b.cover} alt={b.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-stone-300 font-serif text-[10px] uppercase tracking-[0.2em] leading-relaxed">
                      {b.title}
                    </div>
                  )}
                </div>

                {/* Info del libro */}
                <div className="space-y-1 mb-6">
                  <h2 className="font-serif text-[14px] leading-tight text-stone-800 line-clamp-2 group-hover:text-pink-800 transition-colors">
                    {b.title}
                  </h2>
                  <p className="text-stone-400 text-[11px] italic">{b.author}</p>
                </div>

                {/* Footer de la Card */}
                <div className="pt-3 border-t border-stone-50 flex justify-between items-center">
                  <span className="text-[10px] text-stone-300 font-medium">
                    {b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Added Recently'}
                  </span>
                  <MoreHorizontal className="w-3.5 h-3.5 text-stone-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}