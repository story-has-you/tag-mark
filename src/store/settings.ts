// atoms/settings.ts
import { atomWithStorage } from "jotai/utils";

export const hotkeyEnabledAtom = atomWithStorage("hotkey-enabled", true);
