import { Product } from "./Product";

// src/models/OrderItem.ts
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItemWithProduct extends OrderItem {
  product: Product;
}
