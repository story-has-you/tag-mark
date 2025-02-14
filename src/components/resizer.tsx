import React from "react";

interface ResizerProps {
  onResize: (delta: number) => void;
}

const Resizer: React.FC<ResizerProps> = ({ onResize }) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.pageX;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.pageX - startX;
      onResize(delta);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 
        dark:hover:bg-blue-600 cursor-col-resize transition-colors"
      onMouseDown={handleMouseDown}
    />
  );
};

export default Resizer;
