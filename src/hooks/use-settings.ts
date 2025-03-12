import { settingsAtom } from "@/store/settings";
import type { SettingsStore } from "@/types/settings";
import { useAtom } from "jotai";
import { useCallback } from "react";

export function useSettings() {
  const [settings, setSettings] = useAtom(settingsAtom);

  // 通用设置更新函数
  const updateSetting = useCallback(
    <K extends keyof SettingsStore>(key: K, value: SettingsStore[K]) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value
      }));
    },
    [setSettings]
  );

  // 特定设置项的便捷更新函数
  const toggleHotkeyEnabled = useCallback(
    (enabled?: boolean) => {
      updateSetting("hotkeyEnabled", enabled !== undefined ? enabled : !settings.hotkeyEnabled);
    },
    [settings.hotkeyEnabled, updateSetting]
  );

  const toggleClickToOpen = useCallback(
    (enabled?: boolean) => {
      updateSetting("clickToOpenEnabled", enabled !== undefined ? enabled : !settings.clickToOpenEnabled);
    },
    [settings.clickToOpenEnabled, updateSetting]
  );

  // 新增：多颜色标签设置控制
  const toggleColoredTags = useCallback(
    (enabled?: boolean) => {
      updateSetting("coloredTagsEnabled", enabled !== undefined ? enabled : !settings.coloredTagsEnabled);
    },
    [settings.coloredTagsEnabled, updateSetting]
  );

  return {
    // 所有设置值
    settings,

    // 全局设置更新函数
    updateSetting,
    setSettings,

    // 各个设置项及其更新函数
    hotkeyEnabled: settings.hotkeyEnabled,
    toggleHotkeyEnabled,
    setHotkeyEnabled: (enabled: boolean) => updateSetting("hotkeyEnabled", enabled),

    clickToOpenEnabled: settings.clickToOpenEnabled,
    toggleClickToOpen,
    setClickToOpenEnabled: (enabled: boolean) => updateSetting("clickToOpenEnabled", enabled),

    // 新增：多颜色标签设置
    coloredTagsEnabled: settings.coloredTagsEnabled,
    toggleColoredTags,
    setColoredTagsEnabled: (enabled: boolean) => updateSetting("coloredTagsEnabled", enabled)
  };
}
