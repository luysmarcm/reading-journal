"use client";

import { useState } from "react";
import { createEntry, searchBooks } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado del Formulario Principal
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    gener: "",
    pages: 0,
    format: "Physical",
    cover: "",
    status: "Plan to Read",
    porcentaje: 0,
    date_start: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Usamos 'itle' para tu Excel
      const payload = { ...formData, id: crypto.randomUUID(), itle: formData.title };
      await createEntry(payload);
      router.push("/");
    } catch (error) {
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  // Función que recibe el libro seleccionado del modal
  const handleSelectFromModal = (book) => {
    const info = book.volumeInfo;
    setFormData({
      ...formData,
      title: info.title || "",
      author: info.authors?.[0] || "Unknown",
      gener: info.categories?.[0] || "",
      pages: info.pageCount || 0,
      cover: info.imageLinks?.thumbnail?.replace("http:", "https:") || "",
    });
    setIsModalOpen(false); // Cierra el modal
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center p-6 md:p-12 font-sans">
      
      {/* BOTÓN PARA ABRIR EL BUSCADOR MODAL */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="mb-8 bg-white border border-gray-200 px-6 py-3 rounded-2xl shadow-sm text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2"
      >
        <span>🔍</span> Search book to auto-fill
      </button>

      {/* FORMULARIO PRINCIPAL */}
      <div className="bg-white rounded-[2.5rem] shadow-sm p-10 max-w-2xl w-full border border-gray-50 relative">
        <h2 className="text-2xl text-gray-600 mb-10 font-serif">Add New Book</h2>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Cover */}
          <div className="w-full md:w-48 flex flex-col items-center">
            <div className="w-full aspect-[2/3] border-2 border-dashed border-pink-50 rounded-2xl flex flex-col items-center justify-center bg-[#FCFBF9] overflow-hidden">
              {formData.cover ? (
                <img 
                    src={formData.cover} 
                    alt="Cover" 
                    className="w-full h-full object-cover shadow-2xl rounded-xl transition-all duration-500 ring-1 ring-black/5"
                    style={{ imageRendering: 'high-quality' }} // Forzar renderizado de alta calidad
                    />
              ) : (
                <p className="text-[10px] text-gray-300 uppercase text-center p-4">No Cover Selected</p>
              )}
            </div>
          </div>

          {/* Inputs */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Book Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border-b border-gray-100 py-2 outline-none focus:border-pink-200 text-gray-700"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Author</label>
              <input
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full border-b border-gray-100 py-2 outline-none focus:border-pink-200 text-gray-700"
              />
            </div>

            <div className="flex gap-6">
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Genre</label>
                <input
                  name="gener"
                  value={formData.gener}
                  onChange={handleChange}
                  className="w-full border-b border-gray-100 py-2 outline-none focus:border-pink-200 text-gray-700"
                />
              </div>
              <div className="w-24">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 text-center">Pages</label>
                <input
                  name="pages"
                  type="number"
                  value={formData.pages}
                  onChange={handleChange}
                  className="w-full border-b border-gray-100 py-2 outline-none focus:border-pink-200 text-center"
                />
              </div>
            </div>
            
            {/* Formato */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-3">Format</label>
              <div className="flex bg-gray-50/50 p-1 rounded-xl">
                {["Physical", "Digital", "Audiobook"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormData({ ...formData, format: f })}
                    className={`flex-1 py-2 text-xs rounded-lg transition-all ${
                      formData.format === f ? "bg-white shadow-sm text-gray-700 font-medium" : "text-gray-400"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end gap-6 items-center">
          <button onClick={() => router.back()} className="text-gray-300 text-sm">Cancel</button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#D9C5C5] text-white px-10 py-3 rounded-2xl text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Book"}
          </button>
        </div>
      </div>

      {/* COMPONENTE MODAL */}
      {isModalOpen && (
        <SearchModal 
          onClose={() => setIsModalOpen(false)} 
          onSelect={handleSelectFromModal} 
        />
      )}
    </div>
  );
}

// COMPONENTE DEL MODAL DE BÚSQUEDA
function SearchModal({ onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para limpiar y mejorar la URL de la imagen
 const getHighResCover = (url) => {
  if (!url) return "https://via.placeholder.com/128x192?text=No+Cover";

  return url
    .replace("http:", "https:")
    // 1. Aumentamos el zoom al máximo nivel disponible (frecuentemente 3 o 2)
    .replace("&zoom=1", "&zoom=3")
    // 2. ELIMINAMOS los límites de ancho y alto que Google añade a veces (w=... h=...)
    .replace(/&edge=curl/g, "")
    .replace(/&w=\d+/g, "") 
    .replace(/&h=\d+/g, "")
    // 3. Forzamos a que no use compresión agresiva
    + "&fife=w800-h1200"; // Este parámetro 'fife' pide una versión de hasta 800x1200px
};

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const books = await searchBooks(query);
      setResults(books);
    } catch (err) {
      console.error("Error en el modal:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-gray-100">
        
        {/* Header del Modal */}
        <div className="p-6 border-b border-gray-50 flex gap-4 items-center bg-white">
          <input 
            autoFocus
            type="text"
            placeholder="Search by title or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 outline-none text-lg text-gray-700 placeholder:text-gray-300"
          />
          <button 
            onClick={handleSearch} 
            className="p-2 hover:bg-pink-50 rounded-full transition-colors text-gray-400 hover:text-pink-400"
          >
            🔍
          </button>
          <button 
            onClick={onClose} 
            className="text-gray-300 hover:text-gray-500 text-2xl px-2"
          >
            &times;
          </button>
        </div>

        {/* Lista de Resultados */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#FCFBF9]/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-4 border-pink-100 border-t-pink-300 rounded-full animate-spin"></div>
              <p className="text-sm text-gray-400 font-medium">Buscando en la biblioteca...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid gap-3">
              {results.map((book) => {
                const info = book.volumeInfo;
                // Generamos la URL HD aquí mismo
                const thumb = getHighResCover(info.imageLinks?.thumbnail);

                return (
                  <div 
                    key={book.id}
                    onClick={() => {
                      // IMPORTANTE: Pasamos la URL ya mejorada al onSelect
                      const bookWithHD = {
                        ...book,
                        volumeInfo: { ...info, highResCover: thumb }
                      };
                      onSelect(bookWithHD);
                    }}
                    className="flex gap-4 p-3 bg-white hover:bg-pink-50/50 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-pink-100 group shadow-sm hover:shadow-md"
                  >
                    <div className="w-14 h-20 flex-shrink-0 relative overflow-hidden rounded-lg shadow-sm">
                      <img 
                        src={thumb} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        alt={info.title}
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="font-semibold text-gray-700 truncate group-hover:text-pink-600 transition-colors">
                        {info.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {info.authors?.join(", ") || "Unknown Author"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                         <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                           {info.publishedDate?.split('-')[0] || "n/a"}
                         </span>
                         {info.pageCount && (
                           <span className="text-[9px] bg-blue-50 text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                             {info.pageCount} pages
                           </span>
                         )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-4xl block mb-4 opacity-20">📚</span>
              <p className="text-gray-400 text-sm italic">Type something to find your next favorite book</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}