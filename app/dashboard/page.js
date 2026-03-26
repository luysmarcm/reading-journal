import SafeImage from "@/components/SafeImage";
import SectionHeader from "@/components/SectionHeader";
import StatCard from "@/components/StatCard";
import { getBooksData, getJournalData } from "@/lib/api";
import { Book, CheckCircle, FileText, Stars } from "lucide-react";

export default async function Dashboard() {
  const books = await getBooksData();

 const { entries } = await getJournalData();

// 1. Primero generamos el conteo de géneros (Necesario para los cálculos siguientes)
const genreCounts = books.reduce((acc, b) => {
  const g = b.gener || 'Uncategorized';
  acc[g] = (acc[g] || 0) + 1;
  return acc;
}, {});

// 2. Ahora sí definimos las estadísticas generales
const totalBooks = books.length;
const completedBooks = books.filter(b => b.status === 'Finished' || b.status === 'Completed').length;
const totalPagesRead = books.reduce((acc, b) => acc + (parseInt(b.paginas_leidas) || 0), 0);
const avgRating = totalBooks > 0 
  ? (books.reduce((acc, b) => acc + (parseFloat(b.rating) || 0), 0) / totalBooks).toFixed(1) 
  : "0.0";

// 3. Filtramos los libros actuales y las entradas recientes
const currentBooks = books.filter(b => b.status === 'Currently Reading');
const recentEntries = entries.slice(0, 3); // Las 3 más recientes

// 4. Preparamos los géneros para el Insight (Ordenados de mayor a menor)
const genreStats = Object.entries(genreCounts).map(([name, count]) => ({
  name,
  count,
  percentage: Math.round((count / totalBooks) * 100)
})).sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 bg-[#fffcf9]">
      
      {/* SECCIÓN 1: WIDGETS DE ESTADÍSTICAS (Parte superior imagen 4) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Book} label="Total Books" value={totalBooks} color="stone" />
        <StatCard icon={CheckCircle} label="Completed" value={completedBooks} color="emerald" />
        <StatCard icon={FileText} label="Pages Read" value={totalPagesRead.toLocaleString()} color="stone" />
        <StatCard icon={Stars} label="Avg Rating" value={avgRating} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SECCIÓN 2: CURRENTLY READING (Lado izquierdo, grande) */}
       <div className="lg:col-span-2 space-y-6">
        <SectionHeader title="Currently Reading" emoji="☕" />
        
        {/* Mapeamos currentBooks para que salgan todos */}
        <div className="grid grid-cols-1 gap-6">
          {currentBooks.length > 0 ? (
            currentBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                <div className="w-32 flex-shrink-0 shadow-xl rounded-lg overflow-hidden rotate-[-1.5deg] border-4 border-white">
                  <SafeImage src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-serif text-stone-800 leading-tight">{book.title}</h2>
                      <p className="text-stone-400 text-sm italic">by {book.author}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-[9px] font-bold rounded-full uppercase border border-orange-100">
                      Reading
                    </span>
                  </div>
                  
                  {/* Barra de progreso con la variable percentage del Excel */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[10px] font-bold text-stone-400 uppercase">
                      <span>{book.percentage}%</span>
                      <span>{book.paginas_leidas} / {book.pages} p</span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-pink-200 transition-all duration-1000" 
                        style={{ width: `${book.percentage}%` }} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button className="px-4 py-2 bg-[#d4b9b9] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#c5a8a8] transition-colors">
                      Update
                    </button>
                    <button className="px-4 py-2 border border-stone-100 text-stone-400 rounded-xl text-xs font-bold hover:bg-stone-50 transition-colors">
                      Notes
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-stone-300 italic p-8 bg-white rounded-3xl border border-dashed text-center">
              No hay lecturas activas.
            </p>
          )}
        </div>
      </div>

        {/* SECCIÓN 3: INSIGHTS (Lado derecho) */}
        <div className="space-y-6">
          <SectionHeader title="Insights" emoji="✨" />
          <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-6">
            <h3 className="font-serif text-lg text-stone-700">Reading by Genre</h3>
            <div className="space-y-4">
              {Object.entries(genreCounts).map(([genre, count]) => (
                <div key={genre} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-stone-500">
                    <span>{genre}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-stone-200" 
                      style={{ width: `${(count / totalBooks) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
  
  {/* COLUMNA IZQUIERDA: Reading Diary (image_5c4540) */}
  <div className="lg:col-span-2 space-y-6">
    <SectionHeader title="Reading Diary" emoji="✨" />
    <div className="space-y-8">
      {recentEntries.map((entry, idx) => (
        <div key={idx} className="relative pl-6 border-l border-stone-100 space-y-2 group">
          {/* Puntito decorativo de la línea de tiempo */}
          <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-stone-200 group-hover:bg-pink-200 transition-colors" />
          
          <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">
            Entry | {entry.date}
          </p>
          
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-serif text-stone-800">{entry.book_title}</h3>
            <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-md uppercase">
              {entry.mood || 'Calm'}
            </span>
          </div>
          
          <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 font-sans">
            {entry.thoughts}
          </p>
          
          <div className="flex items-center gap-4 text-[11px] font-medium text-stone-400 italic">
            <span>Pages read: {entry.pages_read || 'N/A'}</span>
            {entry.status === 'Finished' && <span className="text-emerald-500 flex items-center gap-1">✓ Finished book</span>}
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* COLUMNA DERECHA: Insights (image_5c4582) */}
  <div className="space-y-6">
    <SectionHeader title="Insights" emoji="✨" />
    <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-sm space-y-8">
      <div>
        <h4 className="font-serif text-stone-800 text-lg mb-1">Reading by Genre</h4>
        <p className="text-stone-400 text-xs mb-6 font-sans">Your most explored categories.</p>
        
        <div className="space-y-6">
          {genreStats.map((genre) => (
            <div key={genre.name} className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-stone-700">{genre.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-stone-400">{genre.percentage}%</span>
                  <span className="text-[11px] font-bold text-stone-300">{genre.count}</span>
                </div>
              </div>
              {/* Barra de progreso de género */}
              <div className="h-1.5 w-full bg-stone-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#d4b9b9] opacity-60 rounded-full transition-all duration-1000"
                  style={{ width: `${genre.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón opcional al final del Insight */}
      <button className="w-full py-3 border border-stone-100 rounded-2xl text-[11px] font-bold text-stone-400 uppercase tracking-widest hover:bg-stone-50 transition-colors">
        View Full Analytics
      </button>
    </div>
  </div>
</div>
      </div>
    </div>
  );
}