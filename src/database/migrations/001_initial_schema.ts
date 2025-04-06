import { Migration } from "../types/migration";

export const up = `
-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Create Category table
CREATE TABLE IF NOT EXISTS category (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create User table
CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Product table
CREATE TABLE IF NOT EXISTS product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  image TEXT,
  category_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES category(id)
);

-- Create Cart table
CREATE TABLE IF NOT EXISTS cart (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Create Order table
CREATE TABLE IF NOT EXISTS order_table (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address TEXT,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Create OrderItem table
CREATE TABLE IF NOT EXISTS order_item (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES order_table(id),
  FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Create CartItem table
CREATE TABLE IF NOT EXISTS cart_item (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cart_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES cart(id),
  FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Create triggers to automatically update updated_at timestamps
CREATE TRIGGER IF NOT EXISTS update_category_timestamp
AFTER UPDATE ON category
BEGIN
  UPDATE category SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_user_timestamp
AFTER UPDATE ON user
BEGIN
  UPDATE user SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_product_timestamp
AFTER UPDATE ON product
BEGIN
  UPDATE product SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_cart_timestamp
AFTER UPDATE ON cart
BEGIN
  UPDATE cart SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_order_table_timestamp
AFTER UPDATE ON order_table
BEGIN
  UPDATE order_table SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_order_item_timestamp
AFTER UPDATE ON order_item
BEGIN
  UPDATE order_item SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_cart_item_timestamp
AFTER UPDATE ON cart_item
BEGIN
  UPDATE cart_item SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
`;

export const down = `
-- Drop triggers
DROP TRIGGER IF EXISTS update_cart_item_timestamp;
DROP TRIGGER IF EXISTS update_order_item_timestamp;
DROP TRIGGER IF EXISTS update_order_table_timestamp;
DROP TRIGGER IF EXISTS update_cart_timestamp;
DROP TRIGGER IF EXISTS update_product_timestamp;
DROP TRIGGER IF EXISTS update_user_timestamp;
DROP TRIGGER IF EXISTS update_category_timestamp;

-- Drop tables (in reverse order to handle foreign key constraints)
DROP TABLE IF EXISTS cart_item;
DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS order_table;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS category;
`;

const migration: Migration = { up, down };
export default migration;
