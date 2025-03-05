import BookmarkItem from "@/components/bookmark/bookmark-item";
import BookmarkBatchAddTagDialog from "@/components/bookmark/dialogs/bookmark-batch-add-tag-dialog";
import BookmarkDeleteDialog from "@/components/bookmark/dialogs/bookmark-delete-dialog";
import BookmarkEditDialog from "@/components/bookmark/dialogs/bookmark-edit-dialog";
import { useTranslation } from "@/components/i18n-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useBookmark } from "@/hooks/bookmark/use-bookmark";
import { useBookmarkDialog } from "@/hooks/bookmark/use-bookmark-dialog";
import { useBookmarkDialogs } from "@/hooks/bookmark/use-bookmark-dialogs";
import { useBookmarkList } from "@/hooks/bookmark/use-bookmark-list";
import { useBookmarkOperations } from "@/hooks/bookmark/use-bookmark-operations";
import { useScrollPosition } from "@/hooks/bookmark/use-scroll-position";
import { highlightedBookmarkIdAtom } from "@/store/bookmark";
import { AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { Tag } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const BookmarkList: React.FC = () => {
  const { t } = useTranslation();
  const { selectedNode } = useBookmark();
  const { bookmarks, updateLocalBookmark, deleteLocalBookmark } = useBookmarkList(selectedNode);
  const { parentRef, saveScrollPosition, restoreScrollPosition } = useScrollPosition();
  const { editDialog, deleteDialog, batchAddTagDialog, handleEditDialogChange, handleDeleteDialogChange, handleBatchAddTagDialogChange } = useBookmarkDialogs();
  const { handleEdit, handleDelete } = useBookmarkOperations(updateLocalBookmark, deleteLocalBookmark, saveScrollPosition, restoreScrollPosition);
  const addTagDialog = useBookmarkDialog();
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
      {/* 修改标题区域，添加批量标签按钮 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{selectedNode.title}</h2>
        {bookmarks.length > 0 && (
          <Button variant="outline" size="sm" className="gap-2" onClick={() => addTagDialog.openDialog(selectedNode)}>
            <Tag className="h-4 w-4" />
            {t("bookmark_batch_tag_dialog_title")}
          </Button>
        )}
      </div>

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

      {/* 使用 hook 中的状态和书签数据 */}
      <BookmarkBatchAddTagDialog open={batchAddTagDialog.dialog.isOpen} bookmarks={bookmarks} folderName={selectedNode.title} onOpenChange={handleBatchAddTagDialogChange} />
    </div>
  );
};

BookmarkList.displayName = "BookmarkList";

export default BookmarkList;
