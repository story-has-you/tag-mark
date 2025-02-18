import TagName from "@/lib/tag-name";
import TagBookmarkRelationService from "@/services/tag-bookmark-relation-service";
import TagService from "@/services/tag-service";
import type { BookmarkTreeNode } from "@/types/bookmark";
import type { Tag, UpdateTagParams } from "@/types/tag";
import { useCallback, useEffect, useState } from "react";

interface UseTagManagementReturn {
  // 状态
  loading: boolean;
  error: Error | null;
  tags: Tag[];

  // 标签操作
  updateTag: (id: string, params: UpdateTagParams) => Promise<Tag>;
  deleteTag: (id: string) => Promise<void>;

  // 关联关系操作
  getTagBookmarks: (tagId: string) => Promise<BookmarkTreeNode[]>;
  removeBookmarkFromTag: (tagId: string, bookmarkId: string) => Promise<void>;
  addBookmarkToTag: (tagId: string, bookmarkId: string) => Promise<void>;

  // 辅助方法
  getChildTags: (parentId: string) => Tag[];
  refreshTags: () => Promise<void>;
}

export const useTagManagement = (): UseTagManagementReturn => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const tagService = TagService.getInstance();
  const relationService = TagBookmarkRelationService.getInstance();

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
  const deleteTag = async (id: string): Promise<void> => {
    await tagService.deleteTag(id);
    await relationService.deleteRelationsByTagId(id);
    await loadTags();
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
