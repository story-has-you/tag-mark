// lib/utils/platform.ts
export const isMacOS = async (): Promise<boolean> => {
  try {
    const platformInfo = await chrome.runtime.getPlatformInfo();
    return platformInfo.os === "mac";
  } catch (error) {
    console.error("Failed to get platform info:", error);
    // 降级使用 userAgent
    return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
  }
};
