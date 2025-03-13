class HomePageService {
  private static instance: HomePageService;
  private readonly MAIN_PAGE_URL: string;

  private constructor() {
    this.MAIN_PAGE_URL = chrome.runtime.getURL("tabs/main-page.html");
  }

  public static getInstance(): HomePageService {
    if (!HomePageService.instance) {
      HomePageService.instance = new HomePageService();
    }
    return HomePageService.instance;
  }

  /**
   * 获取扩展的主页URL
   */
  public getExtensionHomeUrl(): string {
    return this.MAIN_PAGE_URL;
  }

  /**
   * 设置扩展在浏览器启动时自动打开
   */
  public async setAsHomePage(enabled: boolean): Promise<void> {
    try {
      // 存储设置
      await chrome.storage.local.set({ "tag-mark-home-page": enabled });

      // 通知后台脚本更新监听器状态
      chrome.runtime.sendMessage({
        action: "updateHomePageSetting",
        enabled: enabled
      });
    } catch (error) {
      console.error("设置起始页失败:", error);
      throw error;
    }
  }

  /**
   * 检查是否设置为起始页
   */
  public async isSetAsHomePage(): Promise<boolean> {
    try {
      const result = await chrome.storage.local.get("tag-mark-home-page");
      return result["tag-mark-home-page"] === true;
    } catch (error) {
      console.error("检查起始页设置失败:", error);
      return false;
    }
  }
}

export default HomePageService;
