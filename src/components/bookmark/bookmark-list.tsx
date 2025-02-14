import { useBookmarkContext } from "@/components/bookmark/bookmark-context";
import BookmarkItem from "@/components/bookmark/bookmark-item";
import DeleteBookmarkDialog from "@/components/bookmark/dialogs/delete-bookmark-dialog";
import EditBookmarkDialog from "@/components/bookmark/dialogs/edit-bookmark-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBookmark } from "@/hooks/use-bookmark";
import { useBookmarkDialog } from "@/hooks/use-bookmark-dialog";
import { useBookmarkList } from "@/hooks/use-bookmark-list";
import { useToast } from "@/hooks/use-toast";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useRef } from "react";

const BookmarkList: React.FC = () => {
  const { selectedNode } = useBookmarkContext();
  const { deleteBookmark, updateBookmark } = useBookmark();
  const { toast } = useToast();
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const editDialog = useBookmarkDialog();
  const deleteDialog = useBookmarkDialog();

  const { bookmarks, updateLocalBookmark, deleteLocalBookmark } = useBookmarkList(selectedNode);

  // 保存滚动位置
  const saveScrollPosition = () => {
    if (parentRef.current) {
      scrollPositionRef.current = parentRef.current.scrollTop;
    }
  };

  // 恢复滚动位置
  const restoreScrollPosition = () => {
    if (parentRef.current) {
      parentRef.current.scrollTop = scrollPositionRef.current;
    }
  };

  const handleEdit = async (title: string, url: string) => {
    if (!editDialog.dialog.bookmark) return;

    saveScrollPosition();
    try {
      const updatedBookmark = await updateBookmark(editDialog.dialog.bookmark.id, {
        title,
        url
      });

      updateLocalBookmark(updatedBookmark);

      toast({
        title: "编辑成功",
        description: "书签已更新"
      });
      editDialog.closeDialog();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "编辑失败",
        description: "更新书签时发生错误"
      });
    } finally {
      restoreScrollPosition();
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.dialog.bookmark) return;

    saveScrollPosition();
    try {
      await deleteBookmark(deleteDialog.dialog.bookmark.id);

      deleteLocalBookmark(deleteDialog.dialog.bookmark.id);

      toast({
        title: "删除成功",
        description: "书签已被删除"
      });
      deleteDialog.closeDialog();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "删除失败",
        description: "删除书签时发生错误"
      });
    } finally {
      restoreScrollPosition();
    }
  };

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
                    <BookmarkItem
                      bookmark={bookmark}
                      onEdit={editDialog.openDialog}
                      onDelete={deleteDialog.openDialog}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <EditBookmarkDialog
        open={editDialog.dialog.isOpen}
        bookmark={editDialog.dialog.bookmark}
        onOpenChange={(isOpen) => editDialog.setDialog((prev) => ({ ...prev, isOpen }))}
        onConfirm={handleEdit}
      />

      <DeleteBookmarkDialog
        open={deleteDialog.dialog.isOpen}
        bookmark={deleteDialog.dialog.bookmark}
        onOpenChange={(isOpen) => deleteDialog.setDialog((prev) => ({ ...prev, isOpen }))}
        onConfirm={handleDelete}
      />
    </>
  );
};

BookmarkList.displayName = "BookmarkList";

export default BookmarkList;
