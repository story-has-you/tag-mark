// 修改 src/components/bookmark/bookmark-list.tsx
import BookmarkItem from "@/components/bookmark/bookmark-item";
import BookmarkDeleteDialog from "@/components/bookmark/dialogs/bookmark-delete-dialog";
import BookmarkEditDialog from "@/components/bookmark/dialogs/bookmark-edit-dialog";
import { useTranslation } from "@/components/i18n-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBookmark } from "@/hooks/bookmark/use-bookmark";
import { useBookmarkDialogs } from "@/hooks/bookmark/use-bookmark-dialogs";
import { useBookmarkList } from "@/hooks/bookmark/use-bookmark-list";
import { useBookmarkOperations } from "@/hooks/bookmark/use-bookmark-operations";
import { useScrollPosition } from "@/hooks/bookmark/use-scroll-position";
import { highlightedBookmarkIdAtom } from "@/store/bookmark";
import { AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";

const BookmarkList: React.FC = () => {
  const { t } = useTranslation();
  const { selectedNode } = useBookmark();
  const { bookmarks, updateLocalBookmark, deleteLocalBookmark } = useBookmarkList(selectedNode);
  const { parentRef, saveScrollPosition, restoreScrollPosition } = useScrollPosition();
  const { editDialog, deleteDialog, handleEditDialogChange, handleDeleteDialogChange } = useBookmarkDialogs();
  const { handleEdit, handleDelete } = useBookmarkOperations(updateLocalBookmark, deleteLocalBookmark, saveScrollPosition, restoreScrollPosition);

  const [highlightedBookmarkId, setHighlightedBookmarkId] = useAtom(highlightedBookmarkIdAtom);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const highlightedItemRef = useRef<HTMLDivElement>(null);

  // 处理高亮效果
  useEffect(() => {
    if (highlightedBookmarkId) {
      setActiveHighlightId(highlightedBookmarkId);

      // 设置一个定时器，2秒后清除高亮效果
      const highlightTimer = setTimeout(() => {
        setActiveHighlightId(null);
        setHighlightedBookmarkId(null);
      }, 2000);

      return () => clearTimeout(highlightTimer);
    }
  }, [highlightedBookmarkId, setHighlightedBookmarkId]);

  // 滚动到高亮项
  useEffect(() => {
    if (activeHighlightId && highlightedItemRef.current && parentRef.current) {
      // 简化滚动逻辑，使用更可靠的滚动方法
      setTimeout(() => {
        highlightedItemRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 100);
    }
  }, [activeHighlightId, parentRef]);

  if (!selectedNode) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">{t("bookmark_list_select_folder")}</div>;
  }

  return (
    // 不设置外部容器的滚动属性，依赖于父组件中的 ScrollArea
    <div className="p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">{selectedNode.title}</h2>
      {bookmarks.length === 0 ? (
        <Alert>
          <AlertDescription>{t("bookmark_list_no_bookmarks")}</AlertDescription>
        </Alert>
      ) : (
        // 移除所有滚动相关的类，只保留高度设置和内部容器的引用
        <div ref={parentRef} className="h-[calc(100vh-10rem)]">
          <div className="space-y-2 py-1">
            <AnimatePresence initial={false}>
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} ref={bookmark.id === activeHighlightId ? highlightedItemRef : null} className="scroll-mt-4">
                  <BookmarkItem bookmark={bookmark} onEdit={editDialog.openDialog} onDelete={deleteDialog.openDialog} isHighlighted={bookmark.id === activeHighlightId} />
                </div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <BookmarkEditDialog
        open={editDialog.dialog.isOpen}
        bookmark={editDialog.dialog.bookmark}
        onOpenChange={handleEditDialogChange}
        onConfirm={(title, url) => handleEdit(editDialog.dialog.bookmark, title, url, editDialog.closeDialog)}
      />

      <BookmarkDeleteDialog
        open={deleteDialog.dialog.isOpen}
        bookmark={deleteDialog.dialog.bookmark}
        onOpenChange={handleDeleteDialogChange}
        onConfirm={() => handleDelete(deleteDialog.dialog.bookmark, deleteDialog.closeDialog)}
      />
    </div>
  );
};

BookmarkList.displayName = "BookmarkList";

export default BookmarkList;
