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
import { AnimatePresence } from "framer-motion";
import React from "react";

const BookmarkList: React.FC = () => {
  const { t } = useTranslation();
  const { selectedNode } = useBookmark();
  const { bookmarks, updateLocalBookmark, deleteLocalBookmark } = useBookmarkList(selectedNode);
  const { parentRef, saveScrollPosition, restoreScrollPosition } = useScrollPosition();
  const { editDialog, deleteDialog, handleEditDialogChange, handleDeleteDialogChange } = useBookmarkDialogs();

  const { handleEdit, handleDelete } = useBookmarkOperations(updateLocalBookmark, deleteLocalBookmark, saveScrollPosition, restoreScrollPosition);

  if (!selectedNode) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">{t("bookmark_list_select_folder")}</div>;
  }

  return (
    <>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">{selectedNode.title}</h2>
        {bookmarks.length === 0 ? (
          <Alert>
            <AlertDescription>{t("bookmark_list_no_bookmarks")}</AlertDescription>
          </Alert>
        ) : (
          <div ref={parentRef} className="h-[calc(100vh-8rem)]">
            <div className="space-y-2 py-1">
              <AnimatePresence initial={false}>
                {bookmarks.map((bookmark) => (
                  <div key={bookmark.id}>
                    <BookmarkItem bookmark={bookmark} onEdit={editDialog.openDialog} onDelete={deleteDialog.openDialog} />
                  </div>
                ))}
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
