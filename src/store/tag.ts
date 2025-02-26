import type { Tag } from "@/types/tag";
import { atom } from "jotai";

export const tagsAtom = atom<Tag[]>([]);
export const selectedTagAtom = atom<Tag | null>();
