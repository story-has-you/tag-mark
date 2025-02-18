import { useTagManagement } from "@/hooks/tag/use-tag-management";
import type { Tag } from "@/types/tag";
import React, { createContext, useContext, useState } from "react";

interface TagContextType {
  selectedTag: Tag | null;
  setSelectedTag: (tag: Tag | null) => void;
  tags: Tag[];
  refreshTags: () => Promise<void>;
}

const TagContext = createContext<TagContextType | undefined>(undefined);
export const TagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const tagManagement = useTagManagement();

  return (
    <TagContext.Provider
      value={{
        selectedTag,
        setSelectedTag,
        tags: tagManagement.tags,
        refreshTags: tagManagement.refreshTags
      }}>
      {children}
    </TagContext.Provider>
  );
};

export const useTagContext = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error("useTagContext must be used within a TagProvider");
  }
  return context;
};
