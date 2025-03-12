// 定义设置接口
export interface SettingsStore {
  hotkeyEnabled: boolean;
  clickToOpenEnabled: boolean;
  coloredTagsEnabled: boolean; // 新增：多颜色标签设置
}