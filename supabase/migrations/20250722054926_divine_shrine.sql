-- Enable pgvector (only once per project)
create extension if not exists vector;

-- =============================
-- TABLE: hr_profiles
-- =============================
create table if not exists hr_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  company_name text not null,
  location text not null,
  company_type text not null,
  domain text not null,
  created_at timestamptz default now()
);

-- =============================
-- TABLE: student_profiles_hiredeck
-- =============================
create table if not exists student_profiles_hiredeck (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  degree text not null,
  graduation_year integer not null,
  resume_url text,
  skills text[] default '{}',
  created_at timestamptz default now()
);

-- =============================
-- TABLE: candidate_resumes
-- =============================
create table if not exists candidate_resumes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references student_profiles_hiredeck(id) on delete cascade,
  resume_text text not null,
  skills_extracted text[] default '{}',
  experience_years integer default 0,
  embedding vector(1536),  -- ✅ Required for AI semantic search
  match_score integer default 0,  -- Optional: for Gemini results
  matching_keywords text[] default '{}', -- Optional: for Gemini results
  created_at timestamptz default now()
);

-- =============================
-- ENABLE RLS (Row-Level Security)
-- =============================
alter table hr_profiles enable row level security;
alter table student_profiles_hiredeck enable row level security;
alter table candidate_resumes enable row level security;

-- =============================
-- RLS Policies: hr_profiles
-- =============================
create policy "HR users can read own profile"
on hr_profiles for select
to authenticated
using (auth.uid() = auth_user_id);

create policy "HR users can insert own profile"
on hr_profiles for insert
to authenticated
with check (auth.uid() = auth_user_id);

create policy "HR users can update own profile"
on hr_profiles for update
to authenticated
using (auth.uid() = auth_user_id);

-- =============================
-- RLS Policies: student_profiles_hiredeck
-- =============================
create policy "Students can read own profile"
on student_profiles_hiredeck for select
to authenticated
using (auth.uid() = auth_user_id);

create policy "Students can insert own profile"
on student_profiles_hiredeck for insert
to authenticated
with check (auth.uid() = auth_user_id);

create policy "Students can update own profile"
on student_profiles_hiredeck for update
to authenticated
using (auth.uid() = auth_user_id);

-- HRs can read all student profiles (for candidate search)
create policy "HR users can read student profiles"
on student_profiles_hiredeck for select
to authenticated
using (
  exists (
    select 1 from hr_profiles
    where auth_user_id = auth.uid()
  )
);

-- =============================
-- RLS Policies: candidate_resumes
-- =============================
-- Students can manage their own resume entries
create policy "Students can manage own resumes"
on candidate_resumes for all
to authenticated
using (
  student_id in (
    select id from student_profiles_hiredeck
    where auth_user_id = auth.uid()
  )
);

-- HRs can read all resumes (for JD matching)
create policy "HR users can read candidate resumes"
on candidate_resumes for select
to authenticated
using (
  exists (
    select 1 from hr_profiles
    where auth_user_id = auth.uid()
  )
);

-- =============================
-- Indexes for fast querying
-- =============================
create index if not exists idx_hr_profiles_auth_user_id
on hr_profiles(auth_user_id);

create index if not exists idx_student_profiles_hiredeck_auth_user_id
on student_profiles_hiredeck(auth_user_id);

create index if not exists idx_candidate_resumes_student_id
on candidate_resumes(student_id);

create index if not exists idx_candidate_resumes_embedding
on candidate_resumes using ivfflat (embedding vector_l2_ops)
with (lists = 100);

create index if not exists idx_candidate_resumes_skills
on candidate_resumes using gin (skills_extracted);
