import { useTranslation } from "@/components/i18n-context";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useBookmark } from "@/hooks/bookmark/use-bookmark";
import { useTagManagement } from "@/hooks/tag/use-tag-management";
import BookmarkService from "@/services/bookmark-service";
import { ExternalLink, Search, Tag } from "lucide-react";
import React from "react";

import BookmarkFavicon from "~components/bookmark/bookmark-favicon";

interface SearchCommandProps {
  onClose?: () => void;
  onSelectTab?: (tab: "tags" | "bookmarks") => void;
}

const SearchCommand: React.FC<SearchCommandProps> = ({ onClose, onSelectTab }) => {
  const { t } = useTranslation();
  const { openableBookmarks, getBookmarkById } = useBookmark();
  const { tags, getTagById, setSelectedTag } = useTagManagement();

  const handleSelect = async (type: "bookmark" | "tag", id: string) => {
    if (type === "bookmark") {
      const bookmark = await getBookmarkById(id);
      if (bookmark?.url) {
        BookmarkService.getInstance().createTab(bookmark.url);
        onSelectTab?.("bookmarks");
      }
    } else {
      const tag = getTagById(id);
      if (tag) {
        setSelectedTag(tag);
        onSelectTab?.("tags");
      }
    }
    onClose?.();
  };

  return (
    <Command className="rounded-lg border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm mt-4">
      <div className="flex items-center border-b px-3 w-full">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandInput placeholder={t("main_layout_search")} className="border-none focus:ring-0" />
      </div>
      <CommandList>
        <CommandEmpty>{t("search_command_no_results")}</CommandEmpty>
        <CommandGroup heading={t("search_command_tags")} className="px-2">
          {tags.map((tag) => (
            <CommandItem key={tag.id} value={tag.name} onSelect={() => handleSelect("tag", tag.id)} className="flex items-center px-2 py-1.5 rounded-md">
              <Tag className="flex-shrink-0 mr-2 h-4 w-4" />
              <div className="flex-1 min-w-0">
                <span className="truncate">{tag.name}</span>
                {tag.fullPath && <span className="ml-2 text-xs text-muted-foreground truncate">{tag.fullPath}</span>}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={t("search_command_bookmarks")} className="px-2">
          {openableBookmarks.map((bookmark) => (
            <CommandItem
              key={bookmark.id}
              value={`${bookmark.title} ${bookmark.url}`}
              onSelect={() => handleSelect("bookmark", bookmark.id)}
              className="flex items-center justify-between px-2 py-1.5 rounded-md">
              <div className="flex items-center flex-1 min-w-0">
                <BookmarkFavicon url={bookmark.url || ""} className="flex-shrink-0 w-4 h-4 mr-2" />
                <span className="truncate">{bookmark.title}</span>
              </div>
              {bookmark.url && <ExternalLink className="flex-shrink-0 ml-2 h-3 w-3 text-muted-foreground" />}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

SearchCommand.displayName = "SearchCommand";

export default SearchCommand;
