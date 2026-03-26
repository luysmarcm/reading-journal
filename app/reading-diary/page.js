// app/journal/page.js
import React from 'react';
import { 
  CalendarDays, PencilLine, Share2, Star, Smile, CheckCircle, Quote, LayoutGrid 
} from 'lucide-react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage'; 

// --- FUNCIÓN PARA FORMATEAR LA FECHA ---
const formatDate = (dateString) => {
  if (!dateString) return 'Añadido recientemente';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      month: 'long', day: 'numeric', year: 'numeric',
    }).format(date);
  } catch (e) { return dateString; }
};

// --- FUNCIÓN PARA OBTENER Y CRUZAR DATOS DE SHEETDB ---
async function getJournalData() {
  const API_URL = 'https://sheetdb.io/api/v1/dszn7xxutj5w7';
  try {
    // Pedimos ambas pestañas en paralelo para cruzar la información
    const [booksRes, entriesRes] = await Promise.all([
      fetch(`${API_URL}?sheet=Books`, { cache: 'no-store' }),
      fetch(`${API_URL}?sheet=Entries`, { cache: 'no-store' })
    ]);

    const books = await booksRes.json();
    const entries = await entriesRes.json();

    // Cruzamos la información de las dos hojas
    return entries.map(entry => {
      // Buscamos los detalles del libro usando el book_id de la entrada
      const bookInfo = books.find(b => b.id === entry.book_id);
      
      return {
        ...entry,
        // Datos de identificación y visualización
        display_title: bookInfo?.title || entry.title || "Sin título",
        display_author: bookInfo?.author || entry.author || "Autor desconocido",
        display_status: bookInfo?.status || "Sin estado",
        display_cover: bookInfo?.cover || entry.cover,
        linked_book_id: bookInfo?.id || entry.book_id,

        // --- NUEVOS DATOS AGREGADOS ---
        // Calificación (Rating)
        rating: bookInfo?.rating || entry.rating || 0,
        
        // Fechas de lectura
        date_start: bookInfo?.date_start || entry.date_start,
        date_fin: bookInfo?.date_fin || entry.date_fin,
        
        // Metadatos del libro
        format: bookInfo?.format || "Desconocido", // e.g., Digital, Físico
        genre: bookInfo?.gener || bookInfo?.genre || "Sin género" // Mapeo de 'gener' del Excel
      };
    });
  } catch (error) {
    console.error("Error cargando datos:", error);
    return [];
  }
}

export default async function JournalDashboardPage() {
  const allEntries = await getJournalData();

const renderRating = (rating) => {
    // Usamos el operador ?? (nullish coalescing) para que si es 0, se quede en 0.
    // Solo si es null o undefined usará el 0 (o el número que prefieras por defecto).
    const r = rating !== undefined && rating !== null ? parseInt(rating) : 0; 
    
    return (
      <div className="flex gap-1 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            // Si r es 0, i < r siempre será falso y ninguna estrella se rellenará
            fill={i < r ? "currentColor" : "none"} 
            className={i < r ? "" : "text-stone-200"} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fffcf9] p-6 md:p-10 font-sans text-stone-700">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif text-stone-800 tracking-tight flex items-center gap-3">
              <LayoutGrid size={28} className="text-stone-300" /> Reading Diary
            </h1>
            <p className="text-stone-400 text-sm">
              Una colección de tus pensamientos y memorias de lectura.
            </p>
          </div>
        </header>

        <main className="space-y-10 pb-16">
          {allEntries.length > 0 ? allEntries.map((entry, idx) => (
            
            <div key={idx} className="bg-white rounded-[32px] p-10 shadow-[0_8px_40px_rgba(0,0,0,0.012)] border border-stone-100">
              
              {/* Header de la tarjeta (Fecha y Acciones) */}
              <div className="flex justify-between items-center mb-10 pb-5 border-b border-stone-100/60">
                <div className="flex items-center gap-3 text-sm text-stone-400 font-medium uppercase tracking-wider">
                  <CalendarDays size={18} className="text-stone-300" />
                  <span>{formatDate(entry.date_end || entry.date_start)}</span>
                </div>
                <div className="flex gap-2.5 text-stone-300">
                  <Link href={`/entry/${entry.linked_book_id}`} className="p-2 hover:bg-stone-50 rounded-full hover:text-pink-500 transition-colors">
                    <PencilLine size={18} />
                  </Link>
                  <button className="p-2 hover:bg-stone-50 rounded-full hover:text-stone-500 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-row md:flex-row gap-12">
                
            {/* BLOQUE IZQUIERDO: Portada e Info Básica */}
                <div className="w-full md:w-[420px] flex-shrink-0 space-y-5">
                  
                  {/* Contenedor Flex para Foto + Texto al lado */}
                  <div className="flex items-start gap-6">
                    
                    {/* Portada con rotación */}
                    <div className="w-32 md:w-36 flex-shrink-0">
                      <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-xl border-4 border-white rotate-[-1.5deg] bg-stone-100">
                        <SafeImage 
                          src={entry.display_cover} 
                          alt={entry.display_title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </div>

                    {/* Texto al lado de la foto (Título, Autor, Rating) */}
                    <div className="flex-1 pt-2 space-y-1.5">
                      <h2 className="font-serif text-[19px] leading-tight text-stone-800 line-clamp-3">
                        {entry.display_title}
                      </h2>
                      <p className="text-stone-400 text-xs italic">
                        by {entry.display_author}
                      </p>
                      <div className="pt-2">
                        {renderRating(entry.rating)}
                      </div>
                       <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase bg-[#f5f0eb]/70 text-[#7c6a5a] w-fit">
                      <Smile size={12} className="opacity-60" /> {entry.moods?.split(',')[0] || 'Reflexivo'}
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase bg-[#e1f0e9] text-[#2c7553] w-fit">
                      <CheckCircle size={12} className="opacity-70" /> {entry.display_status}
                    </span>
                    </div>
                  </div>
                  
                  {/* Tags Debajo de la foto y el texto */}
                  <div className="flex flex-col gap-2.5 pt-5 border-t border-stone-100/60">
                   
                  </div>
                </div>

                {/* BLOQUE DERECHO: Reflexiones y Citas (Viene de 'Entries') */}
                <div className="flex-1 space-y-10">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-serif text-stone-800 tracking-tight">Reflections</h3>
                    <p className="text-stone-600 leading-[1.95] text-[15px] whitespace-pre-line font-sans italic opacity-90">
                      {entry.thoughts || "Aún no hay reflexiones para este libro."}
                    </p>
                  </div>

                  {/* Cita con borde rosa y fondo crema */}
                  {entry.quotes && entry.quotes !== "" && entry.quotes.startsWith('[') && (
                    <div className="bg-[#f9f5f2] p-8 rounded-2xl relative border border-[#f0e7df] shadow-inner">
                      <Quote size={50} className="absolute -top-1 -right-1 text-stone-200 opacity-30" fill="currentColor" />
                      <p className="italic text-stone-700 text-sm leading-relaxed relative z-10 font-sans">
                        “{JSON.parse(entry.quotes)[0]?.text}”
                      </p>
                      <div className="absolute left-0 top-0 h-full w-1.5 bg-[#f5c6c6]" />
                    </div>
                  )}
                </div>

              </div>
            </div>
          )) : (
            <div className="p-20 text-center text-stone-300 font-sans bg-white rounded-3xl border border-stone-100 border-dashed">
               No se encontraron entradas en el diario.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}