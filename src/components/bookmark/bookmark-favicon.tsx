import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import React, { useEffect, useState } from "react";

interface FaviconProps {
  url: string;
  size?: number;
  className?: string;
}

// 安全地生成 favicon URL
const getFaviconUrl = (domain: string, providerIndex: number): string => {
  if (!domain) return "";

  // 安全地编码域名
  const encodedDomain = encodeURIComponent(domain);

  // 不同的 favicon 提供商
  const providers = [(d: string) => `https://favicon.im/${d}`, (d: string) => `https://www.google.com/s2/favicons?domain=${d}&sz=64`, (d: string) => `https://${d}/favicon.ico`];

  // 确保索引在有效范围内
  const safeIndex = Math.max(0, Math.min(providerIndex, providers.length - 1));

  return providers[safeIndex](encodedDomain);
};

const BookmarkFavicon: React.FC<FaviconProps> = ({ url, size = 16, className }) => {
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [providerIndex, setProviderIndex] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);
  const [domain, setDomain] = useState<string>("");

  // 从 URL 中获取域名，添加安全检查
  useEffect(() => {
    if (!url) {
      setDomain("");
      return;
    }

    try {
      // 验证 URL 格式
      const urlObj = new URL(url);

      // 只允许 http 和 https 协议
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        throw new Error("Unsupported protocol");
      }

      setDomain(urlObj.hostname);
      setLoadFailed(false);
      setProviderIndex(0);
    } catch {
      setDomain("");
      setLoadFailed(true);
    }
  }, [url]);

  // 更新 favicon URL，使用安全的 URL 生成函数
  useEffect(() => {
    if (!domain || providerIndex >= 3) {
      setCurrentUrl("");
      return;
    }

    setCurrentUrl(getFaviconUrl(domain, providerIndex));
  }, [domain, providerIndex]);

  // 处理图像加载失败
  const handleError = () => {
    if (providerIndex < 2) {
      setProviderIndex(providerIndex + 1);
    } else {
      setLoadFailed(true);
    }
  };

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
      {currentUrl && (
        <AvatarImage
          src={currentUrl}
          alt={`${domain} favicon`}
          onError={handleError}
          className="object-contain"
          crossOrigin="anonymous" // 添加跨域属性，增强安全性
        />
      )}
      <AvatarFallback>
        <Globe className={cn("text-muted-foreground", className)} />
      </AvatarFallback>
    </Avatar>
  );
};

BookmarkFavicon.displayName = "BookmarkFavicon";

export default BookmarkFavicon;
