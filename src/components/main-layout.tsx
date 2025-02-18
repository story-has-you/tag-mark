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
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState("bookmarks");
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <Toaster />

      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-white/50 dark:bg-slate-800/50 backdrop-blur supports-[backdrop-filter]:bg-white/50">
                <TabsTrigger value="bookmarks" className="gap-2 data-[state=active]:bg-slate-200/50 dark:data-[state=active]:bg-slate-700/50">
                  <Bookmark className="h-4 w-4" />
                  书签管理
                </TabsTrigger>
                <TabsTrigger value="tags" className="gap-2 data-[state=active]:bg-slate-200/50 dark:data-[state=active]:bg-slate-700/50">
                  <Tags className="h-4 w-4" />
                  标签管理
                </TabsTrigger>
              </TabsList>

              <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-4 hover:bg-slate-200/50 dark:hover:bg-slate-700/50">
                {theme === "dark" ? <Sun className="h-4 w-4 transition-all" /> : <Moon className="h-4 w-4 transition-all" />}
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeIn}
                transition={{ duration: 0.3 }}
                className="h-[calc(100dvh-8rem)] bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg p-6">
                <TabsContent value="bookmarks" className="h-full m-0">
                  <BookmarkManager />
                </TabsContent>

                <TabsContent value="tags" className="h-full m-0">
                  <TagManager />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

MainLayout.displayName = "MainLayout";

export default MainLayout;
