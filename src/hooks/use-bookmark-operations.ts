import { useBookmark } from "@/hooks/use-bookmark";
import { useToast } from "@/hooks/use-toast";
import type { BookmarkTreeNode } from "@/types/bookmark";

export const useBookmarkOperations = (
  updateLocalBookmark: (bookmark: BookmarkTreeNode) => void,
  deleteLocalBookmark: (id: string) => void,
  onSaveScroll: () => void,
  onRestoreScroll: () => void
) => {
  const { deleteBookmark, updateBookmark } = useBookmark();
  const { toast } = useToast();

  const handleEdit = async (
    bookmark: BookmarkTreeNode | undefined,
    title: string,
    url: string,
    onSuccess: () => void
  ) => {
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
      await deleteBookmark(bookmark.id);
      deleteLocalBookmark(bookmark.id);

      toast({
        title: "删除成功",
        description: "书签已被删除"
      });
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "删除失败",
        description: "删除书签时发生错误"
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
