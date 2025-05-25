/*
  # Seed products data

  1. Data
    - Adds sample products to the products table
*/

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, inventory_count, featured)
VALUES 
  ('Wireless Noise-Cancelling Headphones', 'Premium wireless headphones with active noise cancellation for an immersive audio experience.', 299.99, 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg', 'Electronics', 50, true),
  
  ('Smart Fitness Watch', 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.', 199.99, 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', 'Electronics', 75, true),
  
  ('Slim Leather Wallet', 'Handcrafted genuine leather wallet with RFID protection and minimalist design.', 49.99, 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', 'Accessories', 100, false),
  
  ('Organic Cotton T-Shirt', 'Soft, sustainable organic cotton t-shirt in a classic fit. Available in multiple colors.', 24.99, 'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg', 'Clothing', 200, false),
  
  ('Professional Ceramic Hair Dryer', 'Salon-quality hair dryer with ceramic technology for faster drying and reduced heat damage.', 129.99, 'https://images.pexels.com/photos/3993462/pexels-photo-3993462.jpeg', 'Beauty', 40, true),
  
  ('Premium Coffee Maker', 'Programmable coffee maker with thermal carafe to keep your coffee hot for hours.', 149.99, 'https://images.pexels.com/photos/585753/pexels-photo-585753.jpeg', 'Home', 30, true),
  
  ('Ergonomic Office Chair', 'Adjustable office chair with lumbar support and breathable mesh back for all-day comfort.', 249.99, 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg', 'Furniture', 25, false),
  
  ('Stainless Steel Water Bottle', 'Double-walled insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.', 34.99, 'https://images.pexels.com/photos/1188649/pexels-photo-1188649.jpeg', 'Accessories', 150, false),
  
  ('Wireless Charging Pad', 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek and compact design.', 39.99, 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg', 'Electronics', 60, false),
  
  ('Lightweight Travel Backpack', 'Water-resistant backpack with multiple compartments, perfect for travel or daily use.', 79.99, 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg', 'Bags', 45, true);