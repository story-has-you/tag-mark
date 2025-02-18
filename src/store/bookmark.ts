import type { BookmarkTreeNode } from "@/types/bookmark";
import { atom } from "jotai";

import type { Tag } from "@/types/tag";

export const bookmarksAtom = atom<BookmarkTreeNode[]>([]);
export const bookmarkLoadingAtom = atom<boolean>(false);
// 存储所有书签的标签映射关系
export const bookmarkTagsAtom = atom<Record<string, Tag[]>>({});
