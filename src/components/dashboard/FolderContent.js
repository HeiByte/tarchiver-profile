"use client";
import { useRef, useState } from "react";
import { useFolders } from "@/context/FolderContext";
import { EllipsisVertical, FileText } from "lucide-react";
import Link from "next/link";
import { forwardRef } from "react";
import ConfirmModal from "./ConfirmModal";

export default function FolderContent({ folderId }) {
  const { folders, setFolders, showToast } = useFolders();
  const fileInputRef = useRef(null);
  const [fileToDelete, setFileToDelete] = useState(null);

  const folder = folders.find((f) => f.id.toString() === folderId);

  if (!folder) {
    return (
      <div className="flex flex-col h-full bg-blue-400 overflow-hidden">
        <div className="flex-1 p-8 bg-white m-8 border-black border-4 rounded overflow-hidden flex flex-col items-center justify-center">
            <p className="font-bold text-lg text-black mb-4">Folder tidak ditemukan.</p>
            <Link href="/dashboard">
                <button className="px-4 py-2 bg-blue-500 text-white border-2 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Kembali ke Dashboard
                </button>
            </Link>
        </div>
      </div>
    );
  }

  let acceptStr = "*";
  if (folder.type === "doc") acceptStr = ".doc,.docx,.pdf,.txt,application/pdf,application/msword,text/plain";
  else if (folder.type === "media") acceptStr = "video/mp4,audio/mpeg,audio/mp3,.mp4,.mp3";
  else if (folder.type === "image") acceptStr = "image/*";

  const handleUploadClick = () => {
    if(fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validasi tipe file ketat mencegah file tembus format yang salah
      let isValid = true;
      if (folder.type === "doc" && !file.name.match(/\.(doc|docx|pdf|txt)$/i) && !file.type.match(/(pdf|msword|text)/i)) isValid = false;
      else if (folder.type === "media" && !file.name.match(/\.(mp3|mp4)$/i) && !file.type.match(/(video|audio)/i)) isValid = false;
      else if (folder.type === "image" && !file.type.match(/image/i)) isValid = false;

      if (!isValid) {
        let msg = "Gagal Upload: Tipe file tidak cocok dengan profil folder.";
        if (folder.type === "doc") msg = "Gagal Upload: Folder ini spesifik untuk Dokumen (PDF, DOCX, TXT)!";
        if (folder.type === "media") msg = "Gagal Upload: Folder media khusus untuk MP4 atau MP3!";
        if (folder.type === "image") msg = "Gagal Upload: Folder khusus Gambar (PNG, JPG, dll)!";
        
        showToast(msg, "error");
        e.target.value = "";
        return;
      }

      const newFileId = Date.now(); // Tetap menggunakan Date.now() untuk internal React key ID

      // Automatisasi urutan file 01, 02, 03... (berdasarkan jumlah file yang sudah ada di folder ini)
      const fileSequence = String(folder.files.length + 1).padStart(2, '0');

      // Automatisasi format nama file: URUTAN_FOLDERNAME_TGLUPLOAD.ext
      const extMatch = file.name.match(/\.([^.]+)$/);
      const ext = extMatch ? `.${extMatch[1]}` : "";
      
      const folderStr = (folder.name || "UNKNOWN").toUpperCase().replace(/[^A-Z0-9]+/g, '_');
      
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const tglStr = `${year}${month}${day}`; // Format date to YYYYMMDD
      
      const generatedName = `${fileSequence}_${folderStr}_${tglStr}${ext}`;

      // [INTEGRASI BACKEND]
      // Endpoint: POST /api/folders/${folder.id}/files
      // Payload Data: FormData (multipart/form-data)  
      //   -> const formData = new FormData(); 
      //   -> formData.append("file", file, generatedName); // Kirim file dg nama yang sudah di-format otomatis
      // Expected Response: Backend me-return data JSON spesifik tentang file (nama, size, tipe, dll).
      const newFile = {
        id: newFileId, // ⚠️ id ini dibikin sementara di frontend, aslinya nanti direplace dari response backend
        name: generatedName,
        originalName: file.name, // Disimpan barangkali butuh info nama file awalnya
        size: file.size, 
      };

      setFolders((prev) =>
        prev.map((f) =>
          f.id === folder.id ? { ...f, files: [...f.files, newFile] } : f
        )
      );
      
      showToast("Berhasil diupload dengan struktur penamaan yang valid!", "success");
      
      // Reset input value to allow uploading the same file again
      e.target.value = "";
    }
  };

  const handleDeleteConfirm = () => {
    if (fileToDelete) {
      // [INTEGRASI BACKEND]
      // Endpoint: DELETE /api/files/${fileToDelete} 
      //        (atau bisa juga pake DELETE /api/folders/${folder.id}/files/${fileToDelete})
      // Payload Data: Kosong (ID diambil dari URL parameter)
      // Expected Response: Status 200 OK (berhasil menghapus file tersebut dari server/storage & di database).
      setFolders((prev) =>
        prev.map((f) =>
          f.id === folder.id ? { ...f, files: f.files.filter((file) => file.id !== fileToDelete) } : f
        )
      );
      setFileToDelete(null);
      showToast("File berhasil dihapus dari sistem!", "success");
    }
  };

  return (
    <div className="flex flex-col flex-1 h-screen bg-blue-400 overflow-hidden">
        <div className="flex-1 p-8 bg-white m-8 border-black border-4 rounded overflow-hidden">
        <input type="file" id="global-file-upload" ref={fileInputRef} className="hidden" accept={acceptStr} onChange={handleFileChange} />
        {folder.files.length === 0 ? (
            <EmptyStateFile onUpload={handleUploadClick} />
        ) : (
            <FileGrid items={folder.files} onDeleteClick={setFileToDelete} />
        )}
        <ConfirmModal
          isOpen={!!fileToDelete}
          onClose={() => setFileToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Hapus File"
          message="Apakah Anda setuju menghapus file ini secara permanen?"
        />
        </div>
    </div>
  );
}

const EmptyStateFile = forwardRef(({ onUpload }, ref) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="mb-4 font-bold text-black">Folder masih kosong...</p>
      <button
        onClick={onUpload}
        className="px-4 py-2 bg-green-500 text-white font-bold border-2 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-600 active:shadow-none active:translate-y-1 transition-all"
      >
        Upload Files
      </button>
    </div>
  );
});

