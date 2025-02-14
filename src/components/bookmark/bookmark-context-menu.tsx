import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import React from "react";

interface BookmarkContextMenuProps {
  children: React.ReactNode;
  bookmark: BookmarkTreeNode;
  onEdit?: (bookmark: BookmarkTreeNode) => void;
  onDelete?: (bookmark: BookmarkTreeNode) => void;
}

const BookmarkContextMenu: React.FC<BookmarkContextMenuProps> = ({ children, bookmark, onEdit, onDelete }) => {
  const handleOpenInNewTab = () => {
    if (bookmark.url) {
      chrome.tabs.create({ url: bookmark.url });
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-40">
        <ContextMenuItem onClick={handleOpenInNewTab}>
          <ExternalLink className="mr-2 h-4 w-4" />
          打开
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onEdit?.(bookmark)}>
          <Pencil className="mr-2 h-4 w-4" />
          编辑
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onDelete?.(bookmark)}>
          <Trash2 className="mr-2 h-4 w-4" />
          删除
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

BookmarkContextMenu.displayName = "BookmarkContextMenu";

export default BookmarkContextMenu;
