import TagBookmarkRelationService from "@/services/tag-bookmark-relation-service";
import TagService from "@/services/tag-service";

/**
 * Service for handling data import and export operations
 */
class DataTransferService {
  private static instance: DataTransferService;

  // Keys of data we want to export/import
  private readonly STORAGE_KEYS = ["tags", "tag_bookmark_relations"];

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): DataTransferService {
    if (!DataTransferService.instance) {
      DataTransferService.instance = new DataTransferService();
    }
    return DataTransferService.instance;
  }

  /**
   * Export all extension data to a JSON file
   */
  public async exportData(): Promise<void> {
    try {
      // Get all the relevant data from Chrome storage
      const data = await chrome.storage.local.get(this.STORAGE_KEYS);

      // Create a JSON file with timestamp in the name
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `tagmark-backup-${timestamp}.json`;

      // Convert data to Blob
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export data:", error);
      throw new Error("Export failed");
    }
  }

  /**
   * Import data from a JSON file into the extension
   */
  public async importData(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          if (!event.target?.result) {
            throw new Error("Failed to read file");
          }

          // Parse the imported JSON data
          const importedData = JSON.parse(event.target.result as string);

          // Validate the data structure
          if (!this.validateImportData(importedData)) {
            throw new Error("Invalid data format");
          }

          // Store the imported data in Chrome storage
          await chrome.storage.local.set(importedData);

          // Refresh tag services to update in-memory data
          await this.refreshServices();

          resolve();
        } catch (error) {
          console.error("Import error:", error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Validate the imported data has the correct structure
   */
  private validateImportData(data: any): boolean {
    // Ensure all required keys exist
    for (const key of this.STORAGE_KEYS) {
      if (!data[key] || !Array.isArray(data[key])) {
        return false;
      }
    }

    // Validate tags data structure
    if (data.tags && Array.isArray(data.tags)) {
      for (const tag of data.tags) {
        if (!tag.id || typeof tag.name !== "string") {
          return false;
        }
      }
    }

    // Validate relations data structure
    if (data.tag_bookmark_relations && Array.isArray(data.tag_bookmark_relations)) {
      for (const relation of data.tag_bookmark_relations) {
        if (!relation.tagId || !relation.bookmarkId) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Refresh services after import to update in-memory data
   */
  private async refreshServices(): Promise<void> {
    try {
      // Get instances of services to refresh their data
      const tagService = TagService.getInstance();
      const relationService = TagBookmarkRelationService.getInstance();

      // Force a reload of the data
      // This will trigger any listeners like useTagManagement hook
      await tagService.getAllTags();
      await relationService.getAllRelations();
    } catch (error) {
      console.error("Failed to refresh services:", error);
    }
  }
}

export default DataTransferService;
