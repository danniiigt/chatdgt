-- PASO 7: Crear tabla de favoritos/bookmarks de chat
-- Ejecutar en Supabase SQL Editor

-- Tabla de bookmarks de chat
CREATE TABLE chat_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint para evitar bookmarks duplicados
  UNIQUE(user_id, chat_id)
);

-- Índice para mejorar performance en consultas
CREATE INDEX idx_chat_bookmarks_user_id ON chat_bookmarks(user_id);
CREATE INDEX idx_chat_bookmarks_chat_id ON chat_bookmarks(chat_id);
CREATE INDEX idx_chat_bookmarks_user_chat ON chat_bookmarks(user_id, chat_id);