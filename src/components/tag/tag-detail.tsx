import BookmarkItem from "@/components/bookmark/bookmark-item";
import BookmarkDeleteDialog from "@/components/bookmark/dialogs/bookmark-delete-dialog";
import BookmarkEditDialog from "@/components/bookmark/dialogs/bookmark-edit-dialog";
import TagDeleteDialog from "@/components/tag/dialogs/tag-delete-dialog";
import TagEditDialog from "@/components/tag/dialogs/tag-edit-dialog";
import { useTagContext } from "@/components/tag/tag-context";
import TagItem from "@/components/tag/tag-item";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookmarkDialogs } from "@/hooks/bookmark/use-bookmark-dialogs";
import { useBookmarkOperations } from "@/hooks/bookmark/use-bookmark-operations";
import { useScrollPosition } from "@/hooks/bookmark/use-scroll-position";
import { useTagManagement } from "@/hooks/tag/use-tag-management";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { Edit2, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

const TagDetail: React.FC = () => {
  const { selectedTag, setSelectedTag } = useTagContext();
  const { loading, getChildTags, getTagBookmarks, deleteTag, updateTag, refreshTags } = useTagManagement();

  const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { editDialog, deleteDialog, handleEditDialogChange, handleDeleteDialogChange } = useBookmarkDialogs();
  const { saveScrollPosition, restoreScrollPosition } = useScrollPosition();
  const updateLocalBookmark = useCallback((updatedBookmark: BookmarkTreeNode) => {
    setBookmarks((prev) => prev.map((bookmark) => (bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark)));
  }, []);

  const deleteLocalBookmark = useCallback((bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId));
  }, []);

  const { handleEdit, handleDelete } = useBookmarkOperations(updateLocalBookmark, deleteLocalBookmark, saveScrollPosition, restoreScrollPosition);

  useEffect(() => {
    const loadBookmarks = async () => {
      if (!selectedTag) return;

      setLoadingBookmarks(true);
      try {
        // 使用新的方法获取直接关联的书签
        const tagBookmarks = await getTagBookmarks(selectedTag.id);
        setBookmarks(tagBookmarks);
        // 触发整个标签树的刷新
        await refreshTags();
      } catch (err) {
        console.error("Failed to load bookmarks:", err);
      } finally {
        setLoadingBookmarks(false);
      }
    };

    loadBookmarks();
  }, [selectedTag]);

  const handleEditTag = async (name: string, parentId?: string) => {
    if (!selectedTag) return;

    try {
      const updatedTag = await updateTag(selectedTag.id, {
        id: selectedTag.id,
        name,
        parentId
      });
      // 更新 context 中的选中标签
      setSelectedTag(updatedTag);
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update tag:", error);
    }
  };

  const handleDeleteTag = async () => {
    if (!selectedTag) return;

    try {
      await deleteTag(selectedTag.id);
      setSelectedTag(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  const childTags = selectedTag ? getChildTags(selectedTag.id) : [];

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!selectedTag) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">请选择一个标签</div>;
  }

  const renderBookmarkList = () => {
    if (loadingBookmarks) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      );
    }

    if (bookmarks.length === 0) {
      return (
        <Alert>
          <AlertDescription>该标签下没有直接关联的书签</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="grid gap-2">
        {bookmarks.map((bookmark) => (
          <BookmarkItem key={bookmark.id} bookmark={bookmark} onEdit={editDialog.openDialog} onDelete={deleteDialog.openDialog} />
        ))}
      </div>
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* 标签信息和操作按钮 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{selectedTag.name}</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                编辑
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                删除
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>完整路径: {selectedTag.fullPath || selectedTag.name}</p>
            <p>创建时间: {new Date(selectedTag.createdAt).toLocaleString()}</p>
            <p>更新时间: {new Date(selectedTag.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        {/* 子标签列表 */}
        {childTags.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">子标签 ({childTags.length})</h3>
            <div className="grid gap-2">
              {childTags.map((tag) => (
                <TagItem key={tag.id} tag={tag} onSelect={setSelectedTag} />
              ))}
            </div>
          </div>
        )}

        {/* 关联书签列表 */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">直接关联书签 ({bookmarks.length})</h3>
          {renderBookmarkList()}
        </div>
      </div>

      {/* 对话框组件 */}
      <TagEditDialog open={editDialogOpen} tag={selectedTag} onOpenChange={setEditDialogOpen} onConfirm={handleEditTag} />
      <TagDeleteDialog open={deleteDialogOpen} tag={selectedTag} onOpenChange={setDeleteDialogOpen} onConfirm={handleDeleteTag} />

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
    </ScrollArea>
  );
};

TagDetail.displayName = "TagDetail";

export default TagDetail;
