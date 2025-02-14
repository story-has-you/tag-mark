import { useToast } from "@/hooks/use-toast";
import TagBookmarkRelationService from "@/services/tag-bookmark-relation-service";
import TagService from "@/services/tag-service";
import { bookmarkTagsAtom } from "@/store/tag";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

export const useTagManagement = (bookmark?: BookmarkTreeNode) => {
  const [bookmarkTags, setBookmarkTags] = useAtom(bookmarkTagsAtom);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  // 获取当前书签的标签
  const tags = bookmark?.id ? bookmarkTags[bookmark.id] || [] : [];

  // 加载标签数据
  const loadTags = useCallback(async () => {
    if (!bookmark?.id) return;

    setLoading(true);
    try {
      const bookmarkTags = await TagBookmarkRelationService.getInstance().getTagsByBookmarkId(bookmark.id);
      setBookmarkTags((prev) => ({
        ...prev,
        [bookmark.id]: bookmarkTags
      }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "加载失败",
        description: "获取标签时发生错误"
      });
    } finally {
      setLoading(false);
    }
  }, [bookmark?.id, setBookmarkTags, toast]);

  // 添加标签
  const handleAddTag = useCallback(
    async (tagName: string) => {
      if (!bookmark?.id || !tagName.trim()) return;

      try {
        const allTags = await TagService.getInstance().getAllTags();
        let targetTag = allTags.find((tag) => tag.name === tagName);

        if (!targetTag) {
          targetTag = await TagService.getInstance().createTag({ name: tagName.trim() });
        }

        await TagBookmarkRelationService.getInstance().createRelation(targetTag.id, bookmark.id);
        await loadTags();

        toast({
          title: "已添加标签",
          description: `标签 "${tagName}" 已添加`
        });
        setInput("");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "添加失败",
          description: "添加标签时发生错误"
        });
      }
    },
    [bookmark?.id, tags, loadTags, toast]
  );

  // 删除标签
  const handleDeleteTag = useCallback(
    async (tagId: string) => {
      if (!bookmark?.id) return;

      try {
        await TagBookmarkRelationService.getInstance().deleteRelation(tagId, bookmark.id);
        await TagService.getInstance().deleteTag(tagId);
        await loadTags();

        toast({
          title: "已移除标签",
          description: "标签已成功移除"
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "移除失败",
          description: "移除标签时发生错误"
        });
      }
    },
    [bookmark?.id, loadTags, toast]
  );

  // 自动加载标签
  useEffect(() => {
    loadTags();
  }, [loadTags]);

  // 过滤标签
  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(input.trim().toLowerCase()));

  return {
    tags,
    loading,
    input,
    setInput,
    filteredTags,
    handleAddTag,
    handleDeleteTag
  };
};
