/**
 * 清理可能包含 XSS 攻击的输入字符串
 * @param input 输入字符串
 * @returns 清理后的安全字符串
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== "string") {
    return "";
  }

  // 替换潜在危险的 HTML 字符
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
};

/**
 * 安全地呈现 HTML 内容
 * 仅当应用需要呈现用户提供的 HTML 时才使用此功能
 * @param html HTML 字符串
 * @returns 安全的 React 组件属性对象
 */
export const safeHtml = (html: string): { __html: string } => {
  // 使用 DOMPurify 库或类似工具来净化 HTML (需要额外安装)
  // 这里提供一个简单的实现，但在生产环境中应使用成熟的库
  const div = document.createElement("div");
  div.textContent = html;
  return { __html: div.innerHTML };
};

/**
 * 验证并清理标签名称
 * @param name 标签名称
 * @returns 清理后的安全标签名称
 */
export const sanitizeTagName = (name: string): string => {
  if (!name || typeof name !== "string") {
    return "";
  }

  // 移除 HTML 标签和脚本
  const cleaned = name.replace(/<[^>]*>/g, "");

  // 移除可能导致路径遍历的字符
  return cleaned.replace(/[\/\\]/g, "-");
};