const FileGrid = forwardRef(({ items, onDeleteClick }, ref) => {
  return (
    <div className="flex flex-col gap-6 mt-4">
      <div className="flex flex-col flex-wrap gap-6">
        {items.map((item) => (
            <FileItem key={item.id} id={item.id} name={item.name} onDeleteClick={onDeleteClick} />
        ))}
      </div>
    </div>
  );
});

function FileItem({ id, name, onDeleteClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    onDeleteClick(id);
  };

  return (
    <div 
      className="flex items-center gap-4 cursor-pointer w-full max-w-xl p-2 hover:bg-blue-50 border-2 border-transparent hover:border-black rounded transition-all relative"
      onMouseLeave={() => setMenuOpen(false)}
    >
      <div className="w-16 h-12 bg-white border-4 border-black rounded shadow-md flex items-center justify-center">
        <FileText className="w-6 h-6 text-black" />
      </div>

      <span className="font-bold text-sm mt-1 text-black flex-1 truncate">
        {name}
      </span>

      <button 
        onClick={handleMenuClick} 
        className="p-2 hover:bg-gray-200 rounded-full border-2 border-transparent hover:border-black"
      >
        <EllipsisVertical className="w-5 h-5 text-black" />
      </button>

      {menuOpen && (
        <div className="absolute right-12 top-10 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 w-32 rounded overflow-hidden">
          <button 
            onClick={handleDeleteClick} 
            className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 font-bold border-b-2 border-transparent hover:border-black transition-all"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
