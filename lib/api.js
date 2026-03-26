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
export async function searchBooks(query) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`
    );
    const data = await res.json();
    return data.items || []; // IMPORTANTE: Debe devolver data.items
  } catch (error) {
    console.error("Error buscando libros:", error);
    return [];
  }
}

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