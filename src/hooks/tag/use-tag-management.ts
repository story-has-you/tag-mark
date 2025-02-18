import TagName from "@/lib/tag-name";
import TagBookmarkRelationService from "@/services/tag-bookmark-relation-service";
import TagService from "@/services/tag-service";
import { tagsAtom } from "@/store/tag";
import type { BookmarkTreeNode } from "@/types/bookmark";
import type { Tag, UpdateTagParams } from "@/types/tag";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

import BookmarkService from "~services/bookmark-service";

export const useTagManagement = () => {
  const [tags, setTags] = useAtom(tagsAtom);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const tagService = TagService.getInstance();
  const relationService = TagBookmarkRelationService.getInstance();
  const bookmarkService = BookmarkService.getInstance();

  // 加载所有标签
  const loadTags = useCallback(async () => {
    try {
      setLoading(true);
      const allTags = await tagService.getAllTags();
      // 构建完整路径
      const tagsWithPath = allTags.map((tag) => ({
        ...tag,
        fullPath: TagName.buildFullPathWithAllTags(tag, allTags)
      }));
      setTags(tagsWithPath);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load tags"));
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
    const updatedTag = await tagService.updateTag(id, params);
    await loadTags(); // 重新加载以更新路径

    // 返回更新后的完整标签信息
    const allTags = await tagService.getAllTags();
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
      await tagService.deleteTag(id);
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

  // 刷新标签列表
  const refreshTags = async (): Promise<void> => {
    await loadTags();
  };

  // 初始加载
  useEffect(() => {
    loadTags();
  }, [loadTags]);

  return {
    loading,
    error,
    tags,
    updateTag,
    deleteTag,
    getTagBookmarks,
    removeBookmarkFromTag,
    addBookmarkToTag,
    getChildTags,
    refreshTags
  };
};
