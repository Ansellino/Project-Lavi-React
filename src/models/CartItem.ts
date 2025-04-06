import { Product } from "./Product";

// src/models/CartItem.ts
export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
  subtotal: number;
}
