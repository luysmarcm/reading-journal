import { getBookById, getJournalEntryByBookId } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// IMPORTANTE: Asegúrate de que la ruta y el nombre coincidan con tu archivo .jsx
import BookEntry from "@/components/BookEntry"; 
import { revalidatePath } from "next/cache";

export default async function EntryPage({ params }) {
  // 1. DESENVOLVER PARAMS
  const { id } = await params;

  // 2. FETCH DE DATOS (Hoja Books y Hoja Entries)
  const [bookData, journalData] = await Promise.all([
    getBookById(id),
    getJournalEntryByBookId(id)
  ]);

  // 3. SERVER ACTION PARA GUARDAR
  async function handleSaveAction(formData) {
    "use server";

    const API_URL = 'https://sheetdb.io/api/v1/dszn7xxutj5w7';
    // Si no existe journalData, es una fila nueva (POST)
    const isNew = !journalData;

    const url = isNew 
      ? `${API_URL}?sheet=Entries` 
      : `${API_URL}/book_id/${id}?sheet=Entries`;

    try {
      await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            book_id: id,
            thoughts: formData.thoughts,
            moods: formData.moods.join(','),
            quotes: JSON.stringify(formData.quotes),
            date_start: formData.startDate,
            date_end: formData.endDate,
          }
        })
      });

      revalidatePath(`/entry/${id}`);
    } catch (error) {
      console.error("Error saving:", error);
    }
  }

  if (!bookData) {
    return (
      <div className="p-20 text-center font-sans">
        <h1 className="text-xl font-bold text-stone-800">Libro no encontrado</h1>
        <Link href="/library" className="mt-6 inline-block text-pink-500 underline">Volver</Link>
      </div>
    );
  }

  const fullData = {
    ...bookData,
    entry: journalData || null
  };

  return (
    <div className="min-h-screen bg-[#fffcf9] pb-20">
      <nav className="max-w-4xl mx-auto p-6">
        <Link href="/library" className="text-stone-400 hover:text-stone-600 flex items-center gap-2 text-sm">
          <ArrowLeft size={16} /> Volver a la biblioteca
        </Link>
      </nav>

      <div className="animate-in fade-in duration-700">
        {/* Aquí es donde fallaba: BookEntry ya está definido arriba en el import */}
        <BookEntry 
          initialData={fullData} 
          onSave={handleSaveAction} 
        />
      </div>
    </div>
  );
}