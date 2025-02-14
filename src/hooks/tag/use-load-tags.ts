import { useToast } from "@/hooks/use-toast";
import TagBookmarkRelationService from "@/services/tag-bookmark-relation-service";
import type { Tag } from "@/types/tag";
import { useCallback, useEffect, useState } from "react";

interface UseLoadTagsResult {
  tags: Tag[];
  loading: boolean;
  error: Error | null;
  refreshTags: () => Promise<void>;
}

// 简单的缓存实现
const tagCache = new Map<string, { tags: Tag[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useLoadTags = (bookmarkId: string): UseLoadTagsResult => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const refreshTags = useCallback(async () => {
    if (!bookmarkId) return;

    setLoading(true);
    setError(null);

    try {
      const bookmarkTags = await TagBookmarkRelationService.getInstance().getTagsByBookmarkId(bookmarkId);
      setTags(bookmarkTags);

      // 更新缓存
      tagCache.set(bookmarkId, {
        tags: bookmarkTags,
        timestamp: Date.now()
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to load tags");
      setError(error);
      toast({
        variant: "destructive",
        title: "加载失败",
        description: "获取标签时发生错误"
      });
    } finally {
      setLoading(false);
    }
  }, [bookmarkId]);

  useEffect(() => {
    const cachedData = tagCache.get(bookmarkId);
    const isValidCache = cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION;

    if (isValidCache) {
      setTags(cachedData.tags);
      return;
    }

    refreshTags();
  }, [bookmarkId, refreshTags]);

  return {
    tags,
    loading,
    error,
    refreshTags
  };
};
