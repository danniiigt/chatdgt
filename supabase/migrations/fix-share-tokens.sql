-- Migración para corregir share_tokens existentes y actualizar el default
-- Ejecutar en Supabase SQL Editor

-- 1. Actualizar tokens existentes que contengan caracteres problemáticos
UPDATE shared_chats 
SET share_token = translate(share_token, '+/=', '-_')
WHERE share_token ~ '[+/=]';

-- 2. Cambiar el default de la columna para futuros registros
ALTER TABLE shared_chats 
ALTER COLUMN share_token 
SET DEFAULT translate(encode(gen_random_bytes(32), 'base64'), '+/=', '-_');