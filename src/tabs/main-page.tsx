import React, { lazy, Suspense } from "react";

import "@/styles/global.css";

import { I18nProvider } from "@/components/i18n-context";

// 懒加载主布局组件
const MainLayout = lazy(() => import("@/components/main-layout"));

const MainPage: React.FC = () => {
  return (
    <I18nProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen w-screen bg-background">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        }>
        <MainLayout />
      </Suspense>
    </I18nProvider>
  );
};

export default MainPage;
