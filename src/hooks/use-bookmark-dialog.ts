import type { BookmarkTreeNode } from "@/types/bookmark";
import { useState } from "react";

export interface BookmarkDialogState {
  isOpen: boolean;
  bookmark?: BookmarkTreeNode;
}

export const useBookmarkDialog = () => {
  const [dialog, setDialog] = useState<BookmarkDialogState>({ isOpen: false });

  const openDialog = (bookmark: BookmarkTreeNode) => {
    setDialog({ isOpen: true, bookmark });
  };

  const closeDialog = () => {
    setDialog({ isOpen: false });
  };

  return {
    dialog,
    openDialog,
    closeDialog,
    setDialog
  };
};
