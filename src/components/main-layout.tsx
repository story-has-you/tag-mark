// main-layout.tsx
import BookmarkManager from "@/components/bookmark/bookmark-manager";
import SearchCommand from "@/components/search-command";
import TagManager from "@/components/tag/tag-manager";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useTheme } from "@/hooks/use-theme";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Moon, Search, Sun, Tags } from "lucide-react";
import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

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
  const [activeTab, setActiveTab] = useState<"tags" | "bookmarks">("tags");
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // 添加快捷键支持
  useHotkeys(
    "mod+k",
    (e) => {
      e.preventDefault();
      setSearchOpen(true);
    },
    { enableOnFormTags: true }
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
                    标签管理
                  </TabsTrigger>
                  <TabsTrigger value="bookmarks" className="gap-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Bookmark className="h-4 w-4" />
                    书签管理
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  {/* 搜索按钮 */}
                  <Button variant="outline" className="gap-2 bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50" onClick={() => setSearchOpen(true)}>
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">搜索...</span>
                    <kbd className="hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border border-slate-200/50 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-xs font-medium">
                      <span className="text-xs">⌘</span>
                      <span className="text-xl">K</span>
                    </kbd>
                  </Button>

                  {/* 主题切换按钮 */}
                  <Button variant="outline" size="icon" onClick={toggleTheme} className="bg-white/80 dark:bg-slate-800/80">
                    {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-slate-700" />}
                  </Button>
                </div>
              </div>

              {/* 搜索弹窗 */}
              <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogTitle></DialogTitle>
                <DialogContent className="p-0 gap-0 max-w-2xl">
                  <SearchCommand onClose={() => setSearchOpen(false)} onSelectTab={setActiveTab} />
                </DialogContent>
                <DialogDescription></DialogDescription>
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
