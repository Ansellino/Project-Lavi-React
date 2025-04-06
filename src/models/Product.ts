import { Review } from "components/product/ProductReviews";
import { Category } from "./Category";

// src/models/Product.ts
export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export interface ProductWithCategory extends Product {
  category?: Category;
}

export interface ProductWithReviews extends Product {
  reviews?: Review[];
  average_rating?: number;
}
