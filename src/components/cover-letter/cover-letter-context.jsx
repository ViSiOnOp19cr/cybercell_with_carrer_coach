"use client";

import { createContext, useContext, useState } from "react";

const CoverLetterContext = createContext();

export function CoverLetterProvider({ children, initialData }) {
  const [coverLetter, setCoverLetter] = useState(initialData);

  const updateCoverLetter = (updates) => {
    setCoverLetter((prev) => ({ ...prev, ...updates }));
  };

  return (
    <CoverLetterContext.Provider value={{ coverLetter, updateCoverLetter }}>
      {children}
    </CoverLetterContext.Provider>
  );
}

export function useCoverLetter() {
  const context = useContext(CoverLetterContext);
  if (!context) {
    throw new Error("useCoverLetter must be used within a CoverLetterProvider");
  }
  return context;
}
