"use client";
import { createContext, useContext } from "react";

const FolderContext = createContext();

export function FolderProvider({ children, value }) {
  return (
    <FolderContext.Provider value={value}>{children}</FolderContext.Provider>
  );
}

export function useFolders() {
  return useContext(FolderContext);
}
