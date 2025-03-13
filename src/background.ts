// background.js
let isHomePageEnabled = false;

// 检查是否启用了起始页功能
async function checkHomePageSetting() {
  try {
    const result = await chrome.storage.local.get("tag-mark-home-page");
    isHomePageEnabled = result["tag-mark-home-page"] === true;
  } catch (error) {
    console.error("检查起始页设置失败:", error);
  }
}

// 监听浏览器启动事件
chrome.runtime.onStartup.addListener(async () => {
  await checkHomePageSetting();
  if (isHomePageEnabled) {
    // 查询当前浏览器中的标签页
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
      // 替换当前活动标签页
      chrome.tabs.update(tabs[0].id, { url: chrome.runtime.getURL("tabs/main-page.html") });
    } else {
      // 如果没有活动标签页，则创建一个
      chrome.tabs.create({ url: chrome.runtime.getURL("tabs/main-page.html") });
    }
  }
});

// 监听新标签页创建事件
chrome.tabs.onCreated.addListener(async (tab) => {
  await checkHomePageSetting();
  if (isHomePageEnabled && tab.pendingUrl === "chrome://newtab/") {
    // 如果新创建的标签页是空白的新标签页，则替换为Tag Mark页面
    chrome.tabs.update(tab.id, { url: chrome.runtime.getURL("tabs/main-page.html") });
  }
});

// 监听标签页URL更新事件
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // 只在URL完成加载时处理
  if (changeInfo.url === "chrome://newtab/") {
    await checkHomePageSetting();
    if (isHomePageEnabled) {
      // 如果标签页被更新为新标签页，则替换为Tag Mark页面
      chrome.tabs.update(tabId, { url: chrome.runtime.getURL("tabs/main-page.html") });
    }
  }
});

// 监听来自扩展的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateHomePageSetting") {
    isHomePageEnabled = message.enabled;
    sendResponse({ success: true });
    return true;
  }
});

// 初始化时检查设置
checkHomePageSetting();
