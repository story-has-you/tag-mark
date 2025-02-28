import TagService from "@/services/tag-service";
import type { Tag } from "@/types/tag";

class TagName {
  private readonly paths: string[];
  private readonly fullPath: string;

  constructor(tagPath: string) {
    this.paths = tagPath
      .split("/")
      .map((t) => t.trim())
      .filter((t) => t);
    this.fullPath = tagPath.trim();
  }

  /**
   * 获取标签路径数组
   */
  public getPaths(): string[] {
    return this.paths;
  }

  /**
   * 获取完整的标签路径
   */
  public getFullPath(): string {
    return this.fullPath;
  }

  /**
   * 获取指定深度的部分路径
   */
  public getPathUntilDepth(depth: number): string {
    return this.paths.slice(0, depth + 1).join("/");
  }

  /**
   * 验证标签名称是否有效
   */
  public validate(): void {
    if (this.paths.length === 0) {
      throw new Error("标签名称不能为空");
    }
  }

  /**
   * 验证父标签
   */
  public validateParentTag(depth: number, parentId: string | undefined): void {
    if (depth > 0 && !parentId) {
      throw new Error(`父标签不存在: ${this.getPathUntilDepth(depth - 1)}`);
    }
  }

  /**
   * 检查是否为空
   */
  public isEmpty(): boolean {
    return this.paths.length === 0;
  }

  /**
   * 获取标签深度
   */
  public getDepth(): number {
    return this.paths.length;
  }

  /**
   * 获取指定深度的标签名
   */
  public getNameAtDepth(depth: number): string {
    return this.paths[depth];
  }

  /**
   * 根据标签对象构建完整的标签路径
   * @param tag 标签对象
   * @returns 完整的标签路径
   */
  public static async buildFullPath(tag: Tag): Promise<string> {
    return this.buildFullPathWithAllTags(tag, await TagService.getInstance().getAllTags());
  }

  public static buildFullPathWithAllTags(tag: Tag, allTags: Tag[]): string {
    const visited = new Set<string>();
    const path: Tag[] = []; // 记录完整路径以便于提供更好的错误信息
    let currentTag: Tag | undefined = tag;

    try {
      while (currentTag) {
        // 检测循环引用
        if (visited.has(currentTag.id)) {
          // 构建循环引用的路径信息，使错误信息更有用
          const cycleStart = path.findIndex((t) => t.id === currentTag!.id);
          const cyclePath =
            path
              .slice(cycleStart)
              .map((t) => t.name)
              .join(" → ") +
            " → " +
            currentTag.name;
          throw new Error(`检测到标签循环引用: ${cyclePath}`);
        }

        // 记录已访问的标签
        visited.add(currentTag.id);
        path.push(currentTag);

        // 查找父标签
        currentTag = currentTag.parentId ? allTags.find((t) => t.id === currentTag?.parentId) : undefined;
      }

      // 构建完整路径
      return (
        "#" +
        path
          .map((t) => t.name)
          .reverse()
          .join("/")
      );
    } catch (error) {
      // 发生循环引用或其他错误时，返回一个安全的替代值
      console.error("构建标签路径时出错:", error);

      // 如果是循环引用错误，返回一个包含警告的路径
      if (error instanceof Error && error.message.includes("循环引用")) {
        return "#" + tag.name + " (路径错误)";
      }

      // 对于其他错误，返回简单的标签名
      return "#" + tag.name;
    }
  }
}

export default TagName;
