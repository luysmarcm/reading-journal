// app/journal/page.js
import React from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  CalendarDays, 
  PencilLine, 
  Share2, 
  Star, 
  Smile,
  CheckCircle,
  Quote,
  LayoutGrid
} from 'lucide-react';

// --- FUNCIÓN DE API (SSR) ---
// Traemos todas las entradas de la pestaña 'Entries'
async function getAllEntries() {
  const API_URL = 'https://sheetdb.io/api/v1/dszn7xxutj5w7';
  try {
    const res = await fetch(`${API_URL}?sheet=Entries&timestamp=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Error al conectar con SheetDB');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return []; // Retorna array vacío en caso de error
  }
}

// --- COMPONENTE DE LA PÁGINA ---
export default async function JournalDashboardPage() {
  const allEntries = await getAllEntries();

  // Función interna para renderizar estrellas según el rating
  const renderRating = (rating) => {
    const r = parseInt(rating) || 0;
    return (
      <div className="flex gap-1 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            fill={i < r ? "currentColor" : "none"} 
            className={i < r ? "" : "text-stone-200"} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fffcf9] p-6 md:p-10 font-sans text-stone-700">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* --- HEADER SUPERIOR CON BUSCADOR --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif text-stone-800 tracking-tight flex items-center gap-3">
              <LayoutGrid size={28} className="text-stone-300" /> Reading Diary
            </h1>
            <p className="text-stone-400 text-sm max-w-lg">
              A collection of your thoughts, quotes, and reading memories from all your books.
            </p>
          </div>
          <div className="relative flex-1 md:w-80 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5 group-hover:text-stone-400" />
            <input 
              type="text" 
              placeholder="Search your entries..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-pink-100 transition shadow-inner"
            />
          </div>
        </header>

        {/* --- BARRA DE FILTROS Y CLASIFICACIÓN --- */}
        <section className="flex justify-between items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-100 shadow-sm">
          <div className="flex gap-2 whitespace-nowrap overflow-x-auto pb-1">
            <button className="px-5 py-2 rounded-full text-[11px] font-bold bg-pink-100 text-pink-700 shadow-sm">All Entries</button>
            <button className="px-5 py-2 rounded-full text-[11px] font-medium text-stone-500 hover:bg-white transition">Reviews</button>
            <button className="px-5 py-2 rounded-full text-[11px] font-medium text-stone-500 hover:bg-white transition">Quotes</button>
            <button className="px-5 py-2 rounded-full text-[11px] font-medium text-stone-500 hover:bg-white transition">Reading Notes</button>
          </div>
          <button className="flex items-center gap-2.5 px-4 py-2 bg-white border border-stone-100 rounded-md text-xs font-medium text-stone-600 shadow-sm hover:border-pink-100 transition">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-300" />
            Filter & Sort
          </button>
        </section>

        {/* --- LISTA DINÁMICA DE ENTRADAS DEL DIARIO --- */}
        <main className="space-y-8 animate-in fade-in duration-700">
          {allEntries.length > 0 ? allEntries.map((entry, idx) => (
            
            // --- CARD DE ENTRADA ÚNICA (Según Imagen 1) ---
            <div key={idx} className="bg-white rounded-3xl p-8 shadow-[0_6px_30px_rgba(0,0,0,0.015)] border border-stone-100">
              
              {/* Header de la Card (Fecha e Iconos) */}
              <div className="flex justify-between items-center mb-10 pb-4 border-b border-stone-50">
                <div className="flex items-center gap-3 text-sm text-stone-400 font-medium">
                  <CalendarDays size={18} className="text-stone-300" />
                  <span>{entry.date_string || 'Added recently'}</span>
                </div>
                <div className="flex gap-2 text-stone-300">
                  <button className="p-2 hover:bg-stone-50 rounded-full hover:text-stone-500"><PencilLine size={17} /></button>
                  <button className="p-2 hover:bg-stone-50 rounded-full hover:text-stone-500"><Share2 size={17} /></button>
                </div>
              </div>

              {/* Contenido Principal de la Card */}
              <div className="flex flex-col md:flex-row gap-12">
                
                {/* Bloque Izquierdo: Info del Libro */}
                <div className="w-full md:w-64 flex-shrink-0 space-y-5">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-xl border-4 border-white rotate-[-1deg] group">
                    <img 
                      src={entry.cover_url || "https://via.placeholder.com/300x400"} 
                      alt={entry.title} 
                      className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition duration-500"
                    />
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <h2 className="font-serif text-[18px] leading-snug text-stone-800 line-clamp-2">{entry.title}</h2>
                    <p className="text-stone-400 text-xs italic">by {entry.author}</p>
                    <div className="pt-2">{renderRating(entry.rating)}</div>
                  </div>
                  
                  {/* Tags Decorativos */}
                  <div className="flex flex-col gap-2.5 pt-4 border-t border-stone-50">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase bg-stone-100/70 text-stone-500 w-fit">
                      <Smile size={12} className="opacity-50" /> {entry.mood_tag || 'Reflective'}
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase bg-emerald-50 text-emerald-700 w-fit">
                      <CheckCircle size={12} className="opacity-70" /> {entry.status_tag || 'Finished'}
                    </span>
                  </div>
                </div>

                {/* Bloque Derecho: Pensamientos y Cita */}
                <div className="flex-1 space-y-10">
                  <div className="space-y-5">
                    <h3 className="text-2xl font-serif text-stone-800">{entry.entry_title || 'Entry Title'}</h3>
                    <p className="text-stone-600 leading-loose text-sm whitespace-pre-line font-sans">
                      {entry.thoughts}
                    </p>
                  </div>

                  {/* Bloque de Cita Estilizado */}
                  {entry.quote_text && (
                    <div className="bg-gradient-to-br from-pink-50/50 to-pink-100/20 p-8 rounded-2xl relative border border-pink-100/30 overflow-hidden shadow-inner">
                      <Quote size={60} className="absolute -top-3 -right-3 text-pink-100 opacity-60" fill="currentColor" />
                      <p className="italic text-stone-700 text-sm leading-relaxed whitespace-pre-line relative z-10 font-sans">
                        “{entry.quote_text}”
                      </p>
                      <div className="absolute left-0 top-0 h-full w-1.5 bg-pink-100 shadow-sm" />
                    </div>
                  )}
                </div>

              </div>
            </div>
          )) : (
            <div className="p-20 text-center text-stone-300 font-sans bg-white rounded-3xl border border-stone-100">
               No entries recorded yet. Click 'Add Entry' to start journaling.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}