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

  // 定义所有应用快捷键
  const hotkeys: HotkeyConfig[] = [
    {
      key: "mod+k",
      handler: onSearch,
      description: "打开搜索",
      group: "search"
    },
    {
      key: "mod+o",
      handler: onOpenAll,
      description: "打开所有书签",
      group: "bookmark"
    },
    {
      key: "mod+e",
      handler: onEdit,
      description: "编辑书签",
      group: "bookmark"
    },
    {
      key: "mod+delete",
      handler: onDelete,
      description: "删除书签",
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
