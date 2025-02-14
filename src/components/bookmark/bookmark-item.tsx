import BookmarkContextMenu from "@/components/bookmark/bookmark-context-menu";
import BookmarkFavicon from "@/components/bookmark/bookmark-favicon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTagManagement } from "@/hooks/tag/use-tag-management";
import type { BookmarkTreeNode } from "@/types/bookmark";
import React, { memo } from "react";

interface BookmarkItemProps {
  bookmark: BookmarkTreeNode;
  onEdit?: (bookmark: BookmarkTreeNode) => void;
  onDelete?: (bookmark: BookmarkTreeNode) => void;
}

const MAX_DISPLAY_TAGS = 3;

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark, onEdit, onDelete }) => {
  const { tags, loading } = useTagManagement(bookmark);

  return (
    <BookmarkContextMenu bookmark={bookmark} onEdit={onEdit} onDelete={onDelete}>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-3 p-3 hover:bg-accent transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0">
                <BookmarkFavicon url={bookmark.url || ""} className="w-8 h-8" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate hover:text-primary">{bookmark.title}</span>
                <span className="text-xs text-muted-foreground truncate">{bookmark.url}</span>
              </div>
            </div>

            {!loading && tags.length > 0 && (
              <div className="flex flex-shrink-0 items-center gap-1 ml-4 mr-8">
                {tags.slice(0, MAX_DISPLAY_TAGS).map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs whitespace-nowrap">
                    {tag.name}
                  </Badge>
                ))}
                {tags.length > MAX_DISPLAY_TAGS && (
                  <Badge variant="secondary" className="text-xs whitespace-nowrap">
                    +{tags.length - MAX_DISPLAY_TAGS}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </BookmarkContextMenu>
  );
};

BookmarkItem.displayName = "BookmarkItem";

export default memo(BookmarkItem);
