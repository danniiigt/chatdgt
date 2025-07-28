-- PASO 6C: RLS para la tabla messages
-- Ejecutar en Supabase SQL Editor

-- Habilitar RLS en la tabla messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Política 1: Los usuarios pueden ver mensajes de sus propios chats
CREATE POLICY "Users can view messages from own chats" 
ON messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = messages.chat_id 
    AND chats.user_id = auth.uid()
  )
);

-- Política 2: Los usuarios pueden crear mensajes en sus propios chats
CREATE POLICY "Users can create messages in own chats" 
ON messages FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = messages.chat_id 
    AND chats.user_id = auth.uid()
  )
);

-- Política 3: Permitir ver mensajes en chats compartidos (solo lectura)
CREATE POLICY "Anyone can view shared chat messages" 
ON messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM shared_chats 
    WHERE shared_chats.chat_id = messages.chat_id 
    AND shared_chats.is_active = true 
    AND (shared_chats.expires_at IS NULL OR shared_chats.expires_at > NOW())
  )
);