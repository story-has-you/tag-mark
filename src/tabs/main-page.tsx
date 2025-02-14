import React from "react";

import "@/styles/global.css";

import BookmarkManager from "@/components/bookmark/bookmark-manager";
import { Toaster } from "@/components/ui/toaster";

const MainPage: React.FC = () => {
  return (
    <>
      <Toaster />
      <BookmarkManager />
    </>
  );
};

MainPage.displayName = "MainPage";

export default MainPage;
