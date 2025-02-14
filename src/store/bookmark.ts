import type { BookmarkNode } from "@/types/bookmark";
import { atom } from "jotai";

export const bookmarksAtom = atom<BookmarkNode[]>([]);
export const bookmarkLoadingAtom = atom<boolean>(false);
