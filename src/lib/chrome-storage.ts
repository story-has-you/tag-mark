import type { AsyncStorage } from "jotai/vanilla/utils/atomWithStorage";

const hotkeyEnabledChromeStorage: AsyncStorage<boolean> = {
  getItem: async (key: string): Promise<boolean | null> => {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key] ?? false;
    } catch (error) {
      console.error("Failed to get item from chrome storage:", error);
      return false;
    }
  },

  setItem: async (key: string, value: boolean): Promise<void> => {
    try {
      await chrome.storage.local.set({ [key]: value });
    } catch (error) {
      console.error("Failed to set item in chrome storage:", error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await chrome.storage.local.remove(key);
    } catch (error) {
      console.error("Failed to remove item from chrome storage:", error);
    }
  }
};

export default hotkeyEnabledChromeStorage;
