/**
 * 检查 URL 是否有效
 * @param url 要检查的 URL 字符串
 * @returns 是否有效
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ["http:", "https:"].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

/**
 * 获取安全的域名
 * @param url URL 字符串
 * @returns 安全的域名字符串或空字符串
 */
export const getSafeDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return "";
  }
};

/**
 * 安全地编码 URL 参数
 * @param value 要编码的值
 * @returns 编码后的值
 */
export const safeEncodeURIComponent = (value: string): string => {
  try {
    return encodeURIComponent(value);
  } catch {
    // 如果编码失败，移除可能导致问题的字符
    return encodeURIComponent(value.replace(/[^\w\s-]/g, ""));
  }
};
