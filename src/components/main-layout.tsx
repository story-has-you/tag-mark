import BookmarkManager from "@/components/bookmark/bookmark-manager";
import TagManager from "@/components/tag/tag-manager";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useTheme } from "@/hooks/use-theme";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Moon, Sun, Tags } from "lucide-react";
import React, { useState } from "react";

const fadeIn = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15
    }
  }
};

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState("bookmarks");
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/50 dark:from-slate-900 dark:via-indigo-900/20 dark:to-purple-900/20">
      <Toaster />

      <div className="relative">
        <div className="mx-auto max-w-[1600px] w-[95%] py-4">
          <div className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-white/80 dark:bg-slate-800/80">
                  <TabsTrigger value="bookmarks" className="gap-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Bookmark className="h-4 w-4" />
                    书签管理
                  </TabsTrigger>
                  <TabsTrigger value="tags" className="gap-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Tags className="h-4 w-4" />
                    标签管理
                  </TabsTrigger>
                </TabsList>

                <Button variant="outline" size="icon" onClick={toggleTheme} className="ml-4 bg-white/80 dark:bg-slate-800/80">
                  {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-slate-700" />}
                </Button>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={activeTab} initial="initial" animate="animate" exit="exit" variants={fadeIn} className="relative h-[calc(100dvh-7rem)]">
                  <div className="h-full rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                    {/* 毛玻璃背景层 */}
                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md" />

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
