import BookmarkContextMenu from "@/components/bookmark/bookmark-context-menu";
import BookmarkFavicon from "@/components/bookmark/bookmark-favicon";
import BookmarkTag from "@/components/bookmark/bookmark-tag";
import { Card, CardContent } from "@/components/ui/card";
import { useBookmarkTagManagement } from "@/hooks/bookmark/use-bookmark-tag-management";
import { cn } from "@/lib/utils";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { AnimatePresence, motion } from "framer-motion";
import React, { memo } from "react";

interface BookmarkItemProps {
  bookmark: BookmarkTreeNode;
  onEdit?: (bookmark: BookmarkTreeNode) => void;
  onDelete?: (bookmark: BookmarkTreeNode) => void;
  className?: string;
  isHighlighted?: boolean;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark, onEdit, onDelete, className, isHighlighted }) => {
  const { tags, loading } = useBookmarkTagManagement(bookmark);

  return (
    <BookmarkContextMenu bookmark={bookmark} onEdit={onEdit} onDelete={onDelete}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {/* 外层动画容器 */}
        <motion.div
          animate={
            isHighlighted
              ? {
                  boxShadow: ["0 0 0 0 rgba(79, 70, 229, 0)", "0 0 0 6px rgba(79, 70, 229, 0.3)", "0 0 0 0 rgba(79, 70, 229, 0)"],
                  scale: [1, 1.03, 1],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop"
                  }
                }
              : {
                  boxShadow: "0 0 0 0 rgba(79, 70, 229, 0)",
                  scale: 1
                }
          }
          className="rounded-xl overflow-hidden">
          <Card
            className={cn(
              "overflow-hidden transition-all duration-300 border-transparent",
              isHighlighted
                ? "ring-2 ring-primary bg-primary/5 dark:bg-primary/10 shadow-lg"
                : "hover:shadow-md hover:border-primary/20 dark:bg-slate-900/90 dark:hover:bg-slate-800/90",
              className
            )}>
            {/* 背景动画容器 */}
            <motion.div
              animate={
                isHighlighted
                  ? {
                      backgroundColor: ["rgba(79, 70, 229, 0.05)", "rgba(79, 70, 229, 0.1)", "rgba(79, 70, 229, 0.05)"],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }
                    }
                  : {
                      backgroundColor: "transparent"
                    }
              }
              className="p-0">
              <CardContent className="p-0">
                <div className={cn("flex items-center justify-between gap-3 p-3 group")}>
                  <div className="flex items-center gap-3 min-w-0">
                    {/* 图标动画 */}
                    <motion.div
                      animate={
                        isHighlighted
                          ? {
                              scale: [1, 1.15, 1],
                              rotate: [0, -5, 5, -3, 0],
                              transition: {
                                duration: 1,
                                repeat: Infinity,
                                repeatType: "loop"
                              }
                            }
                          : {
                              scale: 1,
                              rotate: 0
                            }
                      }
                      className="flex-shrink-0">
                      <BookmarkFavicon url={bookmark.url || ""} className="w-8 h-8" />
                    </motion.div>
                    <div className="flex flex-col min-w-0 space-y-1">
                      {/* 标题动画 */}
                      <AnimatePresence mode="wait">
                        {isHighlighted ? (
                          <motion.span
                            key="highlighted-title"
                            initial={{ color: "inherit" }}
                            animate={{
                              color: ["#6366F1", "#4F46E5", "#6366F1"],
                              fontWeight: 600
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                            className="text-sm truncate">
                            {bookmark.title}
                          </motion.span>
                        ) : (
                          <span className="text-sm font-medium truncate group-hover:text-primary dark:text-slate-200 dark:group-hover:text-primary transition-colors duration-200">
                            {bookmark.title}
                          </span>
                        )}
                      </AnimatePresence>
                      <span className="text-xs text-muted-foreground/70 truncate group-hover:text-muted-foreground dark:text-slate-400 dark:group-hover:text-slate-300 transition-colors duration-200">
                        {bookmark.url}
                      </span>
                    </div>
                  </div>
                  {!loading && tags.length > 0 && <BookmarkTag tags={tags} />}
                </div>
              </CardContent>
            </motion.div>
          </Card>
        </motion.div>
      </motion.div>
    </BookmarkContextMenu>
  );
};

BookmarkItem.displayName = "BookmarkItem";

export default memo(BookmarkItem);
