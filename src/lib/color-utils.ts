/**
 * 生成随机的HSL浅色
 * @returns HSL颜色字符串
 */
export const generatePastelColor = (): string => {
  // 随机色相 (0-360)
  const hue = Math.floor(Math.random() * 360);
  // 固定较高的饱和度 (60-80%)
  const saturation = Math.floor(Math.random() * 20) + 60;
  // 固定较高的亮度 (75-90%)，确保是浅色
  const lightness = Math.floor(Math.random() * 15) + 75;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};


/**
 * 获取基于颜色的文本颜色（黑色或白色）
 * @param color HSL颜色字符串
 * @returns 黑色或白色
 */
export const getTextColor = (color: string): string => {
  const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return "#000000";

  const lightness = parseInt(match[3], 10);
  // 如果亮度高于70%，使用黑色文本，否则使用白色
  return lightness > 70 ? "#000000" : "#ffffff";
};

/**
 * 为书签项创建更加深色和明显的渐变效果
 * @param colors 标签颜色数组
 * @returns CSS渐变字符串
 */
export const createBookmarkGradient = (colors: string[]): string => {
  if (!colors.length) return "none";

  // 单色处理
  if (colors.length === 1) {
    const color = colors[0];
    // 提取HSL值
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return `linear-gradient(135deg, ${color}40, ${color}30)`;

    const hue = parseInt(match[1], 10);
    const saturation = parseInt(match[2], 10);
    // 略微降低亮度以增加颜色深度
    const lightness1 = Math.max(parseInt(match[3], 10) - 5, 70);
    const lightness2 = Math.max(parseInt(match[3], 10) - 2, 72);

    // 创建带有透明度的渐变
    return `linear-gradient(135deg, hsla(${hue}, ${saturation}%, ${lightness1}%, 0.5), hsla(${hue}, ${saturation}%, ${lightness2}%, 0.3))`;
  }

  // 多色处理
  // 为每种颜色创建更深的变体并添加透明度
  const enhancedColors = colors.map((color) => {
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return `${color}60`; // 添加60%不透明度

    const hue = parseInt(match[1], 10);
    const saturation = parseInt(match[2], 10);
    // 降低亮度以使颜色更深
    const lightness = Math.max(parseInt(match[3], 10) - 8, 65);

    // 返回带透明度的深色版本
    return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.55)`;
  });

  // 创建更复杂的渐变
  // 使用两种不同的角度来混合颜色
  const mainGradient = `linear-gradient(135deg, ${enhancedColors.join(", ")})`;

  return mainGradient;
};
