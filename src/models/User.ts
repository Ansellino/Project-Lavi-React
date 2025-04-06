// src/models/User.ts
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type UserRole = "admin" | "customer";

export interface UserProfile extends Omit<User, "password"> {
  orders_count?: number;
}

export interface AuthUser extends Omit<User, "password"> {
  token?: string;
}
