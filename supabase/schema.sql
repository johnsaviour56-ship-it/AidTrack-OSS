-- AidTrack OSS - Initial Database Schema
-- Run this in your Supabase SQL editor to set up the database.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with role and display name
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text not null,
  role        text not null default 'volunteer' check (role in ('admin', 'field_officer', 'volunteer')),
  created_at  timestamptz not null default now()
);

-- Auto-create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'volunteer')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Beneficiaries ───────────────────────────────────────────────────────────
create table public.beneficiaries (
  id                     uuid primary key default uuid_generate_v4(),
  full_name              text not null,
  household_id           text not null unique,
  gender                 text not null check (gender in ('male', 'female', 'other')),
  phone_number           text,
  location               text not null,
  vulnerability_category text not null,
  household_size         integer not null check (household_size > 0),
  is_archived            boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- ─── Distributions ───────────────────────────────────────────────────────────
create table public.distributions (
  id                uuid primary key default uuid_generate_v4(),
  title             text not null,
  distribution_type text not null,
  location          text not null,
  date              date not null,
  quantity          numeric not null check (quantity > 0),
  unit              text not null,
  status            text not null default 'planned' check (status in ('planned', 'active', 'completed')),
  created_by        uuid not null references public.profiles(id),
  created_at        timestamptz not null default now()
);

-- ─── Distribution Records ────────────────────────────────────────────────────
-- Tracks whether each beneficiary received aid in a distribution
create table public.distribution_records (
  id               uuid primary key default uuid_generate_v4(),
  distribution_id  uuid not null references public.distributions(id) on delete cascade,
  beneficiary_id   uuid not null references public.beneficiaries(id) on delete cascade,
  received         boolean not null default false,
  received_at      timestamptz,
  notes            text,
  unique (distribution_id, beneficiary_id)
);

-- ─── Row Level Security ──────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.beneficiaries enable row level security;
alter table public.distributions enable row level security;
alter table public.distribution_records enable row level security;

-- Authenticated users can read all data
create policy "Authenticated users can read profiles"
  on public.profiles for select to authenticated using (true);

create policy "Authenticated users can read beneficiaries"
  on public.beneficiaries for select to authenticated using (true);

create policy "Authenticated users can read distributions"
  on public.distributions for select to authenticated using (true);

create policy "Authenticated users can read distribution records"
  on public.distribution_records for select to authenticated using (true);

-- Only admins and field officers can write beneficiaries
create policy "Staff can manage beneficiaries"
  on public.beneficiaries for all to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'field_officer')
    )
  );

-- Only admins and field officers can manage distributions
create policy "Staff can manage distributions"
  on public.distributions for all to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'field_officer')
    )
  );

-- All authenticated users can update distribution records (mark received)
create policy "Authenticated users can manage distribution records"
  on public.distribution_records for all to authenticated using (true);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid());
