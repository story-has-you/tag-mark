import { useTranslation } from "@/components/i18n-context";
import KeyboardShortcut from "@/components/keyboard-shortcut";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { HotkeyConfig } from "@/hooks/use-hotkeys";
import React from "react";

interface HotkeysListProps {
  hotkeys: HotkeyConfig[];
}

const HotkeysList: React.FC<HotkeysListProps> = ({ hotkeys }) => {
  const { t } = useTranslation();

  // Group hotkeys by category
  const groupedHotkeys = hotkeys.reduce<Record<string, HotkeyConfig[]>>((acc, hotkey) => {
    if (!acc[hotkey.group]) {
      acc[hotkey.group] = [];
    }
    acc[hotkey.group].push(hotkey);
    return acc;
  }, {});

  if (hotkeys.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("settings_no_hotkeys")}</p>;
  }

  const getGroupTitle = (group: string) => {
    switch (group) {
      case "search":
        return t("settings_hotkeys_search");
      case "bookmark":
        return t("settings_hotkeys_bookmark");
      default:
        return group;
    }
  };

  return (
    <Card className="border rounded-lg p-2">
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4 p-2">
          {Object.entries(groupedHotkeys).map(([group, groupHotkeys], index, array) => (
            <React.Fragment key={group}>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">{getGroupTitle(group)}</h4>
                <div className="space-y-2">
                  {groupHotkeys.map((hotkey) => (
                    <div key={hotkey.key} className="flex items-center justify-between py-1">
                      <span className="text-sm">{hotkey.description}</span>
                      <KeyboardShortcut
                        command={hotkey.key.includes("mod")}
                        alt={hotkey.key.includes("alt")}
                        shift={hotkey.key.includes("shift")}
                        keys={[hotkey.key.replace(/mod|alt|shift|\+/g, "")]}
                        size="md"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {index < array.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

HotkeysList.displayName = "HotkeysList";

export default HotkeysList;
