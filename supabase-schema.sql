-- Liat Studio Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Materials (powder inventory)
create table materials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  supplier text not null default '',
  quantity_grams integer not null default 0,
  price numeric(10,2) not null default 0,
  min_threshold integer not null default 1000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Recipes (glaze formulas)
create table recipes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null default '',
  is_test boolean not null default false,
  promoted_from_test_id uuid references recipes(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Recipe ingredients (join table)
create table recipe_ingredients (
  id uuid primary key default uuid_generate_v4(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  material_id uuid not null references materials(id) on delete cascade,
  weight_ratio numeric(10,4) not null default 0
);

-- Test iterations (lab test results)
create table test_iterations (
  id uuid primary key default uuid_generate_v4(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  iteration_number integer not null,
  date date not null default current_date,
  result_text text not null default ''
);

-- Batches (preparation log)
create table batches (
  id uuid primary key default uuid_generate_v4(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  quantity_kg numeric(10,3) not null,
  created_at timestamptz not null default now()
);

-- Colorants (pigment inventory)
create table colorants (
  id uuid primary key default uuid_generate_v4(),
  color text not null,
  catalog_number text not null default '',
  supplier text not null default '',
  quantity numeric(10,2) not null default 0,
  price numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

-- Additional materials (misc items)
create table additional_materials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  in_stock boolean not null default false,
  quantity numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

-- Auto-update updated_at on materials
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger materials_updated_at
  before update on materials
  for each row execute function update_updated_at();

-- RPC: Atomic batch deduction
create or replace function deduct_batch(
  p_recipe_id uuid,
  p_quantity_kg numeric
)
returns void as $$
declare
  ingredient record;
  deduction_grams integer;
begin
  for ingredient in
    select ri.material_id, ri.weight_ratio
    from recipe_ingredients ri
    where ri.recipe_id = p_recipe_id
  loop
    deduction_grams := round(ingredient.weight_ratio * p_quantity_kg * 1000);
    update materials
    set quantity_grams = greatest(quantity_grams - deduction_grams, 0)
    where id = ingredient.material_id;
  end loop;
end;
$$ language plpgsql;

-- Row Level Security (allow all for anon - single user app)
alter table materials enable row level security;
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;
alter table test_iterations enable row level security;
alter table batches enable row level security;
alter table colorants enable row level security;
alter table additional_materials enable row level security;

create policy "Allow all on materials" on materials for all using (true) with check (true);
create policy "Allow all on recipes" on recipes for all using (true) with check (true);
create policy "Allow all on recipe_ingredients" on recipe_ingredients for all using (true) with check (true);
create policy "Allow all on test_iterations" on test_iterations for all using (true) with check (true);
create policy "Allow all on batches" on batches for all using (true) with check (true);
create policy "Allow all on colorants" on colorants for all using (true) with check (true);
create policy "Allow all on additional_materials" on additional_materials for all using (true) with check (true);

-- Seed default additional materials
insert into additional_materials (name, in_stock, quantity) values
  ('חימר נוזלי', false, 0),
  ('גלזורה שקופה ירוקה', false, 0),
  ('גבס', false, 0),
  ('CMC', false, 0),
  ('מנגן', false, 0),
  ('מי זכוכית', false, 0),
  ('ליינר שחור', false, 0);

-- Catalog (sales products)
create table catalog (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null default '',
  description text not null default '',
  clay_type text not null default '',
  glaze_color text not null default '',
  size text not null default '',
  cost_price numeric(10,2) not null default 0,
  in_stock boolean not null default true,
  production_date date not null default current_date,
  sale_price numeric(10,2) not null default 0,
  sale_date date,
  created_at timestamptz not null default now()
);

alter table catalog enable row level security;
create policy "Allow all on catalog" on catalog for all using (true) with check (true);

-- Storage bucket for catalog images (run in Supabase SQL Editor)
-- insert into storage.buckets (id, name, public) values ('catalog-images', 'catalog-images', true);
-- create policy "Allow public read on catalog-images" on storage.objects for select using (bucket_id = 'catalog-images');
-- create policy "Allow all upload on catalog-images" on storage.objects for insert with check (bucket_id = 'catalog-images');
-- create policy "Allow all update on catalog-images" on storage.objects for update using (bucket_id = 'catalog-images');
-- create policy "Allow all delete on catalog-images" on storage.objects for delete using (bucket_id = 'catalog-images');
