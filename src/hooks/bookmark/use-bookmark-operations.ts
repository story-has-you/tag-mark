import { useTranslation } from "@/components/i18n-context"; // 添加导入
import { useBookmark } from "@/hooks/bookmark/use-bookmark";
import { useToast } from "@/hooks/use-toast";
import TagBookmarkRelationService from "@/services/tag-bookmark-relation-service";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { useCallback } from "react";

export const useBookmarkOperations = (
  updateLocalBookmark: (bookmark: BookmarkTreeNode) => void,
  deleteLocalBookmark: (id: string) => void,
  onSaveScroll: () => void,
  onRestoreScroll: () => void
) => {
  const { deleteBookmark, updateBookmark } = useBookmark();
  const { toast } = useToast();
  const { t, format } = useTranslation(); // 添加 useTranslation

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
        title: t("toast_edit_success"),
        description: format("toast_edit_success_description", title)
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("toast_edit_failed"),
        description: t("toast_edit_error_description")
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
        title: t("toast_delete_success"),
        description: t("toast_delete_success_description")
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("toast_delete_failed"),
        description: t("toast_delete_error_description")
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
