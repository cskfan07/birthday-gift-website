-- Birthday share table
create table if not exists public.birthdays (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  slug text,
  data jsonb
);

-- Enable public read/insert policies for share links
alter table public.birthdays enable row level security;

-- Required permissions for the Supabase REST API
grant usage on schema public to anon;
grant insert, select on table public.birthdays to anon;
grant usage, select on all sequences in schema public to anon;

-- Remove old versions so this script can be run more than once
drop policy if exists "Allow public birthday insert" on public.birthdays;
drop policy if exists "Allow public birthday select" on public.birthdays;
drop policy if exists "Public can create birthday shares" on public.birthdays;
drop policy if exists "Public can read birthday shares" on public.birthdays;

-- Allow the website to create a birthday share
create policy "Allow public birthday insert"
on public.birthdays
for insert
to anon
with check (true);

-- Allow anyone with a share link to read birthday data
create policy "Allow public birthday select"
on public.birthdays
for select
to anon
using (true);

-- Public bucket for shared birthday photos and music
insert into storage.buckets (id, name, public)
values ('birthday-media', 'birthday-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Allow public birthday media upload" on storage.objects;
drop policy if exists "Allow public birthday media read" on storage.objects;

create policy "Allow public birthday media upload"
on storage.objects
for insert
to anon
with check (bucket_id = 'birthday-media');

create policy "Allow public birthday media read"
on storage.objects
for select
to anon
using (bucket_id = 'birthday-media');
