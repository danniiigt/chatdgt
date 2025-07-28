-- PASO 6A: RLS para la tabla profiles
-- Ejecutar en Supabase SQL Editor

-- Habilitar RLS en la tabla profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política 1: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Política 2: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Política 3: Los usuarios pueden insertar su propio perfil (registro inicial)
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);