import type { Tag } from "@/types/tag";
import { atom } from "jotai";

export const tagsAtom = atom<Tag[]>([]);
