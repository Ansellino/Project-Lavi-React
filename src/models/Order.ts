import { OrderItemWithProduct } from "./OrderItem";
import { User } from "./User";

// src/models/Order.ts
export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: OrderStatus;
  shipping_address: string | null;
  order_date: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderWithDetails extends Order {
  items: OrderItemWithProduct[];
  user?: User;
  totalItems: number;
}
