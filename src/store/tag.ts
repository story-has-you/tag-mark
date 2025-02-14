import type { Tag } from "@/types/tag";
import { atom } from "jotai";

// 存储所有书签的标签映射关系
export const bookmarkTagsAtom = atom<Record<string, Tag[]>>({});
