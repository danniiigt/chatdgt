-- PASO 2: Crear tabla para compartir chats
-- Ejecutar en Supabase SQL Editor

-- Tabla para chats compartidos
CREATE TABLE shared_chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  share_token TEXT UNIQUE NOT NULL DEFAULT translate(encode(gen_random_bytes(32), 'base64'), '+/=', '-_'),
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chat_id)
);

-- Índice para búsqueda rápida por token
CREATE INDEX idx_shared_chats_token ON shared_chats(share_token);

-- Función para verificar si un chat compartido es válido
CREATE OR REPLACE FUNCTION is_shared_chat_valid(token TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM shared_chats 
    WHERE share_token = token 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql;