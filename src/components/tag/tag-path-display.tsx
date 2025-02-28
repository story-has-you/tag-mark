import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import React from "react";

interface TagPathDisplayProps {
  path: string;
  className?: string;
  highlightLast?: boolean;
}

const TagPathDisplay: React.FC<TagPathDisplayProps> = ({ path, className, highlightLast = true }) => {
  // 移除开头的 # 符号，并分割路径
  const cleanPath = path.startsWith("#") ? path.substring(1) : path;
  const segments = cleanPath.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center flex-wrap text-sm", className)}>
      <span className="text-primary/70">#</span>
      {segments.map((segment, index) => (
        <React.Fragment key={index}>
          <span className={cn("mx-0.5", highlightLast && index === segments.length - 1 ? "font-medium text-foreground" : "text-muted-foreground")}>{segment}</span>
          {index < segments.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground mx-0.5" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TagPathDisplay;
