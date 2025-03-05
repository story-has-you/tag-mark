import { useTranslation } from "@/components/i18n-context";
import { useToast } from "@/hooks/use-toast";
import TagName from "@/lib/tag-name";
import TagBookmarkRelationService from "@/services/tag-bookmark-relation-service";
import TagService from "@/services/tag-service";
import { bookmarkTagsAtom } from "@/store/bookmark";
import type { BookmarkTreeNode } from "@/types/bookmark";
import type { Tag } from "@/types/tag";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

export const useBookmarkBatchTagManagement = (bookmarks: BookmarkTreeNode[]) => {
  const { t, format } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [bookmarkTags, setBookmarkTags] = useAtom(bookmarkTagsAtom);

  // 加载所有标签
  const loadAllTags = async () => {
    try {
      const tagService = TagService.getInstance();
      const tags = await tagService.getAllTags();

      // 为标签添加完整路径
      const tagsWithPath = tags.map((tag) => {
        try {
          return {
            ...tag,
            fullPath: TagName.buildFullPathWithAllTags(tag, tags)
          };
        } catch (error) {
          console.error(`构建标签 ${tag.name} 的路径失败:`, error);
          return {
            ...tag,
            fullPath: `#${tag.name} (路径错误)`
          };
        }
      });

      setAllTags(tagsWithPath);
    } catch (error) {
      console.error("加载标签失败:", error);
      toast({
        variant: "destructive",
        title: t("toast_load_failed"),
        description: t("toast_load_failed")
      });
    }
  };

  // 根据输入过滤标签
  useEffect(() => {
    if (!input.trim()) {
      setFilteredTags([]);
      return;
    }

    const normalizedInput = input.toLowerCase();
    const filtered = allTags.filter((tag) => tag.name.toLowerCase().includes(normalizedInput) || (tag.fullPath && tag.fullPath.toLowerCase().includes(normalizedInput)));
    setFilteredTags(filtered);
  }, [input, allTags]);

  // 添加标签
  const handleAddTag = async (tagPath: string) => {
    if (!tagPath || !tagPath.trim()) {
      return;
    }

    try {
      setLoading(true);
      const normalizedPath = tagPath.replace(/^#/, "").trim();

      if (!normalizedPath) {
        toast({
          variant: "destructive",
          title: t("toast_add_failed"),
          description: t("tag_edit_dialog_name_empty")
        });
        return;
      }

      // 查找或创建标签
      let tagToAdd: Tag | null = null;
      const tagService = TagService.getInstance();

      // 查找现有标签
      const exactMatch = allTags.find((tag) => tag.fullPath === `#${normalizedPath}` || tag.fullPath === normalizedPath || tag.name.toLowerCase() === normalizedPath.toLowerCase());

      if (exactMatch) {
        tagToAdd = exactMatch;
      } else {
        // 创建新标签
        const tagName = new TagName(normalizedPath);

        let parentId: string | undefined = undefined;
        let lastTag: Tag | undefined = undefined;

        // 记录创建的标签ID，用于可能的回滚
        const createdTagIds: string[] = [];

        // 按层级处理每个标签
        for (let depth = 0; depth < tagName.getDepth(); depth++) {
          // 验证标签是否有效
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
              const newTag = await tagService.createTag({
                name: currentName,
                parentId: parentId
              });

              lastTag = newTag;
              parentId = newTag.id;

              // 为新标签计算并设置fullPath
              newTag.fullPath = TagName.buildFullPathWithAllTags(newTag, [...allTags, newTag]);

              setAllTags((prev) => [...prev, newTag]);
              createdTagIds.push(newTag.id); // 记录创建的标签ID
            } catch (error) {
              console.error("创建标签失败:", error);
              throw error;
            }
          }
        }

        tagToAdd = lastTag || null;
      }

      if (!tagToAdd) {
        throw new Error("无法创建或找到标签");
      }

      // 检查是否已添加该标签
      if (selectedTags.some((tag) => tag.id === tagToAdd!.id)) {
        toast({
          title: t("toast_tag_added"),
          description: format("toast_tag_added_desc", tagToAdd.name)
        });
        return;
      }

      // 添加到已选标签
      setSelectedTags((prev) => [...prev, tagToAdd!]);
      setInput("");
    } catch (error) {
      console.error("添加标签失败:", error);
      toast({
        variant: "destructive",
        title: t("toast_add_failed"),
        description: error instanceof Error ? error.message : t("toast_save_failed")
      });
    } finally {
      setLoading(false);
    }
  };

  // 删除已选标签
  const handleDeleteTag = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  // 批量应用标签到所有书签
  const applyTagsToBookmarks = async (): Promise<number> => {
    if (selectedTags.length === 0 || bookmarks.length === 0) {
      return 0;
    }

    try {
      setLoading(true);
      const relationService = TagBookmarkRelationService.getInstance();
      let successCount = 0;

      // 批量添加标签
      for (const bookmark of bookmarks) {
        // 获取当前书签已有的标签
        const existingTags = bookmarkTags[bookmark.id] || [];

        // 创建一个新的标签数组，用于存储合并后的标签
        const mergedTags = [...existingTags];

        for (const tag of selectedTags) {
          try {
            // 检查标签是否已存在，避免重复添加
            const tagExists = existingTags.some((existingTag) => existingTag.id === tag.id);

            if (!tagExists) {
              await relationService.createRelation(tag.id, bookmark.id);
              // 只有当标签不存在时才添加到合并数组
              mergedTags.push(tag);
              successCount++;
            }
          } catch (error) {
            console.error(`给书签 ${bookmark.id} 添加标签 ${tag.id} 失败:`, error);
            // 继续处理其他标签和书签
          }
        }

        // 更新状态，使用合并后的标签数组
        setBookmarkTags((prev) => ({
          ...prev,
          [bookmark.id]: mergedTags
        }));
      }

      return successCount;
    } finally {
      setLoading(false);
    }
  };

  // 初始加载标签
  useEffect(() => {
    loadAllTags();
  }, []);

  return {
    loading,
    input,
    setInput,
    filteredTags,
    allTags,
    selectedTags,
    handleAddTag,
    handleDeleteTag,
    applyTagsToBookmarks
  };
};
