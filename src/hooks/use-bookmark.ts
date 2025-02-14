import BookmarkService from "@/services/bookmark-service"
import { bookmarkLoadingAtom, bookmarksAtom } from "@/store/bookmark"
import { useAtom } from "jotai"
import { useCallback, useEffect } from "react"

export const useBookmark = () => {
  const [bookmarks, setBookmarks] = useAtom(bookmarksAtom)
  const [loading, setLoading] = useAtom(bookmarkLoadingAtom)

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true)
      const data = await BookmarkService.getInstance().getAllBookmarks()
      setBookmarks(data)
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }, [setBookmarks, setLoading])

  const searchBookmarks = useCallback(
    async (query: string) => {
      try {
        setLoading(true)
        const results =
          await BookmarkService.getInstance().searchBookmarks(query)
        setBookmarks(results)
      } finally {
        setLoading(false)
      }
    },
    [setBookmarks, setLoading]
  )

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  return {
    bookmarks,
    loading,
    refreshBookmarks: fetchBookmarks,
    searchBookmarks
  }
}
