export default function NavDash() {
  return (
    <div className="flex justify-between items-center mb-8 shadow bg-red-300 p-6 sticky">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search files..."
        className="px-4 py-2 bg-white rounded-lg border border-gray-200 w-1/2 outline-none focus:ring-2 focus:ring-amber-300"
      />
      {/* Profil */}
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-amber-400 rounded-full border-2 border-white shadow-sm"></div>
      </div>
    </div>
  );
}
