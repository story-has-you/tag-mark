// favicon.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import React, { useState } from "react";

interface FaviconProps {
  url: string;
  size?: number;
  className?: string;
}

const Favicon: React.FC<FaviconProps> = ({ url, size = 16, className }) => {
  const [error, setError] = useState(false);

  // 从 URL 中获取域名
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  if (!url) {
    return (
      <Avatar className={cn("h-4 w-4", className)}>
        <AvatarFallback>
          <Globe className="h-3 w-3 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
    );
  }

  const domain = getDomain(url);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;

  return (
    <Avatar className={cn("h-4 w-4", className)}>
      <AvatarImage
        src={faviconUrl}
        alt={`${domain} favicon`}
        onError={() => setError(true)}
        className="object-contain"
      />
      <AvatarFallback>
        <Globe className="h-3 w-3 text-muted-foreground" />
      </AvatarFallback>
    </Avatar>
  );
};

Favicon.displayName = "Favicon";

export default Favicon;
