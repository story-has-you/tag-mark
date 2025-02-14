// resizer.tsx
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface ResizerProps {
  onResize: (delta: number) => void;
  className?: string;
}

const Resizer: React.FC<ResizerProps> = ({ onResize, className }) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.pageX;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.pageX - startX;
      onResize(delta);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <Separator
      orientation="vertical"
      className={cn(
        "w-1 cursor-col-resize transition-colors duration-150",
        isResizing && "bg-primary",
        "hover:bg-primary/70",
        "active:bg-primary",
        className
      )}
      onMouseDown={handleMouseDown}
    />
  );
};

Resizer.displayName = "Resizer";

export default Resizer;
