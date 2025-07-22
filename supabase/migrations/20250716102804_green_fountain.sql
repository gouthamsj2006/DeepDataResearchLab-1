/*
  # Create user profiles and enrollment tables

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `auth_user_id` (uuid, foreign key to auth.users)
      - `full_name` (text)
      - `age` (integer)
      - `phone_number` (text)
      - `email` (text)
      - `degree` (text)
      - `created_at` (timestamp)
    
    - Course enrollment tables:
      - `data_engineering_enrollments`
      - `service_delivery_enrollments`
      - `dba_enrollments`
      - `devops_enrollments`
      - `business_analysis_enrollments`
    
    Each enrollment table includes:
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `name` (text)
      - `email` (text)
      - `selected_course` (text)
      - `message` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  age integer NOT NULL,
  phone_number text NOT NULL,
  email text NOT NULL,
  degree text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create enrollment tables
CREATE TABLE IF NOT EXISTS data_engineering_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  selected_course text DEFAULT 'Data Engineering',
  message text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_delivery_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  selected_course text DEFAULT 'Service Delivery',
  message text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dba_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  selected_course text DEFAULT 'Database Administrator',
  message text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS devops_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  selected_course text DEFAULT 'DevOps',
  message text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS business_analysis_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  selected_course text DEFAULT 'Business and Process Analysis',
  message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_engineering_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_delivery_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dba_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE devops_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_analysis_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id);

-- RLS Policies for enrollment tables
CREATE POLICY "Users can read own enrollments"
  ON data_engineering_enrollments
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert own enrollments"
  ON data_engineering_enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can read own enrollments"
  ON service_delivery_enrollments
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert own enrollments"
  ON service_delivery_enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can read own enrollments"
  ON dba_enrollments
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert own enrollments"
  ON dba_enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can read own enrollments"
  ON devops_enrollments
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert own enrollments"
  ON devops_enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can read own enrollments"
  ON business_analysis_enrollments
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert own enrollments"
  ON business_analysis_enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));