// hooks/use-scroll-position.ts
import { useRef } from "react";

export const useScrollPosition = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  const saveScrollPosition = () => {
    if (parentRef.current) {
      scrollPositionRef.current = parentRef.current.scrollTop;
    }
  };

  const restoreScrollPosition = () => {
    if (parentRef.current) {
      parentRef.current.scrollTop = scrollPositionRef.current;
    }
  };

  return {
    parentRef,
    saveScrollPosition,
    restoreScrollPosition
  };
};
