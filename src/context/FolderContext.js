"use client";
import { createContext, useContext, useState } from "react";
import Notification from "@/components/dashboard/Notification";

const FolderContext = createContext();

export function FolderProvider({ children }) {
  const [folders, setFolders] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000); // otomatis hilang dalam 3 detik
  };

  // [INTEGRASI BACKEND]
  // Endpoint: GET /api/folders
  // Deskripsi: Saat aplikasi dimuat, frontend akan melakukan fetch (misal via useEffect) ke endpoint ini.
  // Expected Response (dari backend): Array of object data folder.
  // Contoh Response:
  // [
  //   { id: 1, name: 'Documents', type: 'doc', files: [ { id: 101, name: 'report.pdf', size: 1024 } ] },
  //   ...
  // ]
  // Frontend kemudian menyimpan response tersebut ke dalam state setFolders(response.data).

  return (
    <FolderContext.Provider value={{ folders, setFolders, showToast }}>
      {children}
      <Notification message={toast.message} type={toast.type} />
    </FolderContext.Provider>
  );
}

export function useFolders() {
  return useContext(FolderContext);
}