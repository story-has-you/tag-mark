import { useI18n } from "@/hooks/use-i18n";
import React, { createContext, useContext, useMemo, type ReactNode } from "react";

interface I18nContextType {
  locale: string;
  isLoaded: boolean;
  t: (messageName: string) => string;
  format: (messageName: string, ...args: string[]) => string;
  changeLocale: (locale: string) => Promise<void>;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  isLoaded: false,
  t: (key) => key,
  format: (key) => key,
  changeLocale: async () => {}
});

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { locale, isLoaded, getMessage, formatMessage, changeLocale } = useI18n();

  // 使用useMemo优化性能
  const contextValue = useMemo(
    () => ({
      locale,
      isLoaded,
      t: getMessage,
      format: formatMessage,
      changeLocale
    }),
    [locale, isLoaded, getMessage, formatMessage, changeLocale]
  );

  // 添加一个加载指示器
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

export const useTranslation = () => useContext(I18nContext);
