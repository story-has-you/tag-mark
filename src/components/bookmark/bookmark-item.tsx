import BookmarkContextMenu from "@/components/bookmark/bookmark-context-menu";
import BookmarkFavicon from "@/components/bookmark/bookmark-favicon";
import BookmarkTag from "@/components/bookmark/bookmark-tag";
import { Card, CardContent } from "@/components/ui/card";
import { useBookmarkTagManagement } from "@/hooks/bookmark/use-bookmark-tag-management";
import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";
import BookmarkService from "@/services/bookmark-service";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { motion, type TargetAndTransition, type Variants } from "framer-motion";
import React, { memo } from "react";

interface BookmarkItemProps {
  bookmark: BookmarkTreeNode;
  onEdit?: (bookmark: BookmarkTreeNode) => void;
  onDelete?: (bookmark: BookmarkTreeNode) => void;
  className?: string;
  isHighlighted?: boolean;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark, onEdit, onDelete, className, isHighlighted = false }) => {
  const { tags, loading } = useBookmarkTagManagement(bookmark);
  const { clickToOpenEnabled } = useSettings();
  const hasUrl = Boolean(bookmark.url);
  const isClickable = clickToOpenEnabled && hasUrl;

  // 处理点击事件
  const handleItemClick = (e: React.MouseEvent) => {
    if (isClickable) {
      e.stopPropagation();
      BookmarkService.getInstance().createTab(bookmark.url!);
    }
  };

  // 定义动画变体
  const containerVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // 高亮动画配置
  const highlightVariants: Variants = {
    highlighted: {
      boxShadow: ["0 0 0 0 rgba(79, 70, 229, 0)", "0 0 0 6px rgba(79, 70, 229, 0.3)", "0 0 0 0 rgba(79, 70, 229, 0)"],
      scale: [1, 1.03, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop"
      }
    },
    normal: {
      boxShadow: "0 0 0 0 rgba(79, 70, 229, 0)",
      scale: 1
    }
  };

  // 背景动画配置
  const backgroundVariants: Variants = {
    highlighted: {
      backgroundColor: ["rgba(79, 70, 229, 0.05)", "rgba(79, 70, 229, 0.1)", "rgba(79, 70, 229, 0.05)"],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    },
    normal: {
      backgroundColor: "transparent"
    }
  };

  // 图标动画配置
  const iconVariants: Variants = {
    highlighted: {
      scale: [1, 1.15, 1],
      rotate: [0, -5, 5, -3, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "loop"
      }
    },
    normal: {
      scale: 1,
      rotate: 0
    }
  };

  // 标题样式
  const getTitleStyles = () => {
    if (isHighlighted) {
      return {
        animate: {
          color: ["#6366F1", "#4F46E5", "#6366F1"],
          fontWeight: 600,
          transition: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }
        } as TargetAndTransition,
        className: "text-sm truncate"
      };
    }

    return {
      className: cn(
        "text-sm font-medium truncate group-hover:text-primary dark:text-slate-200",
        "dark:group-hover:text-primary transition-colors duration-200",
        isClickable && "group-hover:underline"
      )
    };
  };

  // 卡片样式
  const cardStyles = cn(
    "overflow-hidden transition-all duration-300 border-transparent",
    isHighlighted ? "ring-2 ring-primary bg-primary/5 dark:bg-primary/10 shadow-lg" : "hover:shadow-md hover:border-primary/20 dark:bg-slate-900/90 dark:hover:bg-slate-800/90",
    isClickable && "cursor-pointer",
    className
  );

  // 内容区样式
  const contentStyles = cn("flex items-center justify-between gap-3 p-3 group", isClickable && "hover:bg-primary/5 dark:hover:bg-primary/10");

  const titleStyles = getTitleStyles();

  return (
    <BookmarkContextMenu bookmark={bookmark} onEdit={onEdit} onDelete={onDelete}>
      <motion.div variants={containerVariants} initial="initial" animate="animate">
        <motion.div variants={highlightVariants} animate={isHighlighted ? "highlighted" : "normal"} className="rounded-xl overflow-hidden">
          <Card className={cardStyles} onClick={handleItemClick}>
            <motion.div variants={backgroundVariants} animate={isHighlighted ? "highlighted" : "normal"} className="p-0">
              <CardContent className="p-0">
                <div className={contentStyles}>
                  <div className="flex items-center gap-3 min-w-0">
                    {/* 图标 */}
                    <motion.div variants={iconVariants} animate={isHighlighted ? "highlighted" : "normal"} className="flex-shrink-0">
                      <BookmarkFavicon url={bookmark.url || ""} className="w-8 h-8" />
                    </motion.div>

                    {/* 标题和URL */}
                    <div className="flex flex-col min-w-0 space-y-1">
                      {isHighlighted ? (
                        <motion.span animate={titleStyles.animate} className={titleStyles.className}>
                          {bookmark.title}
                        </motion.span>
                      ) : (
                        <span className={titleStyles.className}>{bookmark.title}</span>
                      )}

                      <span className="text-xs text-muted-foreground/70 truncate group-hover:text-muted-foreground dark:text-slate-400 dark:group-hover:text-slate-300 transition-colors duration-200">
                        {bookmark.url}
                      </span>
                    </div>
                  </div>

                  {/* 标签 */}
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
