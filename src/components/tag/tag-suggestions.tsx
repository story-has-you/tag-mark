import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import type { Tag } from "@/types/tag";
import React, { useRef } from "react";

interface TagSuggestionsProps {
  value: string;
  suggestions: Tag[];
  onValueChange: (value: string) => void;
  onEnter: (value: string) => void;
  disabled?: boolean;
  allTags: Tag[];
  tags: Tag[];
}

const TagSuggestions: React.FC<TagSuggestionsProps> = ({ value, suggestions, onValueChange, onEnter, disabled, allTags, tags }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      onEnter(value.trim());
      onValueChange("");
    }
  };

  const handleAddClick = () => {
    if (value.trim()) {
      onEnter(value.trim());
      onValueChange("");
      // 保持输入框焦点
      inputRef.current?.focus();
    }
  };

  const handleSuggestionSelect = (tagName: string) => {
    onValueChange(tagName);
    // 保持输入框焦点
    inputRef.current?.focus();
  };

  const items = () => {
    const existingTagIds = new Set(tags.map((tag) => tag.id));
    const tagsToShow = suggestions.length > 0 ? suggestions : allTags;

    return tagsToShow
      .filter((tag) => !existingTagIds.has(tag.id))
      .map((tag) => (
        <CommandItem key={tag.id} onSelect={() => handleSuggestionSelect(tag.fullPath)} className="px-4 py-2 cursor-pointer">
          {tag.fullPath}
        </CommandItem>
      ));
  };

  return (
    <Command className="rounded-lg border shadow-md h-[200px]">
      <div className="flex items-center justify-between border-b">
        <CommandInput
          ref={inputRef}
          placeholder="输入标签名称，回车添加..."
          value={value}
          onValueChange={onValueChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="border-none focus:ring-0"
        />
        <Button variant="default" disabled={disabled || !value.trim()} onClick={handleAddClick}>
          添加标签
        </Button>
      </div>
      <CommandList className="max-h-[156px] overflow-y-auto">{items()}</CommandList>
    </Command>
  );
};

TagSuggestions.displayName = "TagSuggestions";

export default TagSuggestions;
