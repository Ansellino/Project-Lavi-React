import { Migration } from "../types/migration";

export const up = `
-- Seed Categories
INSERT INTO category (name, description) VALUES
  ('Electronics', 'Electronic devices and gadgets'),
  ('Clothing', 'Apparel and fashion items'),
  ('Home & Kitchen', 'Home decor and kitchen appliances'),
  ('Books', 'Books and literature'),
  ('Sports & Outdoors', 'Sporting goods and outdoor equipment');

-- Seed Users (password: 'password123' for all users)
INSERT INTO user (name, username, email, password, role) VALUES
  ('Admin User', 'admin', 'admin@example.com', 'password123', 'admin'),
  ('John Doe', 'johndoe', 'john@example.com', 'password123', 'customer'),
  ('Jane Smith', 'janesmith', 'jane@example.com', 'password123', 'customer'),
  ('Bob Johnson', 'bobjohnson', 'bob@example.com', 'password123', 'customer');

-- Seed Products
INSERT INTO product (name, description, price, stock, image, category_id) VALUES
  -- Electronics
  ('Smartphone X', 'Latest smartphone with advanced features', 699.99, 50, '/images/products/smartphone.jpg', 1),
  ('Wireless Headphones', 'Premium noise-cancelling headphones', 149.99, 100, '/images/products/headphones.jpg', 1),
  ('Laptop Pro', 'High-performance laptop for professionals', 1299.99, 25, '/images/products/laptop.jpg', 1),
  ('Smart Watch', 'Fitness tracking and notifications', 199.99, 75, '/images/products/smartwatch.jpg', 1),
  ('Bluetooth Speaker', 'Portable speaker with crisp sound', 79.99, 120, '/images/products/speaker.jpg', 1),

  -- Clothing
  ('Men\'s T-Shirt', 'Comfortable cotton t-shirt', 19.99, 200, '/images/products/tshirt.jpg', 2),
  ('Women\'s Jeans', 'Classic fit denim jeans', 49.99, 150, '/images/products/jeans.jpg', 2),
  ('Winter Jacket', 'Warm winter coat with hood', 89.99, 50, '/images/products/jacket.jpg', 2),
  ('Running Shoes', 'Lightweight shoes for runners', 79.99, 100, '/images/products/shoes.jpg', 2),
  ('Sun Hat', 'Wide-brimmed sun protection hat', 24.99, 80, '/images/products/hat.jpg', 2),

  -- Home & Kitchen
  ('Coffee Maker', 'Programmable coffee brewing system', 69.99, 60, '/images/products/coffeemaker.jpg', 3),
  ('Blender', 'High-speed blender for smoothies', 49.99, 40, '/images/products/blender.jpg', 3),
  ('Throw Pillow Set', 'Decorative pillows for couch or bed', 29.99, 100, '/images/products/pillows.jpg', 3),
  ('Kitchen Knife Set', 'Professional grade kitchen knives', 99.99, 30, '/images/products/knives.jpg', 3),
  ('Bedding Set', 'Luxury bedding with duvet cover', 89.99, 45, '/images/products/bedding.jpg', 3),

  -- Books
  ('The Great Novel', 'Bestselling fiction book', 14.99, 200, '/images/products/novel.jpg', 4),
  ('Cookbook Collection', 'Recipe collection from top chefs', 24.99, 75, '/images/products/cookbook.jpg', 4),
  ('History of the World', 'Comprehensive world history', 19.99, 60, '/images/products/history.jpg', 4),
  ('Science for Beginners', 'Introduction to scientific concepts', 12.99, 90, '/images/products/science.jpg', 4),
  ('Business Strategy', 'Guide to business success', 17.99, 70, '/images/products/business.jpg', 4),

  -- Sports & Outdoors
  ('Yoga Mat', 'Non-slip exercise mat', 24.99, 120, '/images/products/yogamat.jpg', 5),
  ('Tennis Racket', 'Professional tennis racket', 79.99, 40, '/images/products/tennis.jpg', 5),
  ('Camping Tent', '4-person weather-resistant tent', 129.99, 30, '/images/products/tent.jpg', 5),
  ('Basketball', 'Official size and weight', 29.99, 80, '/images/products/basketball.jpg', 5),
  ('Hiking Backpack', 'Durable backpack for outdoor adventures', 59.99, 55, '/images/products/backpack.jpg', 5);

-- Create cart for each user
INSERT INTO cart (user_id) VALUES (2), (3), (4);

-- Add items to John's cart
INSERT INTO cart_item (cart_id, product_id, quantity) VALUES
  (1, 1, 1),  -- Smartphone X
  (1, 2, 1);  -- Wireless Headphones

-- Add items to Jane's cart
INSERT INTO cart_item (cart_id, product_id, quantity) VALUES
  (2, 6, 2),  -- Men's T-Shirt
  (2, 11, 1); -- Coffee Maker

-- Create orders for John Doe
INSERT INTO order_table (user_id, total_amount, status, shipping_address) VALUES
  (2, 349.97, 'delivered', '123 Main St, Anytown, USA 12345'),
  (2, 119.98, 'shipped', '123 Main St, Anytown, USA 12345');

-- Add items to John's first order
INSERT INTO order_item (order_id, product_id, quantity, price) VALUES
  (1, 3, 1, 199.99),  -- Laptop Pro (historical price different from current)
  (1, 7, 3, 49.99);   -- Women's Jeans

-- Add items to John's second order
INSERT INTO order_item (order_id, product_id, quantity, price) VALUES
  (2, 11, 1, 69.99),  -- Coffee Maker
  (2, 16, 1, 24.99),  -- The Great Novel
  (2, 21, 1, 24.99);  -- Yoga Mat

-- Create an order for Jane Smith
INSERT INTO order_table (user_id, total_amount, status, shipping_address) VALUES
  (3, 229.98, 'processing', '456 Elm St, Sometown, USA 54321');

-- Add items to Jane's order
INSERT INTO order_item (order_id, product_id, quantity, price) VALUES
  (3, 4, 1, 199.99),   -- Smart Watch
  (3, 9, 1, 29.99);    -- Sun Hat
`;

export const down = `
-- Remove order items
DELETE FROM order_item;

-- Remove orders
DELETE FROM order_table;

-- Remove cart items
DELETE FROM cart_item;

-- Remove carts
DELETE FROM cart;

-- Remove products
DELETE FROM product;

-- Remove users except admin
DELETE FROM user;

-- Remove categories
DELETE FROM category;
`;

const migration: Migration = { up, down };
export default migration;
