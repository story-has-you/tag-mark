import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuShortcut,
    ContextMenuTrigger
} from "@/components/ui/context-menu";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import React from "react";

interface BookmarkContextMenuProps {
  children: React.ReactNode;
  bookmark: BookmarkTreeNode;
  onEdit?: (bookmark: BookmarkTreeNode) => void;
  onDelete?: (bookmark: BookmarkTreeNode) => void;
}

const BookmarkContextMenu: React.FC<BookmarkContextMenuProps> = ({
  children,
  bookmark,
  onEdit,
  onDelete
}) => {
  const handleOpenInNewTab = () => {
    if (bookmark.url) {
      window.open(bookmark.url, "_blank");
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onClick={() => window.open(bookmark.url, "_self")}>
          打开
          <ContextMenuShortcut>⏎</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleOpenInNewTab}>
          <ExternalLink className="mr-2 h-4 w-4" />
          新标签页中打开
          <ContextMenuShortcut>⌘⏎</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onEdit?.(bookmark)}>
          <Pencil className="mr-2 h-4 w-4" />
          编辑
          <ContextMenuShortcut>⌘E</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onDelete?.(bookmark)}>
          <Trash2 className="mr-2 h-4 w-4" />
          删除
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

BookmarkContextMenu.displayName = "BookmarkContextMenu";

export default BookmarkContextMenu;