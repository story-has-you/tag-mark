// hooks/use-theme.ts
import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // 从 chrome.storage 读取保存的主题
    const initTheme = async () => {
      try {
        const result = await chrome.storage.local.get("theme");
        if (result.theme) {
          setTheme(result.theme);
          document.documentElement.classList.toggle("dark", result.theme === "dark");
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          setTheme("dark");
          document.documentElement.classList.add("dark");
          // 保存系统主题设置
          await chrome.storage.local.set({ theme: "dark" });
        }
      } catch (error) {
        console.error("Failed to initialize theme:", error);
      }
    };

    initTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      document.documentElement.classList.toggle("dark");
      // 使用 chrome.storage 保存新主题
      await chrome.storage.local.set({ theme: newTheme });
    } catch (error) {
      console.error("Failed to toggle theme:", error);
    }
  };

  return { theme, toggleTheme };
};
