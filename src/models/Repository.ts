// src/models/Repository.ts
export interface Repository<T> {
  findAll(): T[];
  findById(id: number): T | undefined;
  create(data: Omit<T, "id" | "created_at" | "updated_at">): T;
  update(id: number, data: Partial<T>): T | null;
  delete(id: number): boolean;
}
