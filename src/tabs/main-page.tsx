import React from "react";

import "@/styles/global.css";

import { I18nProvider } from "@/components/i18n-context";
import MainLayout from "@/components/main-layout";

const MainPage: React.FC = () => {
  return (
    <I18nProvider>
      <MainLayout />
    </I18nProvider>
  );
};

MainPage.displayName = "MainPage";

export default MainPage;
