"use client";

import { useState, useEffect } from "react";
import { searchWiki, getWikiDetail } from "@/lib/api";

export default function ExperimentPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  async function handleClick(title) {
    const data = await getWikiDetail(title);
    setSelected(data);
  }

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query) return;

      const data = await searchWiki(query);

      console.log("SEARCH RESULT JSON:", data);
      setResults(data.pages);
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="max-w mx-auto p-4 md:p-8 min-h-screen bg-gray-50">
      <h1 className="text-primary text-center uppercase p-2 text-2xl tracking-widest mb-6">
        Cari dan Temukan Artikel
      </h1>
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Wikipedia..."
          className="w-full px-5 py-3 rounded-full border text-primary border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-8">
        {/* Kolom Hasil Pencarian */}
        <div className="space-y-4 overflow-y-auto max-h-[80vh] pr-2 custom-scrollbar">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">
            Hasil Pencarian
          </h2>
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item.title)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selected?.title === item.title
                  ? "bg-blue-50 border-blue-400 shadow-md"
                  : "bg-white border-gray-200 hover:border-blue-300 shadow-sm"
              }`}
            >
              <h3 className="font-bold text-primary">{item.title}</h3>
              <p
                className="text-sm text-black mt-1 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: item.excerpt }}
              />
            </div>
          ))}
        </div>

        {/* Kolom Detail View */}
        <div className="md:sticky md:top-8 h-fit">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              {selected.thumbnail && (
                <img
                  src={selected.thumbnail.source}
                  alt={selected.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selected.title}
                </h2>
                <div className="prose prose-blue text-gray-700">
                  <p className="leading-relaxed">{selected.extract}</p>
                </div>
                <a
                  href={`https://en.wikipedia.org/wiki/${selected.title}`}
                  target="_blank"
                  className="mt-6 inline-block text-blue-600 font-medium hover:underline"
                >
                  Read full article on Wikipedia →
                </a>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400">
              <p>Pilih artikel untuk melihat detail</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
