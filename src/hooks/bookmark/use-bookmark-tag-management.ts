import { useToast } from "@/hooks/use-toast";
import TagName from "@/lib/tag-name";
import TagBookmarkRelationService from "@/services/tag-bookmark-relation-service";
import TagService from "@/services/tag-service";
import { bookmarkTagsAtom } from "@/store/bookmark";
import type { BookmarkTreeNode } from "@/types/bookmark";
import type { Tag } from "@/types/tag";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

export const useBookmarkTagManagement = (bookmark?: BookmarkTreeNode) => {
  const [bookmarkTags, setBookmarkTags] = useAtom(bookmarkTagsAtom);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const [allTags, setAllTags] = useState<Tag[]>([]);

  // 加载标签数据
  const loadTags = useCallback(async () => {
    if (!bookmark?.id) return;

    setLoading(true);
    try {
      const tags = await TagBookmarkRelationService.getInstance().getTagsByBookmarkId(bookmark.id);
      const allTags = await TagService.getInstance().getAllTags();
      tags.forEach((tag) => (tag.fullPath = TagName.buildFullPathWithAllTags(tag, allTags)));
      allTags.forEach((tag) => (tag.fullPath = TagName.buildFullPathWithAllTags(tag, allTags)));
      setBookmarkTags((prev) => ({
        ...prev,
        [bookmark.id]: tags
      }));
      setAllTags(allTags);
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

  const handleAddTag = useCallback(
    async (tagPath: string) => {
      if (!bookmark?.id) return;

      try {
        const normalizedPath = tagPath.replace(/^#/, "");
        const tagName = new TagName(normalizedPath);

        // 验证标签名称
        tagName.validate();
        if (tagName.isEmpty()) return;

        const allTags = await TagService.getInstance().getAllTags();
        let parentId: string | undefined = undefined;
        let lastTag: Tag | undefined = undefined;

        // 记录创建的标签ID，用于可能的回滚
        const createdTagIds: string[] = [];

        // 按层级处理每个标签
        for (let depth = 0; depth < tagName.getDepth(); depth++) {
          // 验证父标签
          tagName.validateParentTag(depth, parentId);

          const currentName = tagName.getNameAtDepth(depth);

          // 在当前父标签下查找是否已存在该标签
          const existingTag = allTags.find((tag) => tag.name === currentName && tag.parentId === parentId);

          if (existingTag) {
            lastTag = existingTag;
            parentId = existingTag.id;
          } else {
            try {
              // 创建新标签
              const newTag = await TagService.getInstance().createTag({
                name: currentName,
                parentId: parentId
              });
              lastTag = newTag;
              parentId = newTag.id;

              // 为新标签计算并设置fullPath
              newTag.fullPath = TagName.buildFullPathWithAllTags(newTag, [...allTags, newTag]);

              allTags.push(newTag);
              createdTagIds.push(newTag.id); // 记录创建的标签ID
            } catch (error) {
              // 创建标签失败，回滚已创建的标签
              await rollbackCreatedTags(createdTagIds);
              throw error;
            }
          }
        }

        // 创建书签和最后一个标签的关联
        if (lastTag) {
          try {
            await TagBookmarkRelationService.getInstance().createRelation(lastTag.id, bookmark.id);
            await loadTags();

            toast({
              title: "已添加标签",
              description: `标签 "${tagName.getFullPath()}" 已添加`
            });
            setInput("");
          } catch (error) {
            // 关联失败，回滚创建的标签
            await rollbackCreatedTags(createdTagIds);
            throw error;
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "添加标签时发生错误";
        toast({
          variant: "destructive",
          title: "添加失败",
          description: errorMessage
        });
      }
    },
    [bookmark?.id, loadTags, toast]
  );

  // 添加回滚函数，用于回滚已创建的标签
  const rollbackCreatedTags = async (tagIds: string[]): Promise<void> => {
    if (tagIds.length === 0) return;

    try {
      for (const tagId of tagIds) {
        await TagService.getInstance().deleteTag(tagId);
      }
    } catch (error) {
      console.error("回滚标签失败:", error);
      // 即使回滚失败，也继续处理
    }
  };

  // 删除标签
  const handleDeleteTag = useCallback(
    async (tagId: string) => {
      if (!bookmark?.id) return;

      try {
        await TagBookmarkRelationService.getInstance().deleteRelation(tagId, bookmark.id);
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
  const filteredTags = bookmarkTags[bookmark?.id ?? ""]?.filter((tag) => tag.name.toLowerCase().includes(input.trim().toLowerCase())) ?? [];

  return {
    tags: bookmarkTags[bookmark?.id ?? ""] ?? [],
    allTags,
    loading,
    input,
    setInput,
    filteredTags,
    handleAddTag,
    handleDeleteTag
  };
};
