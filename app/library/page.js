import Link from "next/link";
import { Search, SlidersHorizontal, Smile, CheckCircle, Star, MoreHorizontal } from "lucide-react";
import SafeImage from "@/components/SafeImage";

// --- API FETCHING ---
async function getBooksData() {
  const API_URL = 'https://sheetdb.io/api/v1/dszn7xxutj5w7';
  try {
    const res = await fetch(`${API_URL}?sheet=Books`, { cache: 'no-store' });
    return await res.json();
  } catch (error) {
    console.error("Error cargando biblioteca:", error);
    return [];
  }
}

export default async function Home() {
  const books = await getBooksData();

  // Función para renderizar estrellas
  const renderRating = (rating) => {
    const r = rating !== undefined && rating !== null ? parseInt(rating) : 0;
    return (
      <div className="flex gap-0.5 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={12} 
            fill={i < r ? "currentColor" : "none"} 
            className={i < r ? "" : "text-stone-200"} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen  p-8 font-sans text-stone-700 ">
      <div className="max-w-6xl mx-auto">
        
        {/* Header con Buscador */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-2xl font-serif flex items-center gap-2 text-stone-800">
              Library <span role="img" aria-label="books">📚</span>
            </h1>
            <p className="text-stone-400 text-sm italic font-sans">All your books in one cozy place.</p>
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
            <div className="w-8 h-8 rounded-full bg-stone-200 border border-stone-100 flex-shrink-0 overflow-hidden">
               {/* Aquí podrías poner un avatar si quisieras */}
            </div>
          </div>
        </header>

        {/* Filtros Estéticos */} 
        <div className="flex justify-between items-center mb-12 overflow-x-auto pb-2">
          <div className="flex gap-2 whitespace-nowrap">
            <button className="px-5 py-2 rounded-full text-[11px] font-bold bg-[#f5e6e8] text-[#a65d67] shadow-sm">All Books ({books.length})</button>
            <button className="px-5 py-2 rounded-full text-[11px] font-medium text-stone-400 hover:bg-white hover:shadow-sm transition-all">Reading</button>
            <button className="px-5 py-2 rounded-full text-[11px] font-medium text-stone-400 hover:bg-white hover:shadow-sm transition-all">Completed</button>
          </div>
          <button className="hidden md:flex items-center gap-2 px-3 py-2 bg-white border border-stone-100 rounded-xl text-[11px] font-medium text-stone-600 shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            Sort: Recently Added
          </button>
        </div>

        {/* Grid de Libros - Ajustado a 2 columnas para que el diseño horizontal respire */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
  {books.map((b) => {
    // 1. Mapeo de Campos Exactos desde tu Google Sheets (Pestaña 'Books')
    const bookStatus = b['status'] || "TBR"; // Usamos 'Currently Reading' como Status
    const bookPercentage = parseInt(b['percentage']) || 0; // Columna 'percentage' (valores como 65)
    
    // Fallbacks de seguridad para otros campos
    const totalPages = parseInt(b['pages']) || 0;
    const authorName = b['author'] || "Unknown";
    const bookTitle = b['title'] || "Untitled";

    return (
      <Link key={b.id} href={`/entry/${b.id}`} className="group">
        {/* DISEÑO VERTICAL DE TARJETA (Como Mockup) */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-stone-100/50 flex flex-col h-full transition-all hover:shadow-xl hover:translate-y-[-4px]">
          
          {/* Portada con Tag de Estado Flotante */}
          <div className="relative aspect-[3/4] mb-5 rounded-2xl overflow-hidden shadow-inner bg-stone-50">
            <SafeImage 
              src={b['cover']} // Columna 'cover'
              alt={bookTitle} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            
            {/* Badge Dinámico basado en 'Currently Reading' */}
            <div className="absolute top-3.5 left-3.5">
              <span className={`px-3 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${
                bookStatus === "Finished" || bookStatus === "Completed"
                  ? "bg-emerald-50/90 text-emerald-700 border border-emerald-100" 
                  : bookStatus === "Reading"
                  ? "bg-orange-50/90 text-orange-700 border border-orange-100"
                  : "bg-stone-100/90 text-stone-500 border border-stone-200"
              }`}>
                {bookStatus}
              </span>
            </div>
          </div>

          {/* Info Principal del Libro */}
          <div className="flex-1 space-y-1">
            <h2 className="font-serif text-[17px] leading-tight text-stone-800 line-clamp-2 group-hover:text-pink-900 transition-colors">
              {bookTitle}
            </h2>
            <p className="text-stone-400 text-[13px] font-sans">
              by {authorName}
            </p>
          </div>

          {/* SECCIÓN DE PROGRESO / RATING (Parte Inferior) */}
          <div className="mt-5 pt-5 border-t border-stone-100 space-y-3.5">
            
            {bookStatus === "Currently Reading" ? (
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-sans font-bold uppercase tracking-tighter text-stone-400">
                  {/* Usamos el valor percentage del Excel directamente */}
                  <span>{bookPercentage}%</span> 
                  <span className="text-stone-300 font-medium">Pages: {totalPages}</span>
                </div>
                {/* Barra Rosa Animada */}
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-pink-200 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${bookPercentage}%` }} // El porcentaje alimenta el ancho
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                {/* renderRating debe estar definido arriba */}
                {renderRating(b['rating'])} 
                <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest font-sans">
                  {b['gener']} {/* Columna 'gener' del Excel */}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-3 text-[10px] text-stone-300 font-medium font-sans">
              {/* CORRECCIÓN AQUÍ: Usamos bookStatus correctamente */}
              {/* <span>{bookStatus === "Plan to Read" ? "Currently Reading" : `Finished ${b['date_end'] || ''}`}</span> */}
              <MoreHorizontal size={14} className="text-stone-200" />
            </div>
          </div>
        </div>
      </Link>
    );
  })}
</div>
      </div>
    </div>
  );
}