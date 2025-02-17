import TagService from "~services/tag-service";
import type { Tag } from "~types/tag";

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
    const paths: string[] = [];
    let currentTag: Tag | undefined = tag;
    while (currentTag) {
      // 检测循环引用
      if (visited.has(currentTag.id)) {
        throw new Error(`检测到标签循环引用: ${currentTag.name}`);
      }

      // 记录已访问的标签
      visited.add(currentTag.id);
      paths.unshift(currentTag.name);

      // 查找父标签
      currentTag = currentTag.parentId ? allTags.find((t) => t.id === currentTag?.parentId) : undefined;
    }

    return paths.join("/");
  }
}

export default TagName;
