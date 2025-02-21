import BookmarkItem from "@/components/bookmark/bookmark-item";
import BookmarkDeleteDialog from "@/components/bookmark/dialogs/bookmark-delete-dialog";
import BookmarkEditDialog from "@/components/bookmark/dialogs/bookmark-edit-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBookmark } from "@/hooks/bookmark/use-bookmark";
import { useBookmarkDialogs } from "@/hooks/bookmark/use-bookmark-dialogs";
import { useBookmarkList } from "@/hooks/bookmark/use-bookmark-list";
import { useBookmarkOperations } from "@/hooks/bookmark/use-bookmark-operations";
import { useScrollPosition } from "@/hooks/bookmark/use-scroll-position";
import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";

const BookmarkList: React.FC = () => {
  const { selectedNode } = useBookmark();
  const { bookmarks, updateLocalBookmark, deleteLocalBookmark } = useBookmarkList(selectedNode);
  const { parentRef, saveScrollPosition, restoreScrollPosition } = useScrollPosition();
  const { editDialog, deleteDialog, handleEditDialogChange, handleDeleteDialogChange } = useBookmarkDialogs();

  const { handleEdit, handleDelete } = useBookmarkOperations(updateLocalBookmark, deleteLocalBookmark, saveScrollPosition, restoreScrollPosition);

  const rowVirtualizer = useVirtualizer({
    count: bookmarks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5
  });

  if (!selectedNode) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">请选择一个文件夹</div>;
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
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative"
              }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const bookmark = bookmarks[virtualRow.index];
                return (
                  <div
                    key={bookmark.id}
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
                  </div>
                );
              })}
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
