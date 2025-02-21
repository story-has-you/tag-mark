// components/search/search-command.tsx
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useBookmark } from "@/hooks/bookmark/use-bookmark";
import { useTagManagement } from "@/hooks/tag/use-tag-management";
import { Bookmark, ExternalLink, Tag } from "lucide-react";
import React from "react";

interface SearchCommandProps {
  onClose?: () => void;
  onSelectTab?: (tab: "tags" | "bookmarks") => void;
}

const SearchCommand: React.FC<SearchCommandProps> = ({ onClose, onSelectTab }) => {
  const { bookmarks, getBookmarkById } = useBookmark();
  const { tags, getTagById } = useTagManagement();

  const handleSelect = async (type: "bookmark" | "tag", id: string) => {
    if (type === "bookmark") {
      const bookmark = await getBookmarkById(id);
      if (bookmark?.url) {
        window.open(bookmark.url, "_blank");
        onSelectTab?.("bookmarks");
      }
    } else {
      const tag = getTagById(id);
      if (tag) {
        onSelectTab?.("tags");
        // TODO: 可以添加高亮选中标签的逻辑
      }
    }
    onClose?.();
  };

  return (
    <Command className="rounded-lg border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CommandInput placeholder="搜索标签或书签..." className="border-none focus:ring-0" />
      <CommandList>
        <CommandEmpty>未找到相关结果</CommandEmpty>
        <CommandGroup heading="书签" className="px-2">
          {bookmarks.map((bookmark) => (
            <CommandItem
              key={bookmark.id}
              value={bookmark.title}
              onSelect={() => handleSelect("bookmark", bookmark.id)}
              className="flex items-center justify-between px-2 py-1.5 rounded-md">
              <div className="flex items-center flex-1 min-w-0">
                <Bookmark className="flex-shrink-0 mr-2 h-4 w-4" />
                <span className="truncate">{bookmark.title}</span>
              </div>
              {bookmark.url && <ExternalLink className="flex-shrink-0 ml-2 h-3 w-3 text-muted-foreground" />}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="标签" className="px-2">
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
      </CommandList>
    </Command>
  );
};

SearchCommand.displayName = "SearchCommand";

export default SearchCommand;
