// src/components/bookmark/bookmark-favicon.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import React, { useEffect, useState } from "react";

interface FaviconProps {
  url: string;
  size?: number;
  className?: string;
}

const FAVICON_PROVIDERS = [
  // 定义多个 favicon 服务提供商，按优先级排序
  (domain: string) => `https://favicon.im/${domain}`,
  (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
  (domain: string) => `https://${domain}/favicon.ico` // 直接从网站域名获取
];

const BookmarkFavicon: React.FC<FaviconProps> = ({ url, size = 16, className }) => {
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [providerIndex, setProviderIndex] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);
  const [domain, setDomain] = useState<string>("");

  // 从 URL 中获取域名
  useEffect(() => {
    if (!url) {
      setDomain("");
      return;
    }

    try {
      const domainFromUrl = new URL(url).hostname;
      setDomain(domainFromUrl);
      setLoadFailed(false);
      setProviderIndex(0); // 重置为第一个提供商
    } catch {
      setDomain("");
      setLoadFailed(true);
    }
  }, [url]);

  // 根据当前提供商索引更新 favicon URL
  useEffect(() => {
    if (!domain || providerIndex >= FAVICON_PROVIDERS.length) {
      setCurrentUrl("");
      return;
    }

    const faviconUrlGenerator = FAVICON_PROVIDERS[providerIndex];
    setCurrentUrl(faviconUrlGenerator(domain));
  }, [domain, providerIndex]);

  // 处理图像加载失败
  const handleError = () => {
    // 如果当前提供商失败，尝试下一个
    if (providerIndex < FAVICON_PROVIDERS.length - 1) {
      setProviderIndex(providerIndex + 1);
    } else {
      setLoadFailed(true);
    }
  };

  // 如果没有 URL 或者所有服务提供商都失败了，显示默认图标
  if (!url || loadFailed) {
    return (
      <Avatar className={className}>
        <AvatarFallback>
          <Globe className={cn("text-muted-foreground", className)} />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={className}>
      {currentUrl && <AvatarImage src={currentUrl} alt={`${domain} favicon`} onError={handleError} className="object-contain" />}
      <AvatarFallback>
        <Globe className={cn("text-muted-foreground", className)} />
      </AvatarFallback>
    </Avatar>
  );
};

BookmarkFavicon.displayName = "BookmarkFavicon";

export default BookmarkFavicon;
