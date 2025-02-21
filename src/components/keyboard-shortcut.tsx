// components/ui/keyboard-shortcut.tsx
import { useKeyboardShortcut } from "@/hooks/use-hotkeys";
import { isMacOS } from "@/lib/platform";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface KeyboardShortcutProps {
  command?: boolean;
  alt?: boolean;
  shift?: boolean;
  ctrl?: boolean;
  keys?: string[];
  className?: string;
  size?: "sm" | "md" | "lg";
}

const KeyboardShortcut: React.FC<KeyboardShortcutProps> = ({ command = false, alt = false, shift = false, ctrl = false, keys = [], className, size = "sm" }) => {
  const [isMac, setIsMac] = useState(false);
  const { hotkeyEnabled } = useKeyboardShortcut({});

  useEffect(() => {
    isMacOS().then(setIsMac);
  }, []);

  const getCommandKey = () => {
    if (isMac) {
      return "⌘";
    }
    return "Ctrl";
  };

  const getAltKey = () => {
    if (isMac) {
      return "⌥";
    }
    return "Alt";
  };

  const getShiftKey = () => {
    if (isMac) {
      return "⇧";
    }
    return "Shift";
  };

  const renderKey = (key: string, index: number) => {
    const isSpecialKey = ["⌘", "⌥", "⇧"].includes(key);
    const textSize = {
      sm: "text-xs",
      md: isSpecialKey ? "text-sm" : "text-base",
      lg: isSpecialKey ? "text-base" : "text-lg"
    }[size];

    return (
      <React.Fragment key={key}>
        <span className={textSize}>{key.length === 1 ? key.toUpperCase() : key}</span>
        {index < allKeys.length - 1 && <span className={cn(textSize, "mx-1")}>+</span>}
      </React.Fragment>
    );
  };

  const allKeys = [...(command ? [getCommandKey()] : []), ...(alt ? [getAltKey()] : []), ...(shift ? [getShiftKey()] : []), ...(ctrl ? ["Ctrl"] : []), ...keys];

  const sizeClasses = {
    sm: "h-5 px-1.5",
    md: "h-6 px-2",
    lg: "h-7 px-2.5"
  }[size];

  if (!hotkeyEnabled) {
    return <></>;
  }

  return (
    <kbd
      className={cn(
        "hidden sm:inline-flex pointer-events-none select-none items-center gap-1",
        "rounded border px-1.5 py-0.5",
        "bg-slate-50/30 border-slate-200/20 text-slate-700",
        "dark:bg-slate-900/30 dark:border-slate-700/20 dark:text-slate-300",
        "backdrop-blur-[2px]",
        sizeClasses,
        className
      )}>
      {allKeys.map(renderKey)}
    </kbd>
  );
};

KeyboardShortcut.displayName = "KeyboardShortcut";

export default KeyboardShortcut;
