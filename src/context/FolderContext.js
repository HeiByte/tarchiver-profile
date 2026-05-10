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
    }, 3000); 
  };

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