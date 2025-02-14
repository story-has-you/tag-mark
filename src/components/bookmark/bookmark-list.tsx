import { useBookmark } from "@/components/bookmark/bookmark-context";
import BookmarkItem from "@/components/bookmark/bookmark-item";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useCallback, useMemo, useState } from "react";

const BookmarkList: React.FC = () => {
  const { selectedNode } = useBookmark();
  const parentRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    bookmark?: BookmarkTreeNode;
  }>({ isOpen: false });

  const bookmarks = useMemo(() => {
    if (!selectedNode) return [];

    const getAllBookmarks = (node: BookmarkTreeNode): BookmarkTreeNode[] => {
      let bookmarks: BookmarkTreeNode[] = [];

      const traverse = (n: BookmarkTreeNode) => {
        if (n.url) {
          bookmarks.push(n);
        }
        n.children?.forEach(traverse);
      };

      traverse(node);
      return bookmarks;
    };

    return getAllBookmarks(selectedNode);
  }, [selectedNode]);

  const rowVirtualizer = useVirtualizer({
    count: bookmarks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5
  });

  const handleEdit = useCallback(
    async (bookmark: BookmarkTreeNode) => {
      try {
        // 暂时实现为简单的提示
        toast({
          title: "编辑功能开发中",
          description: `即将支持编辑: ${bookmark.title}`
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "编辑失败",
          description: "操作书签时发生错误"
        });
      }
    },
    [toast]
  );

  const handleDelete = useCallback(async (bookmark: BookmarkTreeNode) => {
    setDeleteDialog({ isOpen: true, bookmark });
  }, []);

  const confirmDelete = async () => {
    if (!deleteDialog.bookmark) return;

    try {
      await chrome.bookmarks.remove(deleteDialog.bookmark.id);
      toast({
        title: "删除成功",
        description: "书签已被删除"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "删除失败",
        description: "删除书签时发生错误"
      });
    } finally {
      setDeleteDialog({ isOpen: false });
    }
  };

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
          <div
            ref={parentRef}
            className="h-[calc(100vh-8rem)] overflow-auto"
            style={{
              contain: "strict"
            }}>
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
                    data-index={virtualRow.index}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`
                    }}
                    className="p-1">
                    <BookmarkItem bookmark={bookmark} onEdit={handleEdit} onDelete={handleDelete} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen) => setDeleteDialog((prev) => ({ ...prev, isOpen }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              你确定要删除书签 "{deleteDialog.bookmark?.title}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

BookmarkList.displayName = "BookmarkList";

export default BookmarkList;
