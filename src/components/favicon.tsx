import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe } from "lucide-react";
import React, { useState } from "react";

import { cn } from "~lib/utils";

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
      <Avatar className={className}>
        <AvatarFallback>
          <Globe className={cn("text-muted-foreground", className)} />
        </AvatarFallback>
      </Avatar>
    );
  }

  const domain = getDomain(url);
  const faviconUrl = `https://favicon.im/${domain}`;

  return (
    <Avatar className={className}>
      <AvatarImage
        src={faviconUrl}
        alt={`${domain} favicon`}
        onError={() => setError(true)}
        className="object-contain"
      />
      <AvatarFallback>
        <Globe className={cn("text-muted-foreground", className)} />
      </AvatarFallback>
    </Avatar>
  );
};

Favicon.displayName = "Favicon";

export default Favicon;
