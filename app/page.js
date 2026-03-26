"use client";
// app.js (or main component file)
import React, { useState } from "react";

// --- API CONFIG ---
const API_URL = "http://localhost:1337/api";

async function fetchBooks() {
  const res = await fetch(`${API_URL}/books?populate=*`);
  return res.json();
}

async function createBook(data) {
  await fetch(`${API_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
}

// --- COMPONENTS ---

function Sidebar() {
  const items = ["Dashboard", "Library", "Gallery", "Reading Diary", "Authors"];

  return (
    <aside className="w-64 bg-[#efe3db] p-6 rounded-r-3xl">
      <h1 className="text-xl mb-6">📖 Reading Journal</h1>
      {items.map((item) => (
        <div
          key={item}
          className="py-2 px-3 rounded-xl hover:bg-pink-200 cursor-pointer"
        >
          {item}
        </div>
      ))}
    </aside>
  );
}

function Header() {
  return (
    <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm">
      <div>
        <h2 className="text-xl">Hello, Clara ✨</h2>
        <p className="text-sm text-gray-400">
          Welcome to your aesthetic reading space.
        </p>
      </div>
      <input
        className="border px-4 py-2 rounded-xl w-72"
        placeholder="Search books..."
      />
    </div>
  );
}

function Stats() {
  const stats = [
    { label: "TOTAL BOOKS", value: 42 },
    { label: "COMPLETED", value: 28 },
    { label: "PAGES READ", value: "10,450" },
    { label: "AVG RATING", value: 4.6 },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white p-6 rounded-2xl shadow-sm text-center"
        >
          <p className="text-2xl">{s.value}</p>
          <p className="text-xs text-gray-400 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function CurrentlyReading() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex gap-6">
      <div className="w-28 h-40 bg-gradient-to-br from-orange-200 to-pink-200 rounded-xl" />
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wide text-gray-400">Reading</p>
        <h3 className="text-xl mt-1">Tomorrow, and Tomorrow, and Tomorrow</h3>
        <p className="text-sm text-gray-400">Gabrielle Zevin</p>

        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-pink-300 rounded-full w-[65%]" />
          </div>
          <p className="text-xs text-right mt-1">260 / 400 pages</p>
        </div>

        <div className="flex gap-3 mt-4">
          <button className="bg-pink-300 px-4 py-2 rounded-xl">
            Update Progress
          </button>
          <button className="border px-4 py-2 rounded-xl">Write Note</button>
        </div>
      </div>
    </div>
  );
}

function Gallery() {
  return (
    <div>
      <h3 className="font-semibold mb-3">Cover Gallery</h3>
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-24 h-36 bg-gradient-to-br from-pink-100 to-gray-100 rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}

function Library() {
  return (
    <div>
      <h3 className="font-semibold mb-3">Your Library</h3>
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-44 bg-white rounded-2xl shadow-sm flex items-center justify-center"
          >
            📚
          </div>
        ))}
      </div>
    </div>
  );
}

function Diary() {
  return (
    <div>
      <h3 className="font-semibold mb-3">Reading Diary</h3>
      <div className="grid grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm">
            <p className="text-xs text-gray-400">October 12, 2023</p>
            <h4 className="mt-1">Tomorrow, and Tomorrow</h4>
            <p className="text-sm mt-2 text-gray-500">
              The atmosphere is incredibly dense and beautifully written...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Authors() {
  return (
    <div>
      <h3 className="font-semibold mb-3">Favorite Authors</h3>
      <div className="grid grid-cols-3 gap-6">
        {["Donna Tartt", "Sally Rooney", "Jane Austen"].map((a) => (
          <div key={a} className="bg-white p-6 rounded-2xl shadow-sm text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2" />
            <p>{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Genres() {
  const genres = [
    { name: "Literary Fiction", value: 90 },
    { name: "Classics", value: 70 },
    { name: "Memoir", value: 50 },
    { name: "Fantasy", value: 30 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="mb-4">Reading by Genre</h3>
      {genres.map((g) => (
        <div key={g.name} className="mb-3">
          <p className="text-sm">{g.name}</p>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-pink-300 rounded-full"
              style={{ width: `${g.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = async () => {
    await createBook({ title, author });
    alert("Book added ✨");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="mb-4">Add a Book</h3>
      <div className="grid grid-cols-2 gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded-xl"
          placeholder="Title"
        />
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border p-2 rounded-xl"
          placeholder="Author"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-pink-400 text-white px-5 py-2 rounded-xl"
      >
        Save Book
      </button>
    </div>
  );
}

// --- MAIN PAGE ---
export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#f6efe9] text-[#5b4b45] font-serif">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8">
        <Header />
        <Stats />
        <CurrentlyReading />
        <Gallery />
        <Library />
        <Diary />
        <Authors />
        <Genres />
        <AddBook />
      </main>
    </div>
  );
}