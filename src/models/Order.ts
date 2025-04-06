export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address: string | null;
  order_date: string;
  created_at: string;
  updated_at: string;
}
