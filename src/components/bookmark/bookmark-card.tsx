import BookmarkFavicon from "@/components/bookmark/bookmark-favicon";
import { Card, CardContent } from "@/components/ui/card";
import type { BookmarkStoreNode } from "@/types/bookmark";
import React from "react";

interface BookmarkCardProps {
  bookmark: BookmarkStoreNode;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark }) => {
  return (
    <Card className="hover:bg-accent transition-colors">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <BookmarkFavicon url={bookmark.url || ""} className="w-6 h-6" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{bookmark.title}</span>
            {bookmark.url && <span className="text-xs text-muted-foreground truncate">{bookmark.url}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

BookmarkCard.displayName = "BookmarkCard";

export default BookmarkCard;
