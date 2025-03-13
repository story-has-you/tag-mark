import type { SettingsStore } from "@/types/settings";
import { atomWithStorage } from "jotai/utils";

// 默认设置值
const defaultSettings: SettingsStore = {
  hotkeyEnabled: false,
  clickToOpenEnabled: false,
  coloredTagsEnabled: false,
  isHomePage: false
};

// 创建存储服务
const settingsStorage = {
  getItem: async (key: string): Promise<SettingsStore | null> => {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key] ?? defaultSettings;
    } catch (error) {
      console.error("Failed to get settings from chrome storage:", error);
      return defaultSettings;
    }
  },

  setItem: async (key: string, value: SettingsStore): Promise<void> => {
    try {
      await chrome.storage.local.set({ [key]: value });
    } catch (error) {
      console.error("Failed to set settings in chrome storage:", error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await chrome.storage.local.remove(key);
    } catch (error) {
      console.error("Failed to remove settings from chrome storage:", error);
    }
  }
};

// 创建设置原子
export const settingsAtom = atomWithStorage<SettingsStore>("tagmark-settings", defaultSettings, settingsStorage);
