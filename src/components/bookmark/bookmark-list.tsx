import { useBookmarkContext } from "@/components/bookmark/bookmark-context";
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBookmark } from "@/hooks/use-bookmark";
import { useToast } from "@/hooks/use-toast";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useCallback, useMemo, useState } from "react";

import { Button } from "~components/ui/button";
import { Input } from "~components/ui/input";
import { Label } from "~components/ui/label";

interface EditDialogState {
  isOpen: boolean;
  bookmark?: BookmarkTreeNode;
  title: string;
  url: string;
}

const BookmarkList: React.FC = () => {
  const { selectedNode } = useBookmarkContext();
  const { deleteBookmark, updateBookmark } = useBookmark();
  const parentRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    bookmark?: BookmarkTreeNode;
  }>({ isOpen: false });
  // 编辑对话框状态
  const [editDialog, setEditDialog] = useState<EditDialogState>({
    isOpen: false,
    title: "",
    url: ""
  });

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

  const handleEdit = useCallback(async (bookmark: BookmarkTreeNode) => {
    setEditDialog({
      isOpen: true,
      bookmark,
      title: bookmark.title,
      url: bookmark.url || ""
    });
  }, []);

  const confirmEdit = async () => {
    if (!editDialog.bookmark) return;

    try {
      await updateBookmark(editDialog.bookmark.id, {
        title: editDialog.title,
        url: editDialog.url
      });

      toast({
        title: "编辑成功",
        description: "书签已更新"
      });
      setEditDialog((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "编辑失败",
        description: "更新书签时发生错误"
      });
    }
  };

  const handleDelete = useCallback(async (bookmark: BookmarkTreeNode) => {
    setDeleteDialog({ isOpen: true, bookmark });
  }, []);

  const confirmDelete = async () => {
    if (!deleteDialog.bookmark) return;

    try {
      await deleteBookmark(deleteDialog.bookmark.id);
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

      <Dialog open={editDialog.isOpen} onOpenChange={(isOpen) => setEditDialog((prev) => ({ ...prev, isOpen }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑书签</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={editDialog.title}
                onChange={(e) =>
                  setEditDialog((prev) => ({
                    ...prev,
                    title: e.target.value
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={editDialog.url}
                onChange={(e) =>
                  setEditDialog((prev) => ({
                    ...prev,
                    url: e.target.value
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog((prev) => ({ ...prev, isOpen: false }))}>
              取消
            </Button>
            <Button onClick={confirmEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
