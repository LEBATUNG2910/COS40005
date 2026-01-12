"use client"
import React, { createContext, useContext, useState } from 'react';

const FileContext = createContext();

export function FileProvider({ children }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  return (
    <FileContext.Provider value={{ 
      uploadedFile, 
      setUploadedFile, 
      selectedTemplateId, 
      setSelectedTemplateId 
    }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFileStore() {
  return useContext(FileContext);
}