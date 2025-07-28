-- PASO 5: Crear índices para optimización de rendimiento
-- Ejecutar en Supabase SQL Editor

-- Índices para la tabla chats
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_chats_user_updated_at ON chats(user_id, updated_at DESC);
CREATE INDEX idx_chats_archived ON chats(user_id, is_archived);

-- Índices para la tabla messages
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_chat_created_at ON messages(chat_id, created_at);
CREATE INDEX idx_messages_role ON messages(role);

-- Índices para la tabla shared_chats (ya tiene uno del paso 2)
-- CREATE INDEX idx_shared_chats_token ON shared_chats(share_token); -- Ya existe
CREATE INDEX idx_shared_chats_active ON shared_chats(is_active, expires_at);

-- Índices para la tabla chat_bookmarks
CREATE INDEX idx_chat_bookmarks_user_id ON chat_bookmarks(user_id);
CREATE INDEX idx_chat_bookmarks_chat_id ON chat_bookmarks(chat_id);

-- Índices para la tabla prompt_templates
CREATE INDEX idx_prompt_templates_user_id ON prompt_templates(user_id);
CREATE INDEX idx_prompt_templates_public ON prompt_templates(is_public) WHERE is_public = true;
CREATE INDEX idx_prompt_templates_category ON prompt_templates(category) WHERE category IS NOT NULL;

-- Índices para la tabla user_usage
CREATE INDEX idx_user_usage_reset_date ON user_usage(reset_date);

-- Índices compuestos útiles para consultas comunes
CREATE INDEX idx_messages_user_chats ON messages(chat_id) 
  INCLUDE (role, created_at, token_count) 
  WHERE role IN ('user', 'assistant');

-- Índice para búsquedas de plantillas públicas por categoría
CREATE INDEX idx_templates_public_category ON prompt_templates(category, created_at DESC) 
  WHERE is_public = true;