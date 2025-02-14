import type { BookmarkTreeNode } from "@/types/bookmark";
import { atom } from "jotai";

export const bookmarksAtom = atom<BookmarkTreeNode[]>([]);
export const bookmarkLoadingAtom = atom<boolean>(false);
