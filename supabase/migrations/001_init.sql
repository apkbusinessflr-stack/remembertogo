-- supabase/migrations/001_init.sql
-- Production-grade baseline schema for remembertogo
-- Idempotent-ish: CREATE EXTENSION IF NOT EXISTS and CREATE TYPE IF NOT EXISTS where possible.

-- ===== Extensions =====
create extension if not exists postgis;
create extension if not exists btree_gist;
create extension if not exists pgcrypto; -- for gen_random_uuid()

-- ===== Enums =====
do $$ begin
  create type place_status as enum ('active','hidden');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tip_status as enum ('pending','published','hidden','flagged');
exception when duplicate_object then null; end $$;

do $$ begin
  create type media_status as enum ('pending','approved','rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type like_target as enum ('place','tip','photo','list');
exception when duplicate_object then null; end $$;

do $$ begin
  create type feed_event_type as enum ('visited','new_tip','new_photo','earned_badge','follow');
exception when duplicate_object then null; end $$;

-- ===== Core tables =====

-- Regions (countries, states, etc.)
create table if not exists region(
  id           bigserial primary key,
  slug         text unique not null,
  name_en      text not null,
  level        smallint not null default 2,        -- 0=planet,1=country,2=region/area
  country_code char(2),
  geom         geometry(MultiPolygon,4326)
);

-- Categories (beaches, hikes, etc.)
create table if not exists category(
  id      bigserial primary key,
  slug    text unique not null,
  name_en text not null
);

-- Places
create table if not exists place(
  id              bigserial primary key,
  region_id       bigint references region(id),
  category_id     bigint references category(id),
  slug            text unique not null,
  name_en         text not null,
  lat             double precision not null,
  lng             double precision not null,
  geom            geography(Point,4326)
                  generated always as (ST_SetSRID(ST_MakePoint(lng,lat),4326)::geography) stored,
  country_code    char(2) not null,
  status          place_status not null default 'active',
  popularity_score numeric(6,2) not null default 0,
  source          text not null default 'manual',
  verified        boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Tags and mapping
create table if not exists tag(
  id      bigserial primary key,
  slug    text unique not null,
  name_en text not null
);

create table if not exists place_tag(
  place_id bigint references place(id) on delete cascade,
  tag_id   bigint references tag(id)   on delete cascade,
  primary key(place_id, tag_id)
);

-- Public profile (separate from auth.users but tied via RLS with auth.uid())
create table if not exists "user"(
  id            uuid primary key default gen_random_uuid(),
  username      text unique,
  avatar_url    text,
  is_private    boolean not null default false,
  bio           text,
  home_country  char(2),
  settings      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

-- Visits (user x place)
create table if not exists visit(
  user_id    uuid   not null references "user"(id) on delete cascade,
  place_id   bigint not null references place(id)  on delete cascade,
  visited    boolean not null default true,
  rating     smallint check (rating between 1 and 5),
  note       text,
  visited_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key(user_id, place_id)
);

-- Editorial lists
create table if not exists list(
  id           bigserial primary key,
  slug         text unique not null,
  title        text not null,
  country_code char(2),
  category     text not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists list_place(
  list_id   bigint not null references list(id)   on delete cascade,
  place_id  bigint not null references place(id)  on delete cascade,
  order_idx int,
  primary key(list_id, place_id)
);

-- Follows
create table if not exists follow(
  follower_id uuid not null references "user"(id) on delete cascade,
  following_id uuid not null references "user"(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key(follower_id, following_id),
  check (follower_id <> following_id)
);

-- Tips
create table if not exists tip(
  id           bigserial primary key,
  place_id     bigint not null references place(id) on delete cascade,
  user_id      uuid   not null references "user"(id) on delete cascade,
  body         text   not null check (char_length(body) between 3 and 240),
  lang         text   not null default 'en',
  photos_count int    not null default 0,
  status       tip_status not null default 'pending',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Photos
create table if not exists photo(
  id           bigserial primary key,
  place_id     bigint not null references place(id) on delete cascade,
  user_id      uuid   not null references "user"(id) on delete cascade,
  storage_url  text   not null,
  width        int,
  height       int,
  blurhash     text,
  status       media_status not null default 'pending',
  created_at   timestamptz not null default now()
);

-- Likes
create table if not exists "like"(
  user_id     uuid not null references "user"(id) on delete cascade,
  target_type like_target not null,
  target_id   bigint not null,
  created_at  timestamptz not null default now(),
  primary key(user_id, target_type, target_id)
);

-- Feed events (public activity)
create table if not exists feed_event(
  id             bigserial primary key,
  type           feed_event_type not null,
  actor_user_id  uuid references "user"(id) on delete cascade,
  place_id       bigint references place(id) on delete set null,
  object_id      bigint,
  created_at     timestamptz not null default now(),
  visibility     text not null default 'public' check (visibility in ('public','followers','private'))
);

-- (Optional but useful) Moderation reports
create table if not exists mod_report(
  id           bigserial primary key,
  reporter_id  uuid references "user"(id) on delete set null,
  target_type  like_target not null,
  target_id    bigint not null,
  reason       text not null check (char_length(reason) >= 3),
  status       text not null default 'queued' check (status in ('queued','reviewed','dismissed','actioned')),
  created_at   timestamptz not null default now()
);

-- ===== Indexes =====
create index if not exists place_gist on place using gist (geom);
create index if not exists place_country_cat_pop_idx on place(country_code, category_id, popularity_score desc);
create index if not exists place_slug_idx on place(slug);
create index if not exists tip_status_idx on tip(status);
create index if not exists tip_place_idx on tip(place_id);
create index if not exists photo_status_idx on photo(status);
create index if not exists photo_place_idx on photo(place_id);
create index if not exists like_target_idx on "like"(target_type, target_id);
create index if not exists feed_event_type_time_idx on feed_event(type, created_at desc);
create index if not exists list_slug_idx on list(slug);
create index if not exists list_place_order_idx on list_place(list_id, order_idx);

-- ===== Triggers (updated_at) =====
create or replace function trg_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

do $$ begin
  create trigger touch_place_updated
    before update on place
    for each row execute function trg_touch_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger touch_tip_updated
    before update on tip
    for each row execute function trg_touch_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger touch_list_updated
    before update on list
    for each row execute function trg_touch_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger touch_visit_updated
    before update on visit
    for each row execute function trg_touch_updated_at();
exception when duplicate_object then null; end $$;

-- ===== Row Level Security (RLS) =====

-- Visits: only owner can read/write
alter table visit enable row level security;
drop policy if exists "own visits all" on visit;
create policy "own visits all" on visit
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Follow: anyone can read follower graph, only self can insert/delete
alter table follow enable row level security;
drop policy if exists "read follows" on follow;
create policy "read follows" on follow
  for select using (true);

drop policy if exists "insert self" on follow;
create policy "insert self" on follow
  for insert with check (auth.uid() = follower_id);

drop policy if exists "delete self" on follow;
create policy "delete self" on follow
  for delete using (auth.uid() = follower_id);

-- Tips: public read published; owners can CRUD their own pending/hidden; mods later
alter table tip enable row level security;
drop policy if exists "read published tips" on tip;
create policy "read published tips" on tip
  for select using (status = 'published');

drop policy if exists "own tips write" on tip;
create policy "own tips write" on tip
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Photos: similar to tips (public read approved)
alter table photo enable row level security;
drop policy if exists "read approved photos" on photo;
create policy "read approved photos" on photo
  for select using (status = 'approved');

drop policy if exists "own photos write" on photo;
create policy "own photos write" on photo
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Likes: user can manage their likes; aggregate reads allowed
alter table "like" enable row level security;
drop policy if exists "own likes write" on "like";
create policy "own likes write" on "like"
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "count likes read" on "like";
create policy "count likes read" on "like"
  for select using (true);

-- Users: public read basic profiles, user can update self
alter table "user" enable row level security;
drop policy if exists "public read profiles" on "user";
create policy "public read profiles" on "user"
  for select using (true);

drop policy if exists "self update" on "user";
create policy "self update" on "user"
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- Places, lists, categories, tags: public read
alter table place enable row level security;
drop policy if exists "public read place" on place;
create policy "public read place" on place for select using (status = 'active');

alter table list enable row level security;
drop policy if exists "public read list" on list;
create policy "public read list" on list for select using (true);

alter table category enable row level security;
drop policy if exists "public read category" on category;
create policy "public read category" on category for select using (true);

alter table tag enable row level security;
drop policy if exists "public read tag" on tag;
create policy "public read tag" on tag for select using (true);

alter table place_tag enable row level security;
drop policy if exists "public read place_tag" on place_tag;
create policy "public read place_tag" on place_tag for select using (true);

-- Feed events: public read
alter table feed_event enable row level security;
drop policy if exists "public read feed" on feed_event;
create policy "public read feed" on feed_event for select using (visibility = 'public');

-- Moderation reports: only insert by logged user; not publicly readable
alter table mod_report enable row level security;
drop policy if exists "report insert" on mod_report;
create policy "report insert" on mod_report
  for insert with check (auth.role() = 'authenticated' and (reporter_id is null or reporter_id = auth.uid()));

drop policy if exists "report read own" on mod_report;
create policy "report read own" on mod_report
  for select using (reporter_id = auth.uid());

-- ===== Helpful constraints =====
alter table list_place
  add constraint list_place_order_nonneg check (order_idx is null or order_idx >= 0);

-- Done.
