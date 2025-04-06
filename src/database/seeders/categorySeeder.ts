import db from "../db";
import { Category } from "../../models";
import { CategoryRepository } from "../../repositories/CategoryRepository";

/**
 * CategorySeeder class for populating the category table with initial data
 */
export class CategorySeeder {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  /**
   * Check if categories already exist in the database
   */
  private async hasCategories(): Promise<boolean> {
    const count = db
      .prepare("SELECT COUNT(*) as count FROM category")
      .get() as { count: number };

    return count.count > 0;
  }

  /**
   * Seed the database with predefined categories
   */
  async seed(): Promise<void> {
    // Skip if categories already exist
    const hasExistingData = await this.hasCategories();
    if (hasExistingData) {
      console.log("Categories already seeded, skipping...");
      return;
    }

    // Create categories in a transaction
    try {
      const insertCategory = db.prepare(
        "INSERT INTO category (name, description) VALUES (?, ?)"
      );

      const categories = [
        {
          name: "Electronics",
          description: "Electronic devices and gadgets",
        },
        {
          name: "Clothing",
          description: "Apparel and fashion items",
        },
        {
          name: "Home & Kitchen",
          description: "Home decor and kitchen appliances",
        },
        {
          name: "Books",
          description: "Books and literature",
        },
        {
          name: "Sports & Outdoors",
          description: "Sporting goods and outdoor equipment",
        },
        {
          name: "Beauty & Personal Care",
          description: "Cosmetics, skincare, and personal care products",
        },
        {
          name: "Toys & Games",
          description: "Toys, board games, and entertainment items",
        },
        {
          name: "Health & Wellness",
          description: "Health supplements and wellness products",
        },
        {
          name: "Grocery & Gourmet",
          description: "Food and beverage products",
        },
        {
          name: "Office Supplies",
          description: "Office and stationery products",
        },
      ];

      // Begin transaction
      const transaction = db.transaction(() => {
        categories.forEach((category) => {
          insertCategory.run(category.name, category.description);
        });
      });

      // Execute transaction
      transaction();

      console.log(`Seeded ${categories.length} categories successfully`);
    } catch (error) {
      console.error("Error seeding categories:", error);
      throw error;
    }
  }

  /**
   * Reset the category table by removing all entries
   */
  async reset(): Promise<void> {
    try {
      // Delete all categories
      db.prepare("DELETE FROM category").run();
      console.log("All categories have been removed");
    } catch (error) {
      console.error("Error resetting categories:", error);
      throw error;
    }
  }

  /**
   * Get all seeded categories
   */
  getAllCategories(): Category[] {
    return this.categoryRepository.findAll();
  }
}

// Usage example (can be called from a CLI command or initialization script)
// const seeder = new CategorySeeder();
// seeder.seed().catch(console.error);
