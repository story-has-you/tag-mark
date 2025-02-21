import type { BookmarkTreeNode } from "@/types/bookmark";
import type { Tag } from "@/types/tag";
import { atom } from "jotai";

export const bookmarksAtom = atom<BookmarkTreeNode[]>([]);
export const bookmarkLoadingAtom = atom<boolean>(false);
// 存储所有书签的标签映射关系
export const bookmarkTagsAtom = atom<Record<string, Tag[]>>({});
export const selectedNodeAtom = atom<BookmarkTreeNode | null>();
