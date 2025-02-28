import { useTranslation } from "@/components/i18n-context"; // 添加导入
import { hotkeyEnabledAtom } from "@/store/settings";
import { useAtom } from "jotai";
import { useHotkeys } from "react-hotkeys-hook";

interface KeyboardShortcutOptions {
  onSearch?: () => void;
  onOpenAll?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export type HotkeyConfig = {
  key: string;
  handler?: () => void;
  description: string;
  group: "search" | "bookmark";
};

export const useKeyboardShortcut = ({ onSearch, onOpenAll, onEdit, onDelete }: KeyboardShortcutOptions) => {
  const [hotkeyEnabled, setHotkeyEnabled] = useAtom(hotkeyEnabledAtom);
  const { t } = useTranslation(); // 添加useTranslation

  // 定义所有应用快捷键
  const hotkeys: HotkeyConfig[] = [
    {
      key: "mod+k",
      handler: onSearch,
      description: t("hotkey_open_search"),
      group: "search"
    },
    {
      key: "mod+o",
      handler: onOpenAll,
      description: t("hotkey_open_all_bookmarks"),
      group: "bookmark"
    },
    {
      key: "mod+e",
      handler: onEdit,
      description: t("hotkey_edit_bookmark"),
      group: "bookmark"
    },
    {
      key: "mod+delete",
      handler: onDelete,
      description: t("hotkey_delete_bookmark"),
      group: "bookmark"
    }
  ];

  // 统一注册快捷键
  hotkeys.forEach(({ key, handler }) => {
    useHotkeys(
      key,
      (e) => {
        e.preventDefault();
        handler && handler();
      },
      {
        enableOnFormTags: true,
        enabled: hotkeyEnabled
      }
    );
  });

  // 返回快捷键状态和快捷键列表(方便显示快捷键提示)
  return {
    hotkeyEnabled,
    setHotkeyEnabled,
    hotkeys
  };
};
