-- Admin flag on profiles
alter table public.profiles add column is_admin boolean not null default false;

-- Audit log: security-relevant and business events
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}',
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

alter table public.audit_logs enable row level security;

create policy "Admins read all audit logs" on public.audit_logs for select using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.is_admin = true
  )
);

create policy "Users read own audit logs" on public.audit_logs for select using (auth.uid() = user_id);

create index idx_audit_logs_created_at on public.audit_logs (created_at desc);
create index idx_audit_logs_user_id on public.audit_logs (user_id);
create index idx_audit_logs_action on public.audit_logs (action);

-- Rate limiting: sliding-window request counts per identifier+action.
-- Written/read exclusively via the service-role client (no public RLS policy).
create table public.rate_limits (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  action text not null,
  created_at timestamptz default now()
);

alter table public.rate_limits enable row level security;

create index idx_rate_limits_lookup on public.rate_limits (identifier, action, created_at);

-- Helper: delete rate_limits rows older than 1 day (called opportunistically from lib/rate-limit.ts)
create or replace function public.cleanup_old_rate_limits()
returns void as $$
  delete from public.rate_limits where created_at < now() - interval '1 day';
$$ language sql security definer;

-- Re-seed the new-user trigger so it also grants admin to a known seed email.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'),
    new.email,
    (new.email = 'rizqiakbarrahmawan13@gmail.com')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Backfill: if that account already signed up before this migration ran, grant it admin now.
update public.profiles set is_admin = true where email = 'rizqiakbarrahmawan13@gmail.com';
