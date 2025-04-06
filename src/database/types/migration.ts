/**
 * Migration interface for database schema changes
 */
export interface Migration {
  /**
   * SQL commands to upgrade the database schema
   * Executed when applying a migration
   */
  up: string;

  /**
   * SQL commands to downgrade the database schema
   * Executed when reverting a migration
   */
  down: string;
}

/**
 * Migration file structure for module imports
 * This is the shape each migration file should export
 */
export interface MigrationModule {
  default: Migration;
}

/**
 * Migration record stored in the migrations table
 */
export interface MigrationRecord {
  id: number;
  name: string;
  applied_at: string;
}

/**
 * Migration status in the system
 */
export enum MigrationStatus {
  PENDING = "pending",
  APPLIED = "applied",
  FAILED = "failed",
}

/**
 * Migration result after execution
 */
export interface MigrationResult {
  name: string;
  status: MigrationStatus;
  error?: string;
}

/**
 * Options for running migrations
 */
export interface MigrationOptions {
  /**
   * Directory where migration files are located
   * Default: "migrations"
   */
  directory?: string;

  /**
   * Whether to create the migrations table if it doesn't exist
   * Default: true
   */
  createMigrationsTable?: boolean;

  /**
   * Migration table name
   * Default: "migrations"
   */
  migrationsTable?: string;
}
