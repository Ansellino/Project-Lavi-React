// src/models/Payment.ts
export interface Payment {
  id?: number;
  order_id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  created_at: string;
}

export type PaymentMethod = "credit_card" | "paypal" | "apple_pay";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface PaymentFormValues {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  savePaymentMethod: boolean;
}
