import db from "../database/db";
import { Order, OrderItem, Product } from "../models";
import { CartRepository } from "./CartRepository";

export class OrderRepository {
  private cartRepository = new CartRepository();

  findAll(): Order[] {
    return db
      .prepare("SELECT * FROM order_table ORDER BY created_at DESC")
      .all() as Order[];
  }

  findById(id: number): Order | undefined {
    return db.prepare("SELECT * FROM order_table WHERE id = ?").get(id) as
      | Order
      | undefined;
  }

  findByUserId(userId: number): Order[] {
    return db
      .prepare(
        "SELECT * FROM order_table WHERE user_id = ? ORDER BY created_at DESC"
      )
      .all(userId) as Order[];
  }

  create(
    order: Omit<Order, "id" | "created_at" | "updated_at" | "order_date">
  ): Order {
    const { lastInsertRowid } = db
      .prepare(
        `
        INSERT INTO order_table 
        (user_id, total_amount, status, shipping_address) 
        VALUES (?, ?, ?, ?)
      `
      )
      .run(
        order.user_id,
        order.total_amount,
        order.status,
        order.shipping_address
      );

    return this.findById(Number(lastInsertRowid))!;
  }

  updateStatus(id: number, status: string): Order | undefined {
    db.prepare("UPDATE order_table SET status = ? WHERE id = ?").run(
      status,
      id
    );

    return this.findById(id);
  }

  getOrderItems(orderId: number): OrderItem[] {
    return db
      .prepare("SELECT * FROM order_item WHERE order_id = ?")
      .all(orderId) as OrderItem[];
  }

  getOrderItemsWithProducts(
    orderId: number
  ): (OrderItem & { product: Product })[] {
    return db
      .prepare(
        `
        SELECT oi.*, p.* 
        FROM order_item oi
        JOIN product p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `
      )
      .all(orderId)
      .map((row: any) => ({
        id: row.id,
        order_id: row.order_id,
        product_id: row.product_id,
        quantity: row.quantity,
        price: row.price,
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

  addOrderItem(
    item: Omit<OrderItem, "id" | "created_at" | "updated_at">
  ): OrderItem {
    const { lastInsertRowid } = db
      .prepare(
        `
        INSERT INTO order_item 
        (order_id, product_id, quantity, price) 
        VALUES (?, ?, ?, ?)
      `
      )
      .run(item.order_id, item.product_id, item.quantity, item.price);

    return db
      .prepare("SELECT * FROM order_item WHERE id = ?")
      .get(Number(lastInsertRowid)) as OrderItem;
  }

  createFromCart(
    userId: number,
    cartId: number,
    shippingAddress: string
  ): Order | undefined {
    // Start transaction
    db.prepare("BEGIN TRANSACTION").run();

    try {
      // Get cart items
      const cartItems = this.cartRepository.getCartItemsWithProducts(cartId);

      if (cartItems.length === 0) {
        db.prepare("ROLLBACK").run();
        return undefined;
      }

      // Calculate total
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      // Create order
      const order = this.create({
        user_id: userId,
        total_amount: totalAmount,
        status: "pending",
        shipping_address: shippingAddress,
      });

      // Create order items
      for (const item of cartItems) {
        this.addOrderItem({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.price,
        });

        // Update product stock
        db.prepare("UPDATE product SET stock = stock - ? WHERE id = ?").run(
          item.quantity,
          item.product_id
        );
      }

      // Clear cart
      this.cartRepository.clearCart(cartId);

      // Commit transaction
      db.prepare("COMMIT").run();

      return order;
    } catch (error) {
      // Rollback on error
      db.prepare("ROLLBACK").run();
      throw error;
    }
  }
}
