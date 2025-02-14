import type { BookmarkTreeNode } from "@/types/bookmark";
import React, { createContext, useContext, useState } from "react";

interface BookmarkContextType {
  selectedNode: BookmarkTreeNode | null;
  setSelectedNode: (node: BookmarkTreeNode | null) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [selectedNode, setSelectedNode] = useState<BookmarkTreeNode | null>(
    null
  );

  return (
    <BookmarkContext.Provider value={{ selectedNode, setSelectedNode }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmark must be used within a BookmarkProvider");
  }
  return context;
};
