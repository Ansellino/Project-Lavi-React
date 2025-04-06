import db from "../database/db";
import { Category } from "../models";

export class CategoryRepository {
  findAll(): Category[] {
    return db
      .prepare("SELECT * FROM category ORDER BY name")
      .all() as Category[];
  }

  findById(id: number): Category | undefined {
    return db.prepare("SELECT * FROM category WHERE id = ?").get(id) as
      | Category
      | undefined;
  }

  create(
    category: Omit<Category, "id" | "created_at" | "updated_at">
  ): Category {
    const { lastInsertRowid } = db
      .prepare("INSERT INTO category (name, description) VALUES (?, ?)")
      .run(category.name, category.description);

    return this.findById(Number(lastInsertRowid))!;
  }

  update(
    id: number,
    category: Partial<Omit<Category, "id" | "created_at" | "updated_at">>
  ): Category | undefined {
    const current = this.findById(id);
    if (!current) return undefined;

    const { name = current.name, description = current.description } = category;

    db.prepare(
      "UPDATE category SET name = ?, description = ? WHERE id = ?"
    ).run(name, description, id);

    return this.findById(id);
  }

  delete(id: number): boolean {
    const { changes } = db.prepare("DELETE FROM category WHERE id = ?").run(id);
    return changes > 0;
  }

  getProductsByCategory(categoryId: number) {
    return db
      .prepare("SELECT * FROM product WHERE category_id = ? ORDER BY name")
      .all(categoryId);
  }
}
