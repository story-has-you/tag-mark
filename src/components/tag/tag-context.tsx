import type { Tag } from "@/types/tag";
import React, { createContext, useContext, useState } from "react";

interface TagContextType {
  selectedTag: Tag | null;
  setSelectedTag: (tag: Tag | null) => void;
}

const TagContext = createContext<TagContextType | undefined>(undefined);

export const TagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  return <TagContext.Provider value={{ selectedTag, setSelectedTag }}>{children}</TagContext.Provider>;
};

export const useTagContext = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error("useTagContext must be used within a TagProvider");
  }
  return context;
};
