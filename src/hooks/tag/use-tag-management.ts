import TagName from "@/lib/tag-name";
import BookmarkService from "@/services/bookmark-service";
import TagBookmarkRelationService from "@/services/tag-bookmark-relation-service";
import TagService from "@/services/tag-service";
import { selectedTagAtom, tagsAtom } from "@/store/tag";
import type { BookmarkTreeNode } from "@/types/bookmark";
import type { Tag, UpdateTagParams } from "@/types/tag";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

export const useTagManagement = () => {
  const [tags, setTags] = useAtom(tagsAtom);
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const tagService = TagService.getInstance();
  const relationService = TagBookmarkRelationService.getInstance();
  const bookmarkService = BookmarkService.getInstance();

  // 修改 loadTags 函数中的标签路径构建
  const loadTags = useCallback(async () => {
    try {
      setLoading(true);
      const allTags = await tagService.getAllTags();

      // 构建完整路径，添加安全处理
      const tagsWithPath = allTags.map((tag) => {
        try {
          return {
            ...tag,
            fullPath: TagName.buildFullPathWithAllTags(tag, allTags)
          };
        } catch (error) {
          // 如果单个标签路径构建失败，记录错误但不中断整个处理
          console.error(`构建标签 ${tag.name} 的路径失败:`, error);
          return {
            ...tag,
            fullPath: `#${tag.name} (路径错误)`
          };
        }
      });

      setTags(tagsWithPath);
      setError(null);
      return allTags;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load tags"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取子标签
  const getChildTags = useCallback(
    (parentId: string): Tag[] => {
      return tags.filter((tag) => tag.parentId === parentId);
    },
    [tags]
  );

  const updateTag = async (id: string, params: UpdateTagParams): Promise<Tag> => {
    params.name = params.name.replace(/^#/, "");
    const updatedTag = await tagService.updateTag(id, params);
    const allTags = await loadTags(); // 重新加载并返回获取的标签

    // 使用loadTags获取的数据计算fullPath
    return {
      ...updatedTag,
      fullPath: TagName.buildFullPathWithAllTags(updatedTag, allTags)
    };
  };

  // 删除标签
  const deleteTag = async (id: string, deleteWithBookmarks: boolean): Promise<void> => {
    try {
      // 如果需要删除关联的书签
      if (deleteWithBookmarks) {
        const bookmarks = await getTagBookmarks(id);
        if (!bookmarks) {
          return;
        }

        // 并行删除所有关联的书签
        await Promise.all(
          bookmarks.map(async (bookmark) => {
            try {
              await bookmarkService.deleteBookmark(bookmark.id);
            } catch (error) {
              console.error(`Failed to delete bookmark ${bookmark.id}:`, error);
              // 继续删除其他书签
            }
          })
        );
      }

      // 删除关联关系和标签
      await relationService.deleteRelationsByTagId(id);
      // 传递参数，以确定是否级联删除子标签
      await tagService.deleteTag(id, deleteWithBookmarks);
      await loadTags();
    } catch (error) {
      console.error("Failed to delete tag and related items:", error);
      throw error;
    }
  };

  // 获取标签关联的书签
  const getTagBookmarks = async (tagId: string): Promise<BookmarkTreeNode[]> => {
    return await relationService.getBookmarksByTagId(tagId);
  };

  // 从标签中移除书签
  const removeBookmarkFromTag = async (tagId: string, bookmarkId: string): Promise<void> => {
    await relationService.deleteRelation(tagId, bookmarkId);
  };

  // 向标签添加书签
  const addBookmarkToTag = async (tagId: string, bookmarkId: string): Promise<void> => {
    await relationService.createRelation(tagId, bookmarkId);
  };

  const getTagById = useCallback((id: string) => tags.find((tag) => tag.id === id), [tags]);

  // 初始加载
  useEffect(() => {
    loadTags();
  }, [loadTags]);

  return {
    loading,
    error,
    tags,
    selectedTag,
    getTagById,
    updateTag,
    deleteTag,
    getTagBookmarks,
    removeBookmarkFromTag,
    addBookmarkToTag,
    getChildTags,
    setSelectedTag
  };
};
