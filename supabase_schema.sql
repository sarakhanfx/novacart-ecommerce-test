-- ============================================================
-- NovaCart — Supabase Database Schema
-- Run this in Supabase → SQL Editor → New Query → Run
-- ============================================================

-- CATEGORIES
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image text,
  product_count integer default 0,
  created_at timestamptz default now()
);

-- PRODUCTS
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric(10,2) not null,
  discount_price numeric(10,2),
  category_id uuid references categories(id),
  image text,
  images text[],
  stock integer default 0,
  rating numeric(3,2) default 0,
  review_count integer default 0,
  is_featured boolean default false,
  is_bestseller boolean default false,
  created_at timestamptz default now()
);

-- ORDERS
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  status text default 'pending',
  total_amount numeric(10,2) not null,
  shipping_name text,
  shipping_email text,
  shipping_phone text,
  shipping_address text,
  created_at timestamptz default now()
);

-- ORDER ITEMS
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_title text,
  quantity integer not null,
  unit_price numeric(10,2) not null,
  created_at timestamptz default now()
);

-- CART ITEMS (optional — we use localStorage by default)
create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity integer not null default 1,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- ── Row Level Security ─────────────────────────────────────

alter table orders enable row level security;
alter table order_items enable row level security;
alter table cart_items enable row level security;

-- Users can only see their own orders
create policy "Users see own orders" on orders for select using (auth.uid() = user_id);
create policy "Users insert own orders" on orders for insert with check (auth.uid() = user_id);

-- Users can see their order items
create policy "Users see own order items" on order_items for select
  using (order_id in (select id from orders where user_id = auth.uid()));
create policy "Users insert own order items" on order_items for insert
  with check (order_id in (select id from orders where user_id = auth.uid()));

-- Cart items
create policy "Users manage own cart" on cart_items for all using (auth.uid() = user_id);

-- Products and categories are public
alter table products enable row level security;
alter table categories enable row level security;
create policy "Public read products" on products for select using (true);
create policy "Public read categories" on categories for select using (true);

-- ── Seed Data ─────────────────────────────────────────────
-- (Optional) Run this to populate with the dummy data

insert into categories (name, slug, description, image, product_count) values
('Electronics', 'electronics', 'Gadgets, devices & tech accessories', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80', 4),
('Fashion', 'fashion', 'Clothing, shoes & style essentials', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80', 2),
('Home', 'home', 'Furniture, décor & home essentials', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80', 2),
('Beauty', 'beauty', 'Skincare, cosmetics & wellness', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80', 1),
('Sports', 'sports', 'Equipment, apparel & outdoor gear', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80', 2),
('Accessories', 'accessories', 'Bags, watches & lifestyle accessories', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80', 1);
