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
import { useVirtualizer } from "@tanstack/react-virtual";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

const BookmarkList: React.FC = () => {
  const { t } = useTranslation();
  const { selectedNode } = useBookmark();
  const { bookmarks, updateLocalBookmark, deleteLocalBookmark } = useBookmarkList(selectedNode);
  const { parentRef, saveScrollPosition, restoreScrollPosition } = useScrollPosition();
  const { editDialog, deleteDialog, handleEditDialogChange, handleDeleteDialogChange } = useBookmarkDialogs();

  const { handleEdit, handleDelete } = useBookmarkOperations(updateLocalBookmark, deleteLocalBookmark, saveScrollPosition, restoreScrollPosition);

  // 添加参考元素引用及高度状态
  const [rowHeight, setRowHeight] = useState(72); // 默认高度
  const measureRef = useRef<HTMLDivElement>(null);
  // 动态测量行高
  useEffect(() => {
    if (measureRef.current && bookmarks.length > 0) {
      const height = measureRef.current.getBoundingClientRect().height;
      if (height > 0 && height !== rowHeight) {
        setRowHeight(height);
      }
    }
  }, [bookmarks]);

  const rowVirtualizer = useVirtualizer({
    count: bookmarks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight, // 使用测量的高度
    overscan: 5
  });

  if (!selectedNode) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">{t("bookmark_list_select_folder")}</div>;
  }

  return (
    <>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">{selectedNode.title}</h2>
        {bookmarks.length === 0 ? (
          <Alert>
            <AlertDescription>该文件夹下没有书签</AlertDescription>
          </Alert>
        ) : (
          <div ref={parentRef} className="h-[calc(100vh-8rem)] overflow-auto" style={{ contain: "strict" }}>
            {/* 添加测量元素，使用第一个书签进行测量 */}
            {bookmarks.length > 0 && (
              <div ref={measureRef} className="absolute opacity-0 pointer-events-none" aria-hidden="true">
                <BookmarkItem key={`measure-${bookmarks[0].id}`} bookmark={bookmarks[0]} onEdit={editDialog.openDialog} onDelete={deleteDialog.openDialog} />
              </div>
            )}
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative"
              }}>
              <AnimatePresence>
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const bookmark = bookmarks[virtualRow.index];
                  return (
                    <motion.div
                      key={bookmark.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          delay: virtualRow.index * 0.03 // 添加级联效果
                        }
                      }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`
                      }}
                      className="p-1">
                      <BookmarkItem key={bookmark.id} bookmark={bookmark} onEdit={editDialog.openDialog} onDelete={deleteDialog.openDialog} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

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
    </>
  );
};

BookmarkList.displayName = "BookmarkList";

export default BookmarkList;
