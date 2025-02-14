import { useToast } from "@/hooks/use-toast";
import TagBookmarkRelationService from "@/services/tag-bookmark-relation-service";
import TagService from "@/services/tag-service";
import type { BookmarkTreeNode } from "@/types/bookmark";
import type { Tag } from "@/types/tag";
import { useCallback, useMemo, useState } from "react";

export const useTagManagement = (bookmark?: BookmarkTreeNode) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  // 过滤未选择的相关标签
  const filteredTags = useMemo(() => {
    const search = input.trim().toLowerCase();
    return search
      ? tags.filter((tag) => tag.name.toLowerCase().includes(search) && !selectedTags.includes(tag.id))
      : [];
  }, [tags, input, selectedTags]);

  // 加载标签数据
  const loadTags = useCallback(async () => {
    if (!bookmark) return;

    try {
      const [allTags, bookmarkTags] = await Promise.all([
        TagService.getInstance().getAllTags(),
        TagBookmarkRelationService.getInstance().getTagsByBookmarkId(bookmark.id)
      ]);
      setTags(allTags);
      setSelectedTags(bookmarkTags.map((tag) => tag.id));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "加载失败",
        description: "获取标签数据时发生错误"
      });
    }
  }, [bookmark]);

  // 处理标签操作
  const handleTagOperation = useCallback(
    async (tagName: string, isRemove = false) => {
      if (!bookmark || !tagName.trim()) return;

      try {
        let targetTag = tags.find((tag) => tag.name === tagName);

        if (!targetTag && !isRemove) {
          targetTag = await TagService.getInstance().createTag({ name: tagName.trim() });
          setTags((prev) => [...prev, targetTag!]);
        }

        if (targetTag) {
          if (isRemove) {
            await TagBookmarkRelationService.getInstance().deleteRelation(targetTag.id, bookmark.id);
            setSelectedTags((prev) => prev.filter((id) => id !== targetTag!.id));
          } else {
            await TagBookmarkRelationService.getInstance().createRelation(targetTag.id, bookmark.id);
            setSelectedTags((prev) => [...prev, targetTag!.id]);
          }

          toast({
            title: isRemove ? "已移除标签" : "已添加标签",
            description: `标签 "${tagName}" ${isRemove ? "已移除" : "已添加"}`
          });

          setInput("");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "操作失败",
          description: "处理标签时发生错误"
        });
      }
    },
    [bookmark, tags]
  );

  // 重置状态
  const reset = useCallback(() => {
    setInput("");
    if (!bookmark) {
      setTags([]);
      setSelectedTags([]);
    }
  }, [bookmark]);

  return {
    tags,
    selectedTags,
    input,
    setInput,
    filteredTags,
    loadTags,
    handleTagOperation,
    reset
  };
};
