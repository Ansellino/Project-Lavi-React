// src/models/Cart.ts
export interface Cart {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CartSummary {
  id: number;
  item_count: number;
  subtotal: number;
}
