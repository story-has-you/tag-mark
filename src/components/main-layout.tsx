import ErrorBoundary from "@/components/error-boundary";
import { useTranslation } from "@/components/i18n-context";
import KeyboardShortcut from "@/components/keyboard-shortcut";
import LanguageSelector from "@/components/language-selector";
import SearchCommand from "@/components/search-command";
import SettingsPage from "@/components/settings/settings-page";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useTheme } from "@/hooks/use-theme";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Moon, Search, Settings, Sun, Tags } from "lucide-react";
import React, { lazy, Suspense, useState } from "react";

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

// 懒加载标签管理器和书签管理器
const BookmarkManager = lazy(() => import("@/components/bookmark/bookmark-manager"));
const TagManager = lazy(() => import("@/components/tag/tag-manager"));

const MainLayout: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"tags" | "bookmarks">("tags");
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // 添加通用加载组件
  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
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

                  {/* 主题切换按钮 */}
                  <Button variant="outline" size="icon" onClick={toggleTheme} className="bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50">
                    {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-slate-700" />}
                  </Button>

                  {/* 设置按钮 */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSettingsOpen(true)}
                    className="bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* 搜索弹窗 */}
              <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogContent className="p-0 gap-0 max-w-4xl w-[90vw] border-0 bg-transparent shadow-none">
                  <DialogTitle className="sr-only">{t("search_command_title")}</DialogTitle>
                  <SearchCommand onClose={() => setSearchOpen(false)} onSelectTab={setActiveTab} />
                  <DialogDescription />
                </DialogContent>
              </Dialog>

              {/* 设置弹窗 */}
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogContent className="p-0 max-w-4xl w-[90vw] max-h-[85vh] overflow-hidden">
                  <DialogTitle className="sr-only">{t("settings_title")}</DialogTitle>
                  <SettingsPage />
                  <DialogDescription />
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
                        <ErrorBoundary>
                          <Suspense fallback={<LoadingFallback />}>
                            <BookmarkManager />
                          </Suspense>
                        </ErrorBoundary>
                      </TabsContent>

                      <TabsContent value="tags" className="h-full m-0">
                        <ErrorBoundary>
                          <Suspense fallback={<LoadingFallback />}>
                            <TagManager />
                          </Suspense>
                        </ErrorBoundary>
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
