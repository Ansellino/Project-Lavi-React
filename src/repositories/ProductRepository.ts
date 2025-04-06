import db from "../database/db";
import { Product } from "../models";

export class ProductRepository {
  findAll(): Product[] {
    return db.prepare("SELECT * FROM product ORDER BY name").all() as Product[];
  }

  findById(id: number): Product | undefined {
    return db.prepare("SELECT * FROM product WHERE id = ?").get(id) as
      | Product
      | undefined;
  }

  create(product: Omit<Product, "id" | "created_at" | "updated_at">): Product {
    const { lastInsertRowid } = db
      .prepare(
        `
        INSERT INTO product 
        (name, description, price, stock, image, category_id) 
        VALUES (?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        product.name,
        product.description,
        product.price,
        product.stock,
        product.image,
        product.category_id
      );

    return this.findById(Number(lastInsertRowid))!;
  }

  update(
    id: number,
    product: Partial<Omit<Product, "id" | "created_at" | "updated_at">>
  ): Product | undefined {
    const current = this.findById(id);
    if (!current) return undefined;

    const {
      name = current.name,
      description = current.description,
      price = current.price,
      stock = current.stock,
      image = current.image,
      category_id = current.category_id,
    } = product;

    db.prepare(
      `
      UPDATE product 
      SET name = ?, description = ?, price = ?, stock = ?, image = ?, category_id = ? 
      WHERE id = ?
    `
    ).run(name, description, price, stock, image, category_id, id);

    return this.findById(id);
  }

  delete(id: number): boolean {
    const { changes } = db.prepare("DELETE FROM product WHERE id = ?").run(id);
    return changes > 0;
  }

  findByCategory(categoryId: number): Product[] {
    return db
      .prepare("SELECT * FROM product WHERE category_id = ? ORDER BY name")
      .all(categoryId) as Product[];
  }

  search(query: string): Product[] {
    return db
      .prepare("SELECT * FROM product WHERE name LIKE ? OR description LIKE ?")
      .all(`%${query}%`, `%${query}%`) as Product[];
  }
}
