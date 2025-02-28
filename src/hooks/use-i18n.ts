import { useCallback, useEffect, useState } from "react";

// 创建内存缓存存储所有已加载语言的消息
const messagesCache: Record<string, Record<string, string>> = {};

// 定义受支持的语言列表
const SUPPORTED_LOCALES = ["en", "zh"];

// 安全地验证语言代码
const isValidLocale = (locale: string): boolean => {
  // 检查是否在支持的语言列表中
  if (!SUPPORTED_LOCALES.includes(locale)) {
    return false;
  }

  // 确保语言代码只包含字母和短横线
  return /^[a-zA-Z-]+$/.test(locale);
};

export const useI18n = () => {
  const [locale, setLocale] = useState<string>("en");
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // 加载特定语言的消息
  const loadMessages = useCallback(async (localeToLoad: string) => {
    try {
      // 安全验证语言代码
      if (!isValidLocale(localeToLoad)) {
        console.error(`不支持的或不安全的语言代码: ${localeToLoad}`);
        // 回退到默认语言
        localeToLoad = "en";
      }

      // 如果已经缓存过这个语言，则直接使用缓存
      if (messagesCache[localeToLoad]) {
        setMessages(messagesCache[localeToLoad]);
        setIsLoaded(true);
        return;
      }

      // 否则尝试加载语言文件
      let localeMessages;
      try {
        // 通过fetch加载消息文件，使用安全的路径构建
        const response = await fetch(chrome.runtime.getURL(`_locales/${localeToLoad}/messages.json`));

        // 检查响应状态
        if (!response.ok) {
          throw new Error(`Failed to load locale: HTTP status ${response.status}`);
        }

        localeMessages = await response.json();
      } catch (error) {
        console.error(`Failed to load locale ${localeToLoad}, falling back to en:`, error);
        // 加载失败则尝试使用英语
        if (localeToLoad !== "en") {
          const fallbackResponse = await fetch(chrome.runtime.getURL("_locales/en/messages.json"));
          if (fallbackResponse.ok) {
            localeMessages = await fallbackResponse.json();
          } else {
            // 如果英语也加载失败，使用空对象
            localeMessages = {};
          }
        } else {
          // 如果英语也加载失败，使用空对象
          localeMessages = {};
        }
      }

      // 解析消息对象
      const parsedMessages: Record<string, string> = {};
      for (const [key, value] of Object.entries(localeMessages)) {
        if (typeof value === "object" && value !== null && "message" in value && typeof value.message === "string") {
          // 验证消息内容，防止 XSS 注入
          parsedMessages[key] = value.message;
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

  // 初始加载时获取用户语言偏好，增加安全检查
  useEffect(() => {
    const initLocale = async () => {
      try {
        const result = await chrome.storage.local.get("userLocale");
        let initialLocale = result.userLocale || chrome.i18n.getUILanguage() || "en";

        // 确保初始语言是有效的
        if (!isValidLocale(initialLocale)) {
          console.warn(`检测到不支持的语言: ${initialLocale}，使用默认语言 en`);
          initialLocale = "en";
        }

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
      // 对消息名称进行验证
      if (typeof messageName !== "string" || !messageName) {
        return "";
      }

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

  // 增强版格式化消息函数 - 处理多种占位符格式，增加安全检查
  const formatMessage = useCallback(
    (messageName: string, ...args: string[]): string => {
      // 安全检查
      if (typeof messageName !== "string" || !messageName) {
        return "";
      }

      let template = getMessage(messageName);
      if (!template) return messageName;

      // 安全地处理参数
      const safeArgs = args.map((arg) => (typeof arg === "string" ? arg : String(arg)));

      // 处理两种占位符格式:
      // 1. 处理序号占位符，如 $1, $2, ...
      safeArgs.forEach((arg, index) => {
        const placeholderRegex = new RegExp(`\\$${index + 1}`, "g");
        template = template.replace(placeholderRegex, arg);
      });

      // 2. 处理命名占位符，如 $BOOKMARK_TITLE$, $TAG_NAME$
      if (safeArgs.length > 0) {
        // 查找第一个 $NAME$ 格式的占位符
        const namedPlaceholderRegex = /\$[A-Z_]+\$/;
        const match = template.match(namedPlaceholderRegex);

        if (match && match[0]) {
          template = template.replace(match[0], safeArgs[0]);
        }
      }

      return template;
    },
    [getMessage]
  );

  // 更改当前语言的函数，增加安全检查
  const changeLocale = useCallback(
    async (newLocale: string) => {
      if (!isValidLocale(newLocale)) {
        console.error(`尝试切换到不支持的语言: ${newLocale}`);
        return;
      }

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
    changeLocale,
    supportedLocales: SUPPORTED_LOCALES // 暴露支持的语言列表
  };
};
