-- MIGRACIÓN: Poblar tablas para usuarios existentes
-- Ejecutar una sola vez en Supabase SQL Editor o CLI
-- Fecha: 2025-07-28

-- ============================================================================
-- IMPORTANTE: Ejecutar solo si hay usuarios existentes en auth.users que no 
-- tienen registros correspondientes en profiles, user_settings, user_usage
-- ============================================================================

-- 1. Migrar usuarios existentes a la tabla profiles
-- Solo migra usuarios que no tienen perfil aún
INSERT INTO profiles (id, email, full_name, avatar_url, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name'
  ) as full_name,
  au.raw_user_meta_data->>'avatar_url' as avatar_url,
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE p.id IS NULL  -- Solo usuarios sin perfil
AND au.email_confirmed_at IS NOT NULL;  -- Solo usuarios confirmados

-- 2. Crear configuraciones por defecto para usuarios existentes
-- Solo para usuarios que no tienen configuraciones aún
INSERT INTO user_settings (user_id, theme, language, default_model, created_at, updated_at)
SELECT 
  p.id,
  'system' as theme,
  'es' as language,
  'gpt-4o-mini' as default_model,
  NOW(),
  NOW()
FROM profiles p
LEFT JOIN user_settings us ON us.user_id = p.id
WHERE us.user_id IS NULL;  -- Solo usuarios sin configuraciones

-- 3. Crear registros de uso iniciales para usuarios existentes
-- Solo para usuarios que no tienen registro de uso aún
INSERT INTO user_usage (user_id, total_messages, total_tokens, reset_date, created_at, updated_at)
SELECT 
  p.id,
  0 as total_messages,
  0 as total_tokens,
  CURRENT_DATE as reset_date,
  NOW(),
  NOW()
FROM profiles p
LEFT JOIN user_usage uu ON uu.user_id = p.id
WHERE uu.user_id IS NULL;  -- Solo usuarios sin registro de uso

-- ============================================================================
-- VERIFICACIÓN: Queries para comprobar que la migración funcionó correctamente
-- ============================================================================

-- Contar usuarios en auth.users confirmados
-- SELECT COUNT(*) as confirmed_users FROM auth.users WHERE email_confirmed_at IS NOT NULL;

-- Contar usuarios en profiles
-- SELECT COUNT(*) as profile_users FROM profiles;

-- Contar usuarios con configuraciones
-- SELECT COUNT(*) as settings_users FROM user_settings;

-- Contar usuarios con registro de uso
-- SELECT COUNT(*) as usage_users FROM user_usage;

-- Usuarios sin perfil (debería ser 0 después de la migración)
-- SELECT COUNT(*) as users_without_profile 
-- FROM auth.users au 
-- LEFT JOIN profiles p ON p.id = au.id 
-- WHERE p.id IS NULL AND au.email_confirmed_at IS NOT NULL;

-- ============================================================================
-- ROLLBACK (en caso de necesitar deshacer - USAR CON PRECAUCIÓN)
-- ============================================================================

-- NOTA: Esto eliminará TODOS los datos de estas tablas.
-- Solo usar si algo salió mal y necesitas empezar de nuevo

-- DELETE FROM user_usage WHERE created_at > '2024-XX-XX';  -- Reemplazar fecha
-- DELETE FROM user_settings WHERE created_at > '2024-XX-XX';  -- Reemplazar fecha  
-- DELETE FROM profiles WHERE updated_at > '2024-XX-XX';  -- Reemplazar fecha

-- ============================================================================
-- LOG DE EJECUCIÓN
-- ============================================================================
-- Fecha ejecución: ___________
-- Usuarios migrados: ___________
-- Errores encontrados: ___________
-- Ejecutado por: ___________