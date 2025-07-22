/*
  # Create HireDeck tables

  1. New Tables
    - `hr_profiles`
      - `id` (uuid, primary key)
      - `auth_user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `email` (text)
      - `company_name` (text)
      - `location` (text)
      - `company_type` (text)
      - `domain` (text)
      - `created_at` (timestamp)
    
    - `student_profiles_hiredeck`
      - `id` (uuid, primary key)
      - `auth_user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `email` (text)
      - `degree` (text)
      - `graduation_year` (integer)
      - `resume_url` (text, nullable)
      - `skills` (text array)
      - `created_at` (timestamp)

    - `candidate_resumes`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to student_profiles_hiredeck)
      - `resume_text` (text)
      - `skills_extracted` (text array)
      - `experience_years` (integer)
      - `embedding` (vector, for AI matching)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - HR users can read candidate data
*/

-- Create hr_profiles table
CREATE TABLE IF NOT EXISTS hr_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  company_name text NOT NULL,
  location text NOT NULL,
  company_type text NOT NULL,
  domain text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create student_profiles_hiredeck table
CREATE TABLE IF NOT EXISTS student_profiles_hiredeck (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  degree text NOT NULL,
  graduation_year integer NOT NULL,
  resume_url text,
  skills text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create candidate_resumes table for AI matching
CREATE TABLE IF NOT EXISTS candidate_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES student_profiles_hiredeck(id) ON DELETE CASCADE,
  resume_text text NOT NULL,
  skills_extracted text[] DEFAULT '{}',
  experience_years integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hr_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles_hiredeck ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_resumes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hr_profiles
CREATE POLICY "HR users can read own profile"
  ON hr_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "HR users can insert own profile"
  ON hr_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "HR users can update own profile"
  ON hr_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id);

-- RLS Policies for student_profiles_hiredeck
CREATE POLICY "Students can read own profile"
  ON student_profiles_hiredeck
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Students can insert own profile"
  ON student_profiles_hiredeck
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Students can update own profile"
  ON student_profiles_hiredeck
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id);

-- HR users can read all student profiles for candidate search
CREATE POLICY "HR users can read student profiles"
  ON student_profiles_hiredeck
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM hr_profiles 
      WHERE auth_user_id = auth.uid()
    )
  );

-- RLS Policies for candidate_resumes
CREATE POLICY "Students can manage own resumes"
  ON candidate_resumes
  FOR ALL
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM student_profiles_hiredeck 
      WHERE auth_user_id = auth.uid()
    )
  );

-- HR users can read all candidate resumes for matching
CREATE POLICY "HR users can read candidate resumes"
  ON candidate_resumes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM hr_profiles 
      WHERE auth_user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hr_profiles_auth_user_id ON hr_profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_hiredeck_auth_user_id ON student_profiles_hiredeck(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_resumes_student_id ON candidate_resumes(student_id);
CREATE INDEX IF NOT EXISTS idx_candidate_resumes_skills ON candidate_resumes USING GIN(skills_extracted);