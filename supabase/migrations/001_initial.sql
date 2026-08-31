-- Users profile (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  plan text not null default 'free' check (plan in ('free', 'pro', 'enterprise')),
  plan_expires_at timestamptz,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- CVs
create table public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'CV Saya',
  data jsonb not null default '{}',
  template text not null default 'minimalis',
  ai_score int,
  ai_feedback jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.resumes enable row level security;
create policy "Users CRUD own resumes" on public.resumes for all using (auth.uid() = user_id);

-- Cover Letters
create table public.cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  position text not null,
  company text not null,
  content text not null,
  created_at timestamptz default now()
);

alter table public.cover_letters enable row level security;
create policy "Users CRUD own letters" on public.cover_letters for all using (auth.uid() = user_id);

-- Interview Sessions
create table public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  position text not null,
  messages jsonb not null default '[]',
  final_score int,
  status text not null default 'active' check (status in ('active', 'completed')),
  created_at timestamptz default now()
);

alter table public.interview_sessions enable row level security;
create policy "Users CRUD own sessions" on public.interview_sessions for all using (auth.uid() = user_id);

-- Usage Tracking
create table public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  feature text not null check (feature in ('cv_review', 'cover_letter', 'interview')),
  created_at timestamptz default now()
);

alter table public.usage_logs enable row level security;
create policy "Users read own usage" on public.usage_logs for select using (auth.uid() = user_id);
create policy "Users insert own usage" on public.usage_logs for insert with check (auth.uid() = user_id);

-- Subscriptions
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  midtrans_order_id text unique,
  plan text not null default 'pro',
  amount int not null,
  status text not null default 'pending' check (status in ('pending', 'active', 'expired', 'cancelled')),
  started_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now()
);

alter table public.subscriptions enable row level security;
create policy "Users read own subs" on public.subscriptions for select using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: count usage this month
create or replace function public.usage_count_this_month(p_user_id uuid, p_feature text)
returns int as $$
  select count(*)::int from public.usage_logs
  where user_id = p_user_id
    and feature = p_feature
    and created_at >= date_trunc('month', now());
$$ language sql security definer;
