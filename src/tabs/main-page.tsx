import React from "react";

import "@/styles/global.css";

import BookmarkManager from "@/components/bookmark/bookmark-manager";

const MainPage: React.FC = () => {
  return <BookmarkManager />;
};

MainPage.displayName = "MainPage";

export default MainPage;
