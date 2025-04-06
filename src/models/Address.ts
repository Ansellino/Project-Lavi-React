// src/models/Address.ts
export interface Address {
  id?: number;
  user_id: number;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  phone?: string;
}
