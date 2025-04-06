import db from "../database/db";
import { Cart, CartItem, Product } from "../models";

export class CartRepository {
  findById(id: number): Cart | undefined {
    return db.prepare("SELECT * FROM cart WHERE id = ?").get(id) as
      | Cart
      | undefined;
  }

  findByUserId(userId: number): Cart | undefined {
    return db.prepare("SELECT * FROM cart WHERE user_id = ?").get(userId) as
      | Cart
      | undefined;
  }

  create(userId: number): Cart {
    const { lastInsertRowid } = db
      .prepare("INSERT INTO cart (user_id) VALUES (?)")
      .run(userId);

    return this.findById(Number(lastInsertRowid))!;
  }

  getOrCreateCart(userId: number): Cart {
    const existingCart = this.findByUserId(userId);
    if (existingCart) return existingCart;
    return this.create(userId);
  }

  getCartItems(cartId: number): CartItem[] {
    return db
      .prepare("SELECT * FROM cart_item WHERE cart_id = ?")
      .all(cartId) as CartItem[];
  }

  getCartItemsWithProducts(
    cartId: number
  ): (CartItem & { product: Product })[] {
    return db
      .prepare(
        `
        SELECT ci.*, p.* 
        FROM cart_item ci
        JOIN product p ON ci.product_id = p.id
        WHERE ci.cart_id = ?
      `
      )
      .all(cartId)
      .map((row: any) => ({
        id: row.id,
        cart_id: row.cart_id,
        product_id: row.product_id,
        quantity: row.quantity,
        created_at: row.created_at,
        updated_at: row.updated_at,
        product: {
          id: row.product_id,
          name: row.name,
          description: row.description,
          price: row.price,
          stock: row.stock,
          image: row.image,
          category_id: row.category_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
        },
      }));
  }

  addItem(cartId: number, productId: number, quantity: number): CartItem {
    // Check if item already exists
    const existingItem = db
      .prepare("SELECT * FROM cart_item WHERE cart_id = ? AND product_id = ?")
      .get(cartId, productId) as CartItem | undefined;

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      db.prepare("UPDATE cart_item SET quantity = ? WHERE id = ?").run(
        newQuantity,
        existingItem.id
      );

      return {
        ...existingItem,
        quantity: newQuantity,
      };
    } else {
      // Insert new item
      const { lastInsertRowid } = db
        .prepare(
          "INSERT INTO cart_item (cart_id, product_id, quantity) VALUES (?, ?, ?)"
        )
        .run(cartId, productId, quantity);

      return db
        .prepare("SELECT * FROM cart_item WHERE id = ?")
        .get(Number(lastInsertRowid)) as CartItem;
    }
  }

  updateItemQuantity(
    cartItemId: number,
    quantity: number
  ): CartItem | undefined {
    db.prepare("UPDATE cart_item SET quantity = ? WHERE id = ?").run(
      quantity,
      cartItemId
    );

    return db
      .prepare("SELECT * FROM cart_item WHERE id = ?")
      .get(cartItemId) as CartItem | undefined;
  }

  removeItem(cartItemId: number): boolean {
    const { changes } = db
      .prepare("DELETE FROM cart_item WHERE id = ?")
      .run(cartItemId);

    return changes > 0;
  }

  clearCart(cartId: number): boolean {
    const { changes } = db
      .prepare("DELETE FROM cart_item WHERE cart_id = ?")
      .run(cartId);

    return changes > 0;
  }
}
