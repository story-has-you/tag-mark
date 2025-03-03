import { useTranslation } from "@/components/i18n-context";
import HotkeysList from "@/components/settings/hotkeys-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useKeyboardShortcut } from "@/hooks/use-hotkeys";
import { useToast } from "@/hooks/use-toast";
import DataTransferService from "@/services/data-transfer-service";
import { Download, FileUp, Keyboard } from "lucide-react";
import React, { useRef } from "react";

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { hotkeyEnabled, setHotkeyEnabled, hotkeys } = useKeyboardShortcut({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dataTransferService = DataTransferService.getInstance();

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
    <>
      <ScrollArea className="max-h-[calc(85vh-80px)] px-6 pb-6">
        <div className="space-y-6 max-w-4xl mx-auto pb-6">
          <p className="text-muted-foreground">{t("settings_description")}</p>
          <Separator className="my-6" />

          {/* Keyboard Shortcuts Section */}
          <Card>
            <CardHeader>
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

              {/* Hotkeys List */}
              <HotkeysList hotkeys={hotkeys} />
            </CardContent>
          </Card>

          {/* Data Management Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t("settings_data_management")}</CardTitle>
              <CardDescription>{t("settings_data_management_description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{t("settings_export_data")}</h3>
                <p className="text-sm text-muted-foreground">{t("settings_export_data_description")}</p>
                <Button onClick={handleExport} className="gap-2">
                  <Download className="h-4 w-4" />
                  {t("settings_export_button")}
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
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
    </>
  );
};

SettingsPage.displayName = "SettingsPage";

export default SettingsPage;
