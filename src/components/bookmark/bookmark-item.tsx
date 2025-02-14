import { Card, CardContent } from "@/components/ui/card";
import type { BookmarkTreeNode } from "@/types/bookmark";
import React, { memo } from "react";
import BookmarkFavicon from "~components/bookmark/bookmark-favicon";

import BookmarkContextMenu from "./bookmark-context-menu";

interface BookmarkItemProps {
  bookmark: BookmarkTreeNode;
  onEdit?: (bookmark: BookmarkTreeNode) => void;
  onDelete?: (bookmark: BookmarkTreeNode) => void;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark, onEdit, onDelete }) => {
  return (
    <BookmarkContextMenu bookmark={bookmark} onEdit={onEdit} onDelete={onDelete}>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center gap-3 p-3 hover:bg-accent transition-colors">
            <div className="flex items-center justify-center">
              <BookmarkFavicon url={bookmark.url || ""} className="w-8 h-8" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate hover:text-primary">{bookmark.title}</span>
              <span className="text-xs text-muted-foreground truncate">{bookmark.url}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </BookmarkContextMenu>
  );
};

BookmarkItem.displayName = "BookmarkItem";

export default memo(BookmarkItem);
