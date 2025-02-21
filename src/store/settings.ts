import hotkeyEnabledChromeStorage from "@/lib/chrome-storage";
import { atomWithStorage } from "jotai/utils";

export const hotkeyEnabledAtom = atomWithStorage<boolean>("hotkey-enabled", true, hotkeyEnabledChromeStorage);
