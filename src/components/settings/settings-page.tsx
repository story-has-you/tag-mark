import { useTranslation } from "@/components/i18n-context";
import HotkeysList from "@/components/settings/hotkeys-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useKeyboardShortcut } from "@/hooks/use-hotkeys";
import { useSettings } from "@/hooks/use-settings";
import { useToast } from "@/hooks/use-toast";
import DataTransferService from "@/services/data-transfer-service";
import { Download, FileUp, Keyboard, Settings } from "lucide-react";
import React, { useRef } from "react";

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { hotkeys } = useKeyboardShortcut({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dataTransferService = DataTransferService.getInstance();
  const { hotkeyEnabled, setHotkeyEnabled, clickToOpenEnabled, setClickToOpenEnabled } = useSettings();

  const handleExport = async () => {
    try {
      await dataTransferService.exportData();
      toast({
        title: t("settings_export_success_title"),
        description: t("settings_export_success_description")
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("settings_export_error_title"),
        description: t("settings_export_error_description")
      });
      console.error("Export error:", error);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await dataTransferService.importData(file);
      toast({
        title: t("settings_import_success_title"),
        description: t("settings_import_success_description")
      });
      // Reset the input value to allow importing the same file again
      event.target.value = "";
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("settings_import_error_title"),
        description: t("settings_import_error_description")
      });
      console.error("Import error:", error);
      // Reset the input value even on error
      event.target.value = "";
    }
  };

  return (
    <div className="flex flex-col h-[85vh]">
      {/* 添加标题栏 */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{t("settings_title")}</h2>
        </div>
      </div>

      {/* 内容区域 - 使用适合对话框的滚动区域 */}
      <ScrollArea className="flex-1 w-full">
        <div className="px-6 py-4 space-y-6 max-w-4xl mx-auto">
          <p className="text-muted-foreground">{t("settings_description")}</p>
          <Separator />

          {/* 键盘快捷键部分 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                {t("settings_keyboard_shortcuts")}
              </CardTitle>
              <CardDescription>{t("settings_keyboard_shortcuts_description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="keyboard-shortcut-toggle">{t("settings_enable_shortcuts")}</Label>
                  <p className="text-sm text-muted-foreground">{t("settings_enable_shortcuts_description")}</p>
                </div>
                <Switch id="keyboard-shortcut-toggle" checked={hotkeyEnabled} onCheckedChange={setHotkeyEnabled} />
              </div>

              <Separator />

              {/* 快捷键列表 */}
              <HotkeysList hotkeys={hotkeys} />

              {/* 添加新的点击打开书签设置项 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="click-to-open-toggle">{t("settings_click_to_open")}</Label>
                  <p className="text-sm text-muted-foreground">{t("settings_click_to_open_description")}</p>
                </div>
                <Switch id="click-to-open-toggle" checked={clickToOpenEnabled} onCheckedChange={setClickToOpenEnabled} />
              </div>
            </CardContent>
          </Card>

          {/* 数据管理部分 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{t("settings_data_management")}</CardTitle>
              <CardDescription>{t("settings_data_management_description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">{t("settings_export_data")}</h3>
                <p className="text-sm text-muted-foreground">{t("settings_export_data_description")}</p>
                <Button onClick={handleExport} className="gap-2">
                  <Download className="h-4 w-4" />
                  {t("settings_export_button")}
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-lg font-medium">{t("settings_import_data")}</h3>
                <p className="text-sm text-muted-foreground">{t("settings_import_data_description")}</p>
                <div className="flex items-center gap-2">
                  <Button onClick={handleImportClick} className="gap-2">
                    <FileUp className="h-4 w-4" />
                    {t("settings_import_button")}
                  </Button>
                  <input type="file" accept=".json" ref={fileInputRef} onChange={handleImportFile} className="hidden" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

SettingsPage.displayName = "SettingsPage";

export default SettingsPage;
