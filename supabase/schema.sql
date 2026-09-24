-- DishCon production schema (Supabase PostgreSQL)
-- Marketplace kantong surplus UMKM mikro + berbagi antar kos (Sekaran-Gunungpati, Semarang)
-- Run this file in Supabase SQL Editor before connecting the application.

create extension if not exists "pgcrypto";

-- Email pada tabel ini otomatis mendapat role admin ketika akun dibuat.
-- Isi melalui SQL Editor/service role, bukan dari client publik.
create table if not exists public.admin_email_allowlist (
  email text primary key,
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  phone text,
  role text not null check (role in ('mitra','mahasiswa','admin')),
  roles text[] not null default array['mahasiswa']::text[],
  address text,
  lat double precision,
  lng double precision,
  -- Mitra UMKM only
  nama_usaha text,
  jenis_usaha text check (jenis_usaha in ('warmindo','angkringan','katering_rumahan','toko_kue','lainnya')),
  verification_status text not null default 'belum_verifikasi' check (verification_status in ('belum_verifikasi','terverifikasi','ditangguhkan')),
  verified_at timestamptz,
  -- Mahasiswa only
  nama_kos text,
  avatar_url text,
  oauth_role_set_at timestamptz,
  created_at timestamptz default now()
);

alter table public.profiles drop constraint if exists profiles_roles_valid;
alter table public.profiles add constraint profiles_roles_valid check (
  roles <@ array['mitra','mahasiswa','admin']::text[]
  and (role <> 'admin' or roles = array['admin']::text[])
  and (role = 'admin' or not ('admin' = any(roles)))
) not valid;

-- Nomor telepon tidak boleh berisi huruf.
update public.profiles
set phone = regexp_replace(coalesce(phone, ''), '[^0-9+()[[:space:]]-]', '', 'g')
where phone is not null and phone ~ '[A-Za-z]';
alter table public.profiles drop constraint if exists profiles_phone_no_letters;
alter table public.profiles add constraint profiles_phone_no_letters check (phone is null or phone = '' or phone ~ '^[0-9+()[[:space:]]-]+$') not valid;

