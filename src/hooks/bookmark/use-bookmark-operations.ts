import { useBookmark } from "@/hooks/bookmark/use-bookmark";
import { useToast } from "@/hooks/use-toast";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { useCallback } from "react";

import TagBookmarkRelationService from "@/services/tag-bookmark-relation-service";

export const useBookmarkOperations = (
  updateLocalBookmark: (bookmark: BookmarkTreeNode) => void,
  deleteLocalBookmark: (id: string) => void,
  onSaveScroll: () => void,
  onRestoreScroll: () => void
) => {
  const { deleteBookmark, updateBookmark } = useBookmark();
  const { toast } = useToast();

  const deleteBookmarkTagRelations = useCallback(async (bookmarkId: string) => {
    try {
      const relationService = TagBookmarkRelationService.getInstance();
      await relationService.deleteRelationsByBookmarkId(bookmarkId);
    } catch (error) {
      console.error("Error deleting bookmark tag relations:", error);
      throw new Error("删除书签标签关系失败");
    }
  }, []);

  const handleEdit = async (bookmark: BookmarkTreeNode | undefined, title: string, url: string, onSuccess: () => void) => {
    if (!bookmark) return;

    onSaveScroll();
    try {
      const updatedBookmark = await updateBookmark(bookmark.id, {
        title,
        url
      });

      updateLocalBookmark(updatedBookmark);

      toast({
        title: "编辑成功",
        description: "书签已更新"
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "编辑失败",
        description: "更新书签时发生错误"
      });
    } finally {
      onRestoreScroll();
    }
  };

  const handleDelete = async (bookmark: BookmarkTreeNode | undefined, onSuccess: () => void) => {
    if (!bookmark) return;

    onSaveScroll();
    try {
      // 先删除标签关系，再删除书签
      await deleteBookmarkTagRelations(bookmark.id);
      await deleteBookmark(bookmark.id);
      deleteLocalBookmark(bookmark.id);

      toast({
        title: "删除成功",
        description: "书签及其相关标签已被删除"
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "删除失败",
        description: "删除书签时发生错误，请重试"
      });
    } finally {
      onRestoreScroll();
    }
  };

  return {
    handleEdit,
    handleDelete
  };
};
