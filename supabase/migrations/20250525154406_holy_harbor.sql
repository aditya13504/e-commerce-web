/*
  # Create products table and sample data

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `image_url` (text)
      - `category` (text)
      - `inventory_count` (integer)
      - `featured` (boolean)

  2. Security
    - Enable RLS on products table
    - Add policy for public read access

  3. Data
    - Insert sample products
*/

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  image_url text NOT NULL,
  category text NOT NULL,
  inventory_count integer DEFAULT 0 NOT NULL,
  featured boolean DEFAULT false
);

-- Enable Row Level Security if not already enabled
DO $$ 
BEGIN
  ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Drop existing policy if it exists and create new one
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
  CREATE POLICY "Anyone can view products"
    ON public.products
    FOR SELECT
    TO anon, authenticated
    USING (true);
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Insert sample data if table is empty
INSERT INTO public.products (name, description, price, image_url, category, inventory_count, featured)
SELECT
  'Classic T-Shirt',
  'A comfortable cotton t-shirt for everyday wear',
  29.99,
  'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg',
  'Clothing',
  100,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.products LIMIT 1);

INSERT INTO public.products (name, description, price, image_url, category, inventory_count, featured)
SELECT
  'Leather Wallet',
  'Handcrafted leather wallet with multiple card slots',
  49.99,
  'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg',
  'Accessories',
  50,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.products LIMIT 1);

INSERT INTO public.products (name, description, price, image_url, category, inventory_count, featured)
SELECT
  'Coffee Mug',
  'Ceramic mug perfect for your morning coffee',
  14.99,
  'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg',
  'Home',
  200,
  false
WHERE NOT EXISTS (SELECT 1 FROM public.products LIMIT 1);