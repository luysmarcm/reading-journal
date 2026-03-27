const API_URL = 'https://sheetdb.io/api/v1/dszn7xxutj5w7';
export async function getEntries() {
  const res = await fetch("https://sheetdb.io/api/v1/dszn7xxutj5w7", { cache: "no-store" });
  return res.json();
}

export async function getEntryById(id) {
  const res = await fetch(`https://sheetdb.io/api/v1/dszn7xxutj5w7/search?id=${id}`, { cache: "no-store" });
  const data = await res.json();
  return data[0];
}

export async function updateEntry(id, entry) {
  await fetch(`https://sheetdb.io/api/v1/dszn7xxutj5w7/id/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
}


// lib/api.js
export const searchBooks = async (query) => {
  if (!query) return [];

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`
    );
    if (!response.ok) throw new Error("Error en la petición");
    const data = await response.json();

    // Usamos Promise.all para procesar los libros y buscar páginas faltantes
    const results = await Promise.all(data.docs.map(async (book) => {
      let pages = book.number_of_pages_median || 0;

      // Si no hay páginas, intentamos consultar la edición específica (cover_edition_key)
      if (!pages && book.cover_edition_key) {
        try {
          const edRes = await fetch(`https://openlibrary.org/books/${book.cover_edition_key}.json`);
          const edData = await edRes.json();
          pages = edData.number_of_pages || 0;
        } catch (e) {
          console.warn("No se pudo obtener detalle de la edición");
        }
      }

      return {
        id: book.key, 
        volumeInfo: {
          title: book.title,
          authors: book.author_name || ["Autor desconocido"],
          publishedDate: book.first_publish_year?.toString() || "n/a",
          pageCount: pages, 
          coverId: book.cover_i,
        },
      };
    }));

    return results;
  } catch (error) {
    console.error("Error buscando en Open Library:", error);
    return [];
  }
};
export async function createEntry(entry) {
  // Asegúrate de que los nombres de las propiedades coincidan con los encabezados de tu Excel
  const payload = {
    id: entry.id,
    title: entry.title, // Ajustado a tu columna 'itle'
    author: entry.author,
    pages: entry.pages,
    status: entry.status || "Plan to Read",
    cover: entry.cover,
    porcentaje: entry.porcentaje || 0,
    date_start: entry.date_start,
    format: entry.format,
    gener: entry.gener
  };

  const response = await fetch("https://sheetdb.io/api/v1/dszn7xxutj5w7", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: [payload],
    }),
  });

  if (!response.ok) throw new Error("Failed to save");
  return response.json();
}


// Obtener un libro por ID (Hoja Books)
export async function getBookById(id) {
  // Buscamos específicamente en la pestaña "Books"
  const res = await fetch(`${API_URL}/search?id=${id}&sheet=Books`, { cache: 'no-store' });
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

export async function getJournalEntryByBookId(bookId) {
  // Buscamos en la pestaña "Entries" usando el ID del libro como enlace
  const res = await fetch(`${API_URL}/search?book_id=${bookId}&sheet=Entries`, { cache: 'no-store' });
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

export async function getBooksData() {
  const API_URL = 'https://sheetdb.io/api/v1/dszn7xxutj5w7';
  try {
    // Especificamos la pestaña 'Books' como vimos en tu Excel
    const res = await fetch(`${API_URL}?sheet=Books`, { cache: 'no-store' });
    return await res.json();
  } catch (error) {
    console.error("Error cargando biblioteca:", error);
    return [];
  }
}


export async function getJournalData() {
  const API_URL = 'https://sheetdb.io/api/v1/dszn7xxutj5w7';

  try {
    // 1. Obtenemos los libros de la pestaña 'Books'
    const booksRes = await fetch(`${API_URL}?sheet=Books`, { cache: 'no-store' });
    const books = await booksRes.json();

    // 2. Obtenemos las entradas de la pestaña 'Entries'
    const entriesRes = await fetch(`${API_URL}?sheet=Entries`, { cache: 'no-store' });
    const entries = await entriesRes.json();

    return { books, entries };
  } catch (error) {
    console.error("Error cargando los datos del diario:", error);
    return { books: [], entries: [] };
  }
}