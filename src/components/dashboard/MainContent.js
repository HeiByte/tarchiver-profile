"use client";
import { useState } from "react";

export default function MainContent() {
  const [folders, setFolders] = useState([]);

  return (
    <div className="flex flex-col h-screen bg-blue-400 overflow-hidden">
      <div className="flex-1 p-8 bg-white m-8 border-black border-4 rounded overflow-hidden">
        {folders.length === 0 ? (
          <EmptyState
            onAdd={() =>
              setFolders(
                Array.from({ length: 50 }, (_, i) => ({
                  id: i + 1,
                  name: `Folder ${i + 1}`,
                })),
              )
            }
          />
        ) : (
          <FolderGrid items={folders} />
        )}
      </div>
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="mb-4 font-bold">Folder masih kosong...</p>
      <button
        onClick={onAdd}
        className="px-4 py-2 bg-blue-500 text-white border-2 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        Create
      </button>
    </div>
  );
}

function FolderGrid({ items }) {
  return (
    <div className="h-full w-full overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
      <div className="flex flex-col flex-wrap h-full gap-x-12 gap-y-4 content-start">
        {items.map((item) => (
          <div key={item.id} className="w-fit">
            <FolderItem name={item.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

function FolderItem({ name }) {
  return (
    <div className="flex items-center group cursor-pointer gap-2">
      {/* Ikon Folder */}
      <div className="m-2 w-16 h-12 bg-amber-400 border-4 border-black rounded-tr-lg relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-amber-300">
        <div className="absolute -top-3 left-0 w-7 h-3 bg-amber-500 border-t-4 border-x-4 border-black rounded-t-md"></div>
      </div>
      <span className="font-bold text-sm text-black">{name}</span>
    </div>
  );
}
