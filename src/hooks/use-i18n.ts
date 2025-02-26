import { useCallback, useEffect, useState } from "react";

// 创建内存缓存存储所有已加载语言的消息
const messagesCache: Record<string, Record<string, string>> = {};

export const useI18n = () => {
  const [locale, setLocale] = useState<string>("en");
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // 加载特定语言的消息
  const loadMessages = useCallback(async (localeToLoad: string) => {
    try {
      // 如果已经缓存过这个语言，则直接使用缓存
      if (messagesCache[localeToLoad]) {
        setMessages(messagesCache[localeToLoad]);
        setIsLoaded(true);
        return;
      }

      // 否则尝试加载语言文件
      // 注意：在开发环境中动态导入可能更复杂，这里简化处理
      let localeMessages;
      try {
        // 通过fetch加载消息文件
        const response = await fetch(chrome.runtime.getURL(`_locales/${localeToLoad}/messages.json`));
        localeMessages = await response.json();
      } catch (error) {
        console.error(`Failed to load locale ${localeToLoad}, falling back to en:`, error);
        // 加载失败则尝试使用英语
        if (localeToLoad !== "en") {
          const fallbackResponse = await fetch(chrome.runtime.getURL("_locales/en/messages.json"));
          localeMessages = await fallbackResponse.json();
        } else {
          // 如果英语也加载失败，使用空对象
          localeMessages = {};
        }
      }

      // 解析消息对象
      const parsedMessages: Record<string, string> = {};
      for (const [key, value] of Object.entries(localeMessages)) {
        if (typeof value === "object" && value && "message" in value) {
          parsedMessages[key] = value.message as string;
        }
      }

      // 缓存消息并更新状态
      messagesCache[localeToLoad] = parsedMessages;
      setMessages(parsedMessages);
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setIsLoaded(true); // 即使出错也标记为已加载，避免无限加载循环
    }
  }, []);

  // 初始加载时获取用户语言偏好
  useEffect(() => {
    const initLocale = async () => {
      try {
        const result = await chrome.storage.local.get("userLocale");
        const initialLocale = result.userLocale || chrome.i18n.getUILanguage() || "en";
        setLocale(initialLocale);
        await loadMessages(initialLocale);
      } catch (error) {
        console.error("Failed to initialize locale:", error);
        setLocale("en");
        await loadMessages("en");
      }
    };

    initLocale();
  }, [loadMessages]);

  // 获取翻译消息的函数
  const getMessage = useCallback(
    (messageName: string, substitutions?: string | string[]) => {
      // 首先尝试从我们加载的消息中获取
      const message = messages[messageName];
      if (message) {
        // 简单替换占位符处理
        if (substitutions) {
          const subs = Array.isArray(substitutions) ? substitutions : [substitutions];
          let result = message;
          subs.forEach((sub, index) => {
            result = result.replace(`$${index + 1}`, sub);
          });
          return result;
        }
        return message;
      }

      // 然后尝试从Chrome API获取（作为后备）
      const chromeMessage = chrome.i18n.getMessage(messageName, substitutions);
      if (chromeMessage) {
        return chromeMessage;
      }

      // 最后返回键名作为后备
      return messageName;
    },
    [messages]
  );

  // 更改当前语言的函数
  const changeLocale = useCallback(
    async (newLocale: string) => {
      if (newLocale === locale) return; // 避免不必要的更新

      try {
        await chrome.storage.local.set({ userLocale: newLocale });
        await loadMessages(newLocale);
        setLocale(newLocale);
      } catch (error) {
        console.error("Failed to change locale:", error);
      }
    },
    [locale, loadMessages]
  );

  return {
    locale,
    isLoaded,
    getMessage,
    changeLocale,
    // 这是格式化函数，与getMessage功能类似但参数形式不同
    formatMessage: getMessage
  };
};
