"use client";
import React, { useState } from 'react';
import { 
  Heart, Plus, PencilLine, Trash2, Camera, Save, Sparkles, 
  Smile, Coffee, HeartCrack, ChevronLeft, Calendar, X
} from 'lucide-react';


const formatDate = (dateString) => {
  if (!dateString) return 'Añadido recientemente';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      month: 'long', day: 'numeric', year: 'numeric',
    }).format(date);
  } catch (e) { return dateString; }
};


const BookEntry = ({ initialData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estado inicial dinámico basado en las props
const [bookData, setBookData] = useState({
  // Datos principales del libro (Pestaña Books)
  id: initialData?.id || "",
  title: initialData?.title || "",
  author: initialData?.author || "",
  pages: initialData?.pages || "",
  status: initialData?.status || "Plan to Read",
  cover: initialData?.cover || "",
  rating: initialData?.rating !== undefined ? parseInt(initialData.rating) : 0,
  gener: initialData?.gener || "Fiction", // Coincide con tu columna 'gener'
  format: initialData?.format || "Physical",
  
  // Datos de la lectura/entrada (Pestaña Entries)
  startDate: initialData?.date_start || "", // Mapeado de date_start
  endDate: initialData?.date_end || "",     // Mapeado de date_end
  
  // Datos específicos de la reseña
  moods: initialData?.entry?.moods ? initialData.entry.moods.split(',') : [],
  thoughts: initialData?.entry?.thoughts || "",
  quotes: initialData?.entry?.quotes ? JSON.parse(initialData.entry.quotes) : [
    { text: "", page: "" }
  ]
});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({ ...prev, [name]: value }));
  };

  // Manejo de Citas (Arrays dinámicos)
  const handleQuoteChange = (index, field, value) => {
    const newQuotes = [...bookData.quotes];
    newQuotes[index][field] = value;
    setBookData(prev => ({ ...prev, quotes: newQuotes }));
  };

  const addQuote = () => {
    setBookData(prev => ({ 
      ...prev, 
      quotes: [...prev.quotes, { text: "", page: "" }] 
    }));
  };

  const removeQuote = (index) => {
    setBookData(prev => ({ 
      ...prev, 
      quotes: prev.quotes.filter((_, i) => i !== index) 
    }));
  };

  const toggleMood = (mood) => {
    if (!isEditing) return;
    setBookData(prev => ({
      ...prev,
      moods: prev.moods.includes(mood) 
        ? prev.moods.filter(m => m !== mood) 
        : [...prev.moods, mood]
    }));
  };

  const handleFinalSave = async () => {
    setLoading(true);
    // Aquí llamas a la función que conecta con SheetDB que definimos antes
    await onSave(bookData); 
    setLoading(false);
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto my-10 bg-[#fafafa] min-h-screen p-8 shadow-xl border border-gray-100 relative font-serif text-slate-800 rounded-sm">
      
      {/* Botones de Acción */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        {isEditing ? (
          <button 
            onClick={handleFinalSave}
            disabled={loading}
            className="flex items-center gap-2 bg-stone-800 text-white px-5 py-2 rounded-full text-xs font-sans hover:bg-stone-700 transition shadow-md disabled:opacity-50"
          >
            {loading ? "Saving..." : <><Save size={14} /> Finish Entry</>}
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-white text-stone-500 border border-stone-200 px-5 py-2 rounded-full text-xs font-sans hover:bg-stone-50 transition shadow-sm"
          >
            <PencilLine size={14} /> Edit Journal
          </button>
        )}
      </div>

      {/* Header Decorativo */}
      <div className="w-24 h-6 bg-pink-100/50 absolute -top-2 left-1/2 -translate-x-1/2 rotate-2 shadow-sm"></div>

          <header className="flex flex-col md:flex-row gap-12 mt-10 items-start">
      {/* Portada del Libro - Estilo Polaroids/Scrapbook */}
      <div className="w-52 h-76 bg-stone-100 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex-shrink-0 relative overflow-hidden group border-[6px] border-white rotate-[-1.5deg] transition-transform hover:rotate-0 duration-300">
        <img 
          src={initialData?.cover || "https://via.placeholder.com/150"} 
          className="w-full h-full object-cover" 
          alt="book cover"
        />
        {isEditing && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="text-white" size={32} />
          </div>
        )}
      </div>

      {/* Info Principal - Tipografía y Espaciados del Mockup */}
      <div className="flex-1 space-y-8 pt-2">
        <div className="space-y-2">
          {isEditing ? (
            <div className="space-y-3">
              <input 
                name="title"
                value={bookData.title}
                onChange={handleChange}
                placeholder="Book Title"
                className="text-4xl font-serif font-medium w-full bg-transparent border-b border-stone-200 py-1 focus:outline-none focus:border-stone-400 text-stone-800"
              />
              <input 
                name="author"
                value={bookData.author}
                onChange={handleChange}
                placeholder="Author"
                className="text-lg text-stone-500 italic w-full bg-transparent border-b border-stone-100 py-1 focus:outline-none font-sans"
              />
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-serif font-medium text-stone-800 leading-tight tracking-tight">
                {bookData.title}
              </h1>
              <p className="text-lg text-stone-500 italic font-sans">
                by {bookData.author}
              </p>
            </>
          )}
        </div>

        {/* Grid de Metadatos - Basado en image_59e8e2.png */}
        <div className="space-y-5 pt-6 border-t border-stone-100 font-sans max-w-md">
          {/* Formato */}
          <div className="flex items-center gap-8 text-sm">
            <span className="text-stone-400 w-24 uppercase tracking-widest text-[11px] font-semibold">Format</span>
            <span className="text-stone-600 font-medium">Physical Book (Hardcover)</span>
          </div>

          {/* Género - Estilo Pastilla (Pill) del mockup */}
          <div className="flex items-center gap-8 text-sm">
            <span className="text-stone-400 w-24 uppercase tracking-widest text-[11px] font-semibold">Genre</span>
            {isEditing ? (
              <input name="genre" value={bookData.genre} onChange={handleChange} className="border-b border-stone-200 focus:outline-none bg-transparent text-stone-600" />
            ) : (
              <span className="bg-[#f2ebe5] text-[#8c7e74] px-4 py-1.5 rounded-full text-xs font-medium">
                {bookData.genre || 'Contemporary Fiction'}
              </span>
            )}
          </div>

          {/* Fechas de Lectura - Estilo Input del mockup */}
          <div className="flex items-center gap-8 text-sm">
            <span className="text-stone-400 w-24 uppercase tracking-widest text-[11px] font-semibold">Reading Dates</span>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex gap-2 items-center">
                  <input type="date" name="startDate" value={bookData.startDate} onChange={handleChange} className="bg-stone-50 border border-stone-200 rounded-md px-2 py-1 text-xs" />
                  <span className="text-stone-300">—</span>
                  <input type="date" name="endDate" value={bookData.endDate} onChange={handleChange} className="bg-stone-50 border border-stone-200 rounded-md px-2 py-1 text-xs" />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="bg-[#f9f5f2] border border-[#f0e7df] px-3 py-1.5 rounded-md text-stone-600 font-medium shadow-sm">
                    {formatDate(bookData.startDate) || 'Oct 1, 2023'}
                  </span>
                  <span className="text-stone-300">—</span>
                  <span className="bg-[#f9f5f2] border border-[#f0e7df] px-3 py-1.5 rounded-md text-stone-600 font-medium shadow-sm">
                    {formatDate(bookData.endDate) || ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

      {/* Sección Moods */}
      <section className="mt-16">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-6 flex items-center gap-2 italic">
          Reading Mood
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Inspired", "Emotional", "Cozy", "Thoughtful", "Heartbroken"].map(mood => (
            <button
              key={mood}
              onClick={() => toggleMood(mood)}
              disabled={!isEditing}
              className={`px-4 py-1.5 rounded-full text-[10px] flex items-center gap-2 transition-all font-sans tracking-wide border ${
                bookData.moods.includes(mood) 
                ? 'bg-orange-50 text-orange-700 border-orange-200 shadow-sm scale-105' 
                : 'bg-transparent text-stone-300 border-stone-100 opacity-60'
              }`}
            >
              {mood === "Inspired" && <Sparkles size={12} />}
              {mood === "Emotional" && <Smile size={12} />}
              {mood === "Cozy" && <Coffee size={12} />}
              {mood === "Heartbroken" && <HeartCrack size={12} />}
              {mood}
            </button>
          ))}
        </div>
      </section>

      {/* Sección Pensamientos */}
      <section className="mt-16">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-6 italic border-b border-stone-100 w-fit pb-1">My Thoughts</h3>
        {isEditing ? (
          <textarea 
            name="thoughts"
            value={bookData.thoughts}
            onChange={handleChange}
            placeholder="Write your review or feelings here..."
            className="w-full h-64 bg-white border border-stone-200 p-6 rounded shadow-inner focus:outline-none leading-relaxed font-sans text-sm"
          />
        ) : (
          <p className="text-slate-600 leading-[1.8] text-[15px] whitespace-pre-line p-2">
            {bookData.thoughts || "Nothing written yet..."}
          </p>
        )}
      </section>

      {/* Sección Citas Dinámica */}
      <section className="mt-16 bg-stone-50/50 p-8 rounded-sm relative border border-stone-100">
        <div className="absolute -top-3 left-6 w-6 h-6 bg-pink-200 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
            <Plus size={10} className="text-white" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-8 italic">Favorite Quotes</h3>
        
        <div className="space-y-6">
          {bookData.quotes.map((quote, idx) => (
            <div key={idx} className="bg-white p-6 rounded border border-stone-100 shadow-sm relative group animate-in fade-in slide-in-from-bottom-2">
              {isEditing ? (
                <div className="space-y-3">
                  <textarea 
                    value={quote.text}
                    onChange={(e) => handleQuoteChange(idx, 'text', e.target.value)}
                    placeholder="Quote text..."
                    className="w-full bg-transparent italic text-sm focus:outline-none border-b border-stone-100"
                  />
                  <div className="flex items-center gap-2 text-[10px] text-stone-400 font-sans">
                    <span>PAGE:</span>
                    <input 
                      value={quote.page}
                      onChange={(e) => handleQuoteChange(idx, 'page', e.target.value)}
                      className="w-12 border-b border-stone-200 focus:outline-none text-center"
                    />
                  </div>
                  <button 
                    onClick={() => removeQuote(idx)}
                    className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <>
                  <p className="italic text-slate-700 text-[15px] mb-3 leading-relaxed">"{quote.text || '...'}"</p>
                  <div className="text-[10px] text-slate-400 font-sans uppercase tracking-widest">— Page {quote.page || '0'}</div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {isEditing && (
          <button 
            onClick={addQuote}
            className="w-full mt-6 border-2 border-dashed border-stone-200 py-3 rounded text-stone-400 text-[10px] uppercase font-bold flex items-center justify-center gap-2 hover:bg-stone-100/50 transition tracking-widest"
          >
            <Plus size={14} /> Add another highlight
          </button>
        )}
      </section>

      {/* Footer / Sticker */}
      <div className="mt-20 flex justify-between items-end opacity-60">
        <div className="text-[10px] font-sans text-stone-300 uppercase tracking-[0.4em]">
           Finis Coronat Opus
        </div>
        <div className="w-24 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
           <div className="bg-white p-1.5 shadow-md border border-stone-100 transform -rotate-2">
              <img 
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200" 
                alt="Cafe vibes" 
                className="w-full grayscale-[30%] brightness-110"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default BookEntry;