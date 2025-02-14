import { Globe } from "lucide-react";
import React, { useState } from "react";

interface FaviconProps {
  url: string;
  size?: number;
}

const Favicon: React.FC<FaviconProps> = ({ url, size = 16 }) => {
  const [error, setError] = useState(false);

  if (error || !url) {
    return <Globe className="h-4 w-4 text-gray-500" />;
  }

  // 从 URL 中获取域名
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const domain = getDomain(url);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;

  return (
    <img
      src={faviconUrl}
      alt={`${domain} favicon`}
      width={size}
      height={size}
      className="min-w-[16px] min-h-[16px]"
      onError={() => setError(true)}
    />
  );
};

export default Favicon;
