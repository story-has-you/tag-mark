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
    (messageName: string): string => {
      // 首先尝试从我们加载的消息中获取
      const message = messages[messageName];
      if (message) {
        return message;
      }

      // 然后尝试从Chrome API获取（作为后备）
      const chromeMessage = chrome.i18n.getMessage(messageName);
      if (chromeMessage) {
        return chromeMessage;
      }

      // 最后返回键名作为后备
      return messageName;
    },
    [messages]
  );

  // 增强版格式化消息函数 - 处理多种占位符格式
  const formatMessage = useCallback(
    (messageName: string, ...args: string[]): string => {
      let template = getMessage(messageName);

      if (!template) return messageName;

      // 处理两种占位符格式:

      // 1. 处理序号占位符，如 $1, $2, ...
      args.forEach((arg, index) => {
        const placeholderRegex = new RegExp(`\\$${index + 1}`, "g");
        template = template.replace(placeholderRegex, arg);
      });

      // 2. 处理命名占位符，如 $BOOKMARK_TITLE$, $TAG_NAME$
      // 这是特殊处理，我们假设第一个参数用于替换消息中的第一个命名占位符
      if (args.length > 0) {
        // 查找第一个 $NAME$ 格式的占位符
        const namedPlaceholderRegex = /\$[A-Z_]+\$/;
        const match = template.match(namedPlaceholderRegex);

        if (match && match[0]) {
          template = template.replace(match[0], args[0]);
        }
      }

      return template;
    },
    [getMessage]
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
    messages,
    getMessage,
    formatMessage,
    changeLocale
  };
};
