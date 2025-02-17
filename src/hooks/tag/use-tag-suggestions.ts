
// hooks/use-tag-suggestions.ts
import type { Tag } from "@/types/tag";
import { useEffect, useState } from "react";

export const useTagSuggestions = (allTags: Tag[], input: string) => {
  const [suggestions, setSuggestions] = useState<Tag[]>([]);

  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = allTags.filter(tag => 
      tag.name.toLowerCase().includes(input.toLowerCase())
    );
    setSuggestions(filtered);
  }, [input, allTags]);

  return suggestions;
};