import db from "../database/db";
import { Repository } from "../models/Repository";

/**
 * Abstract base repository that implements common CRUD operations
 * using SQL database access
 */
export abstract class BaseRepository<T extends { id: number }>
  implements Repository<T>
{
  protected readonly tableName: string;

  /**
   * Create a base repository for the given table
   *
   * @param tableName Name of the database table
   */
  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Find all records in the table
   */
  findAll(): T[] {
    return db
      .prepare(`SELECT * FROM ${this.tableName} ORDER BY id`)
      .all() as T[];
  }

  /**
   * Find a record by its ID
   *
   * @param id Record ID
   */
  findById(id: number): T | undefined {
    return db
      .prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`)
      .get(id) as T | undefined;
  }

  /**
   * Create a new record
   *
   * @param data Record data without id, created_at, and updated_at
   */
  create(data: Omit<T, "id" | "created_at" | "updated_at">): T {
    // Convert data object to columns and values
    const columns = Object.keys(data);
    const placeholders = columns.map(() => "?").join(", ");
    const values = columns.map((col) => (data as any)[col]);

    // Insert the record
    const { lastInsertRowid } = db
      .prepare(
        `INSERT INTO ${this.tableName} (${columns.join(
          ", "
        )}) VALUES (${placeholders})`
      )
      .run(...values);

    // Return the newly created record
    return this.findById(Number(lastInsertRowid))!;
  }

  /**
   * Update an existing record
   *
   * @param id Record ID
   * @param data Partial record data to update
   */
  update(
    id: number,
    data: Partial<Omit<T, "id" | "created_at" | "updated_at">>
  ): T | null {
    // Verify record exists
    const current = this.findById(id);
    if (!current) return null;

    // Convert data object to set clause and values
    const columns = Object.keys(data);
    if (columns.length === 0) return current as unknown as T;

    const setClause = columns.map((col) => `${col} = ?`).join(", ");
    const values = [...columns.map((col) => (data as any)[col]), id];

    // Update the record
    db.prepare(`UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`).run(
      ...values
    );

    // Return the updated record
    return this.findById(id) as unknown as T;
  }

  /**
   * Delete a record
   *
   * @param id Record ID
   * @returns True if deleted, false if not found
   */
  delete(id: number): boolean {
    const { changes } = db
      .prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
      .run(id);

    return changes > 0;
  }

  /**
   * Get the number of records in the table
   */
  count(): number {
    const result = db
      .prepare(`SELECT COUNT(*) AS count FROM ${this.tableName}`)
      .get() as { count: number };

    return result.count;
  }

  /**
   * Find records by a specific field value
   *
   * @param field Field name
   * @param value Field value
   */
  findByField(field: keyof T, value: any): T[] {
    return db
      .prepare(`SELECT * FROM ${this.tableName} WHERE ${String(field)} = ?`)
      .all(value) as T[];
  }

  /**
   * Find a single record by a specific field value
   *
   * @param field Field name
   * @param value Field value
   */
  findOneByField(field: keyof T, value: any): T | undefined {
    return db
      .prepare(`SELECT * FROM ${this.tableName} WHERE ${String(field)} = ?`)
      .get(value) as T | undefined;
  }
}
