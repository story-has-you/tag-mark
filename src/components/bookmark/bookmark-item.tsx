import BookmarkContextMenu from "@/components/bookmark/bookmark-context-menu";
import BookmarkFavicon from "@/components/bookmark/bookmark-favicon";
import { Card, CardContent } from "@/components/ui/card";
import { useBookmarkTagManagement } from "@/hooks/bookmark/use-bookmark-tag-management";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { motion } from "framer-motion";
import React, { memo } from "react";

import BookmarkTag from "~components/bookmark/bookmark-tag";

interface BookmarkItemProps {
  bookmark: BookmarkTreeNode;
  onEdit?: (bookmark: BookmarkTreeNode) => void;
  onDelete?: (bookmark: BookmarkTreeNode) => void;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark, onEdit, onDelete }) => {
  const { tags, loading } = useBookmarkTagManagement(bookmark);

  return (
    <BookmarkContextMenu bookmark={bookmark} onEdit={onEdit} onDelete={onDelete}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-transparent hover:border-primary/20 dark:bg-slate-900/90 dark:hover:bg-slate-800/90">
          <CardContent className="p-0">
            <div className="flex items-center justify-between gap-3 p-3 hover:bg-accent/50 dark:hover:bg-slate-800/70 transition-all duration-300 group">
              <div className="flex items-center gap-3 min-w-0">
                <motion.div className="flex-shrink-0" whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                  <BookmarkFavicon url={bookmark.url || ""} className="w-8 h-8" />
                </motion.div>
                <div className="flex flex-col min-w-0 space-y-1">
                  <span className="text-sm font-medium truncate group-hover:text-primary dark:text-slate-200 dark:group-hover:text-primary transition-colors duration-200">
                    {bookmark.title}
                  </span>
                  <span className="text-xs text-muted-foreground/70 truncate group-hover:text-muted-foreground dark:text-slate-400 dark:group-hover:text-slate-300 transition-colors duration-200">
                    {bookmark.url}
                  </span>
                </div>
              </div>
              {!loading && tags.length > 0 && <BookmarkTag tags={tags} />}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </BookmarkContextMenu>
  );
};

BookmarkItem.displayName = "BookmarkItem";

export default memo(BookmarkItem);