create table if not exists public.surplus_listings (
  id uuid primary key default gen_random_uuid(),
  mitra_id uuid not null references public.profiles(id) on delete cascade,
  nama_makanan text not null,
  kategori text not null,
  halal boolean default true,
  deskripsi text,
  jumlah_kantong integer not null check (jumlah_kantong > 0),
  harga_normal integer not null check (harga_normal >= 0),
  harga_diskon integer not null check (harga_diskon >= 0),
  lokasi text not null,
  lat double precision not null,
  lng double precision not null,
  batas_waktu timestamptz not null,
  waktu_produksi timestamptz,
  metode_penyimpanan text,
  status text not null default 'pending_verification' check (status in ('pending_verification','active','habis','kedaluwarsa','ditolak','ditarik')),
  nutrition jsonb,
  expiry jsonb,
  image_url text,
  created_at timestamptz default now(),
  constraint surplus_listings_harga_valid check (harga_diskon <= harga_normal)
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.surplus_listings(id) on delete cascade,
  mahasiswa_id uuid not null references public.profiles(id) on delete cascade,
  mitra_id uuid not null references public.profiles(id) on delete cascade,
  jumlah integer not null check (jumlah > 0),
  harga_satuan integer not null check (harga_satuan >= 0),
  total_harga integer not null check (total_harga >= 0),
  komisi_platform integer not null check (komisi_platform >= 0),
  kode_pengambilan text not null,
  status text not null default 'reserved' check (status in ('reserved','completed','dibatalkan','kedaluwarsa')),
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table if not exists public.kos_shares (
  id uuid primary key default gen_random_uuid(),
  poster_id uuid not null references public.profiles(id) on delete cascade,
  nama_item text not null,
  deskripsi text,
  harga integer not null default 0 check (harga >= 0),
  lokasi_kos text not null,
  status text not null default 'tersedia' check (status in ('tersedia','diambil','kedaluwarsa')),
  image_url text,
  created_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info' check (type in ('info','success','warning','system')),
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('mitra','mahasiswa','admin')),
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open','in_review','resolved')),
  created_at timestamptz default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- ── Auth & role helpers ─────────────────────────────────────────────────────

-- Public registration can create a mitra or mahasiswa profile.
-- Admin accounts must be promoted through allowlist/service role only.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  requested_role text;
  requested_roles text[];
begin
  if exists (select 1 from public.admin_email_allowlist a where lower(a.email) = lower(new.email)) then
    requested_role := 'admin';
    requested_roles := array['admin']::text[];
  else
    requested_role := coalesce(new.raw_user_meta_data ->> 'role', 'mahasiswa');
    if requested_role not in ('mitra', 'mahasiswa') then
      requested_role := 'mahasiswa';
    end if;
    requested_roles := array[requested_role]::text[];
  end if;

  insert into public.profiles (
    id, email, name, phone, role, roles, address, lat, lng,
    nama_usaha, jenis_usaha, nama_kos, avatar_url, created_at
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    requested_role,
    requested_roles,
    coalesce(new.raw_user_meta_data ->> 'address', ''),
    nullif(new.raw_user_meta_data ->> 'lat', '')::double precision,
    nullif(new.raw_user_meta_data ->> 'lng', '')::double precision,
    nullif(new.raw_user_meta_data ->> 'nama_usaha', ''),
    nullif(new.raw_user_meta_data ->> 'jenis_usaha', ''),
    nullif(new.raw_user_meta_data ->> 'nama_kos', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role or new.roles is distinct from old.roles then
    if current_user in ('postgres', 'service_role', 'supabase_admin') or public.is_admin() then
      return new;
    end if;
    if new.role = 'admin' or old.role = 'admin' or ('admin' = any(new.roles)) or ('admin' = any(old.roles)) then
      raise exception 'Role admin hanya dapat diubah oleh administrator';
    end if;
    if coalesce(current_setting('dishcon.allow_public_role_change', true), 'false') <> 'true' then
      raise exception 'Role publik hanya dapat ditetapkan melalui alur login DishCon';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role
before update on public.profiles
for each row execute procedure public.prevent_role_escalation();

-- Dipanggil dari login email dan callback Google OAuth.
-- Satu akun publik dapat memiliki role mitra dan mahasiswa. Admin tetap hanya dari allowlist.
create or replace function public.set_public_active_role(p_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_role not in ('mitra','mahasiswa') then raise exception 'Invalid public role'; end if;

  if exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
    raise exception 'Admin role cannot be changed from public login';
  end if;

  perform set_config('dishcon.allow_public_role_change', 'true', true);

  update public.profiles
     set role = p_role,
         roles = (
           select array_agg(distinct r)
           from unnest(coalesce(roles, array[]::text[]) || array[p_role]::text[]) as r
           where r in ('mitra','mahasiswa')
         ),
         oauth_role_set_at = coalesce(oauth_role_set_at, now())
   where id = auth.uid()
     and role <> 'admin';
end;
$$;

create or replace function public.set_google_public_role(p_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.set_public_active_role(p_role);
end;
$$;

grant execute on function public.set_public_active_role(text) to authenticated;
grant execute on function public.set_google_public_role(text) to authenticated;

-- ── Verifikasi mitra (sekali di awal, bukan per-listing) ────────────────────

create or replace function public.verify_mitra(p_mitra_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'Only admin can verify mitra'; end if;
  if p_status not in ('terverifikasi','ditangguhkan') then raise exception 'Invalid verification status'; end if;

  update public.profiles
     set verification_status = p_status,
         verified_at = case when p_status = 'terverifikasi' then now() else verified_at end
   where id = p_mitra_id and role = 'mitra';

  -- Listing yang sedang menunggu verifikasi pertama langsung tayang otomatis.
  if p_status = 'terverifikasi' then
    update public.surplus_listings
       set status = 'active'
     where mitra_id = p_mitra_id and status = 'pending_verification';
  end if;

  insert into public.notifications (user_id, title, message, type, link)
  values (
    p_mitra_id,
    case when p_status = 'terverifikasi' then 'Akun mitra terverifikasi' else 'Akun mitra ditangguhkan' end,
    case when p_status = 'terverifikasi'
      then 'Akun Anda sudah terverifikasi. Semua listing berikutnya akan tayang otomatis tanpa approval berlapis.'
      else 'Akun Anda ditangguhkan sementara oleh admin.' end,
    case when p_status = 'terverifikasi' then 'success' else 'warning' end,
    '/mitra/dashboard'
  );
end;
$$;

grant execute on function public.verify_mitra(uuid,text) to authenticated;

-- ── Reservasi instan dengan penguncian stok atomik ──────────────────────────
-- Padanan langsung dari kebutuhan RCA: "reserve_surplus_listing: reservasi
-- instan oleh pembeli, tanpa menunggu admin, dengan penguncian stok atomik
-- di database."

create or replace function public.reserve_surplus_listing(p_listing_id uuid, p_jumlah integer)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_listing public.surplus_listings%rowtype;
  v_terpakai integer;
  v_tersedia integer;
  v_reservation_id uuid;
  v_kode text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'mahasiswa') then
    raise exception 'Hanya mahasiswa yang dapat memesan kantong surplus';
  end if;
  if p_jumlah is null or p_jumlah <= 0 then raise exception 'Jumlah pesanan tidak valid'; end if;

  -- Kunci baris listing agar tidak ada race condition antar pemesan bersamaan.
  select * into v_listing from public.surplus_listings where id = p_listing_id for update;
  if not found then raise exception 'Kantong surplus tidak ditemukan'; end if;
  if v_listing.status <> 'active' then raise exception 'Kantong surplus ini sudah tidak tersedia'; end if;
  if v_listing.batas_waktu < now() then raise exception 'Batas waktu pengambilan sudah lewat'; end if;

  select coalesce(sum(jumlah), 0) into v_terpakai
    from public.reservations
   where listing_id = p_listing_id and status in ('reserved','completed');
  v_tersedia := v_listing.jumlah_kantong - v_terpakai;
  if v_tersedia < p_jumlah then raise exception 'Stok tidak cukup. Sisa % kantong', v_tersedia; end if;

  v_kode := lpad(floor(random() * 900000 + 100000)::text, 6, '0');

  insert into public.reservations (listing_id, mahasiswa_id, mitra_id, jumlah, harga_satuan, total_harga, komisi_platform, kode_pengambilan, status)
  values (
    p_listing_id,
    auth.uid(),
    v_listing.mitra_id,
    p_jumlah,
    v_listing.harga_diskon,
    v_listing.harga_diskon * p_jumlah,
    round(v_listing.harga_diskon * p_jumlah * 0.10),
    v_kode,
    'reserved'
  )
  returning id into v_reservation_id;

  if v_tersedia - p_jumlah <= 0 then
    update public.surplus_listings set status = 'habis' where id = p_listing_id;
  end if;

  insert into public.notifications (user_id, title, message, type, link)
  values
    (auth.uid(), 'Reservasi berhasil', v_listing.nama_makanan || ' x' || p_jumlah || ' berhasil dipesan. Kode pengambilan: ' || v_kode || '.', 'success', '/mahasiswa/history'),
    (v_listing.mitra_id, 'Kantong surplus dipesan', v_listing.nama_makanan || ' x' || p_jumlah || ' baru saja dipesan mahasiswa.', 'info', '/mitra/dashboard');

  return v_reservation_id;
end;
$$;

grant execute on function public.reserve_surplus_listing(uuid,integer) to authenticated;

create or replace function public.cancel_reservation(p_reservation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reservation public.reservations%rowtype;
  v_listing public.surplus_listings%rowtype;
begin
  select * into v_reservation from public.reservations where id = p_reservation_id for update;
  if not found then raise exception 'Reservasi tidak ditemukan'; end if;
  if v_reservation.status <> 'reserved' then raise exception 'Reservasi ini tidak bisa dibatalkan lagi'; end if;
  if auth.uid() <> v_reservation.mahasiswa_id and auth.uid() <> v_reservation.mitra_id and not public.is_admin() then
    raise exception 'Anda tidak berhak membatalkan reservasi ini';
  end if;

  update public.reservations set status = 'dibatalkan' where id = p_reservation_id;

  select * into v_listing from public.surplus_listings where id = v_reservation.listing_id for update;
  if v_listing.status = 'habis' and v_listing.batas_waktu > now() then
    update public.surplus_listings set status = 'active' where id = v_listing.id;
  end if;

  insert into public.notifications (user_id, title, message, type, link)
  values
    (v_reservation.mahasiswa_id, 'Reservasi dibatalkan', coalesce(v_listing.nama_makanan, 'Pesanan') || ' telah dibatalkan.', 'info', '/mahasiswa/history'),
    (v_reservation.mitra_id, 'Reservasi dibatalkan', coalesce(v_listing.nama_makanan, 'Pesanan') || ' oleh mahasiswa telah dibatalkan. Stok kembali tersedia.', 'info', '/mitra/dashboard');
end;
$$;

grant execute on function public.cancel_reservation(uuid) to authenticated;

create or replace function public.complete_reservation(p_reservation_id uuid, p_kode text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reservation public.reservations%rowtype;
  v_listing public.surplus_listings%rowtype;
begin
  select * into v_reservation from public.reservations where id = p_reservation_id for update;
  if not found then raise exception 'Reservasi tidak ditemukan'; end if;
  if v_reservation.mitra_id <> auth.uid() and not public.is_admin() then raise exception 'Reservasi ini bukan milik usaha Anda'; end if;
  if v_reservation.status <> 'reserved' then raise exception 'Reservasi ini tidak dapat diselesaikan'; end if;
  if v_reservation.kode_pengambilan <> trim(p_kode) then raise exception 'Kode pengambilan tidak cocok'; end if;

  update public.reservations set status = 'completed', completed_at = now() where id = p_reservation_id;
  select * into v_listing from public.surplus_listings where id = v_reservation.listing_id;

  insert into public.notifications (user_id, title, message, type, link)
  values (v_reservation.mahasiswa_id, 'Pengambilan selesai', coalesce(v_listing.nama_makanan, 'Pesanan') || ' sudah dikonfirmasi diambil. Terima kasih sudah ikut mengurangi sisa makanan!', 'success', '/mahasiswa/history');
end;
$$;

grant execute on function public.complete_reservation(uuid,text) to authenticated;

-- ── Row level security ───────────────────────────────────────────────────

alter table public.admin_email_allowlist enable row level security;
alter table public.profiles enable row level security;
alter table public.surplus_listings enable row level security;
alter table public.reservations enable row level security;
alter table public.kos_shares enable row level security;
alter table public.notifications enable row level security;
alter table public.complaints enable row level security;
alter table public.user_preferences enable row level security;

-- Drop policies first so this file is rerunnable.
drop policy if exists "read own profile" on public.profiles;
drop policy if exists "insert own profile" on public.profiles;
drop policy if exists "update own profile" on public.profiles;
drop policy if exists "mitra reads own listings" on public.surplus_listings;
drop policy if exists "mitra inserts own listings" on public.surplus_listings;
drop policy if exists "mitra or admin updates listings" on public.surplus_listings;
drop policy if exists "read related reservations" on public.reservations;
drop policy if exists "block direct reservation insert" on public.reservations;
drop policy if exists "block direct reservation update" on public.reservations;
drop policy if exists "read kos shares" on public.kos_shares;
drop policy if exists "mahasiswa inserts own kos shares" on public.kos_shares;
drop policy if exists "poster or admin updates kos shares" on public.kos_shares;
drop policy if exists "read own notifications" on public.notifications;
drop policy if exists "insert related notifications" on public.notifications;
drop policy if exists "update own notifications" on public.notifications;
drop policy if exists "read own or admin complaints" on public.complaints;
drop policy if exists "insert own complaints" on public.complaints;
drop policy if exists "admin update complaints" on public.complaints;
drop policy if exists "read own preferences" on public.user_preferences;
drop policy if exists "upsert own preferences" on public.user_preferences;
drop policy if exists "update own preferences" on public.user_preferences;

-- Profiles
create policy "read own profile" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id and role in ('mitra','mahasiswa'));
create policy "update own profile" on public.profiles for update using (auth.uid() = id or public.is_admin()) with check (auth.uid() = id or public.is_admin());

-- Surplus listings: mahasiswa hanya lihat yang aktif; mitra lihat listing sendiri (semua status).
create policy "mitra reads own listings" on public.surplus_listings for select using (
  mitra_id = auth.uid() or status = 'active' or public.is_admin()
);
create policy "mitra inserts own listings" on public.surplus_listings for insert with check (
  mitra_id = auth.uid()
  and exists(select 1 from public.profiles where id = auth.uid() and role = 'mitra' and verification_status <> 'ditangguhkan')
);
create policy "mitra or admin updates listings" on public.surplus_listings for update using (mitra_id = auth.uid() or public.is_admin()) with check (mitra_id = auth.uid() or public.is_admin());

-- Reservations: hanya bisa dibaca oleh pihak terkait. Insert/update HARUS lewat
-- fungsi reserve_surplus_listing / cancel_reservation / complete_reservation
-- (security definer) supaya penguncian stok tidak bisa dilewati dari client.
create policy "read related reservations" on public.reservations for select using (
  mahasiswa_id = auth.uid() or mitra_id = auth.uid() or public.is_admin()
);
create policy "block direct reservation insert" on public.reservations for insert with check (false);
create policy "block direct reservation update" on public.reservations for update using (false);

-- Kos shares: semua mahasiswa dapat melihat yang tersedia; pemilik dapat melihat/mengubah miliknya.
create policy "read kos shares" on public.kos_shares for select using (
  status = 'tersedia' or poster_id = auth.uid() or public.is_admin()
);
create policy "mahasiswa inserts own kos shares" on public.kos_shares for insert with check (
  poster_id = auth.uid()
  and exists(select 1 from public.profiles where id = auth.uid() and role = 'mahasiswa')
);
create policy "poster or admin updates kos shares" on public.kos_shares for update using (poster_id = auth.uid() or public.is_admin()) with check (poster_id = auth.uid() or public.is_admin());

-- Notifications
create policy "read own notifications" on public.notifications for select using (user_id = auth.uid());
create policy "insert related notifications" on public.notifications for insert with check (user_id = auth.uid() or public.is_admin());
create policy "update own notifications" on public.notifications for update using (user_id = auth.uid());

-- Complaints
create policy "read own or admin complaints" on public.complaints for select using (user_id = auth.uid() or public.is_admin());
create policy "insert own complaints" on public.complaints for insert with check (user_id = auth.uid());
create policy "admin update complaints" on public.complaints for update using (public.is_admin());

-- Preferences
create policy "read own preferences" on public.user_preferences for select using (user_id = auth.uid());
create policy "upsert own preferences" on public.user_preferences for insert with check (user_id = auth.uid());
create policy "update own preferences" on public.user_preferences for update using (user_id = auth.uid());

-- ── Notifikasi server-side tambahan ──────────────────────────────────────

-- Mitra baru (belum terverifikasi) memposting listing pertama -> beri tahu admin.
create or replace function public.notify_admins_on_pending_listing()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'pending_verification' then
    insert into public.notifications (user_id,title,message,type,link)
    select id, 'Mitra baru perlu diverifikasi', new.nama_makanan || ' menunggu verifikasi pertama mitra.', 'warning', '/admin/mitra'
    from public.profiles where role = 'admin';
  end if;
  return new;
end; $$;

drop trigger if exists notify_admins_after_listing on public.surplus_listings;
create trigger notify_admins_after_listing after insert on public.surplus_listings for each row execute procedure public.notify_admins_on_pending_listing();

create or replace function public.notify_admins_on_complaint()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications (user_id,title,message,type,link)
  select id, 'Pengaduan baru', new.subject, 'warning', '/admin/complaints?complaint=' || new.id::text
  from public.profiles where role = 'admin' and id <> new.user_id;
  return new;
end; $$;

drop trigger if exists notify_admins_after_complaint on public.complaints;
create trigger notify_admins_after_complaint after insert on public.complaints for each row execute procedure public.notify_admins_on_complaint();

-- ── Storage buckets ───────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-images', 'listing-images', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "listing image public read" on storage.objects;
drop policy if exists "mitra uploads own listing images" on storage.objects;
drop policy if exists "mitra updates own listing images" on storage.objects;
drop policy if exists "mitra deletes own listing images" on storage.objects;

create policy "listing image public read" on storage.objects for select using (bucket_id = 'listing-images');
create policy "mitra uploads own listing images" on storage.objects for insert with check (bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "mitra updates own listing images" on storage.objects for update using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "mitra deletes own listing images" on storage.objects for delete using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-assets', 'profile-assets', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "profile asset public read" on storage.objects;
drop policy if exists "user uploads own profile assets" on storage.objects;
drop policy if exists "user updates own profile assets" on storage.objects;
drop policy if exists "user deletes own profile assets" on storage.objects;
create policy "profile asset public read" on storage.objects for select using (bucket_id = 'profile-assets');
create policy "user uploads own profile assets" on storage.objects for insert with check (bucket_id = 'profile-assets' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "user updates own profile assets" on storage.objects for update using (bucket_id = 'profile-assets' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "user deletes own profile assets" on storage.objects for delete using (bucket_id = 'profile-assets' and (storage.foldername(name))[1] = auth.uid()::text);

-- Add an email before sign-up so the account is created directly as admin:
-- insert into public.admin_email_allowlist(email) values ('admin@yourdomain.com') on conflict do nothing;
-- Promote a trusted existing account to admin after it has registered:
-- update public.profiles set role = 'admin' where email = 'admin@yourdomain.com';
