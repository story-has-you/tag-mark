import BookmarkManager from "@/components/bookmark/bookmark-manager";
import { useTranslation } from "@/components/i18n-context";
import KeyboardShortcut from "@/components/keyboard-shortcut";
import LanguageSelector from "@/components/language-selector";
import SearchCommand from "@/components/search-command";
import TagManager from "@/components/tag/tag-manager";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useKeyboardShortcut } from "@/hooks/use-hotkeys";
import { useTheme } from "@/hooks/use-theme";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Keyboard, Moon, Search, Sun, Tags } from "lucide-react";
import React, { useState } from "react";

const fadeIn = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

const MainLayout: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"tags" | "bookmarks">("tags");
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { hotkeyEnabled, setHotkeyEnabled } = useKeyboardShortcut({ onSearch: () => setSearchOpen(true) });

  return (
    <div className="min-h-screen relative main-layout-bg">
      <Toaster />

      <div className="relative">
        <div className="mx-auto max-w-[1600px] w-[95%] py-4">
          <div className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "tags" | "bookmarks")} className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-white/80 dark:bg-slate-800/80">
                  <TabsTrigger value="tags" className="gap-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Tags className="h-4 w-4" />
                    {t("main_layout_tag_management")}
                  </TabsTrigger>
                  <TabsTrigger value="bookmarks" className="gap-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Bookmark className="h-4 w-4" />
                    {t("main_layout_bookmark_management")}
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  {/* 搜索按钮 */}
                  <Button variant="outline" className="gap-2 bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50" onClick={() => setSearchOpen(true)}>
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("main_layout_search")}</span>
                    <KeyboardShortcut command keys={["K"]} />
                  </Button>

                  {/* 语言选择器 */}
                  <LanguageSelector />

                  {/* 快捷键开关 */}
                  <Button variant="outline" className="gap-2 bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                    <Keyboard className="h-4 w-4" />
                    <Switch checked={hotkeyEnabled} onCheckedChange={setHotkeyEnabled} />
                  </Button>

                  {/* 主题切换按钮 */}
                  <Button variant="outline" size="icon" onClick={toggleTheme} className="bg-white/80 dark:bg-slate-800/80">
                    {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-slate-700" />}
                  </Button>
                </div>
              </div>

              {/* 搜索弹窗 */}
              <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogContent className="p-4 gap-0 max-w-4xl w-[90vw]">
                  <DialogHeader>
                    <DialogTitle className="text-lg">{t("search_command_title")}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">{t("search_command_help")}</DialogDescription>
                  </DialogHeader>
                  <SearchCommand onClose={() => setSearchOpen(false)} onSelectTab={setActiveTab} />
                </DialogContent>
              </Dialog>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={activeTab} initial="initial" animate="animate" exit="exit" variants={fadeIn} className="relative h-[calc(100dvh-7rem)]">
                  <div className="h-full rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                    {/* 毛玻璃背景层 */}
                    <div className="absolute inset-0 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl" />

                    {/* 内容层 */}
                    <div className="relative h-full p-6">
                      <TabsContent value="bookmarks" className="h-full m-0">
                        <BookmarkManager />
                      </TabsContent>

                      <TabsContent value="tags" className="h-full m-0">
                        <TagManager />
                      </TabsContent>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

MainLayout.displayName = "MainLayout";

export default MainLayout;
