/**
 * 安全地序列化数据进行存储
 * @param data 要存储的数据
 * @returns 序列化后的安全字符串
 */
export const safeSerialize = (data: any): string => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error("序列化数据失败:", error);
    return "";
  }
};

/**
 * 安全地反序列化存储的数据
 * @param data 序列化的数据字符串
 * @param defaultValue 解析失败时的默认值
 * @returns 解析后的数据或默认值
 */
export const safeDeserialize = <T>(data: string, defaultValue: T): T => {
  if (!data) {
    return defaultValue;
  }

  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.error("反序列化数据失败:", error);
    return defaultValue;
  }
};

/**
 * 安全地从存储中获取数据
 * @param key 存储键
 * @param defaultValue 默认值
 * @returns 解析后的数据或默认值
 */
export const safeGetFromStorage = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const result = await chrome.storage.local.get(key);

    if (!result[key]) {
      return defaultValue;
    }

    // 如果已经是对象，直接返回
    if (typeof result[key] === "object" && !Array.isArray(result[key])) {
      return result[key] as T;
    }

    // 如果是字符串，尝试解析
    if (typeof result[key] === "string") {
      return safeDeserialize<T>(result[key], defaultValue);
    }

    return result[key] as T;
  } catch (error) {
    console.error(`从存储中获取 ${key} 失败:`, error);
    return defaultValue;
  }
};

/**
 * 安全地将数据保存到存储
 * @param key 存储键
 * @param value 要存储的值
 * @returns 是否成功
 */
export const safeSetToStorage = async <T>(key: string, value: T): Promise<boolean> => {
  try {
    await chrome.storage.local.set({ [key]: value });
    return true;
  } catch (error) {
    console.error(`保存 ${key} 到存储失败:`, error);
    return false;
  }
};
