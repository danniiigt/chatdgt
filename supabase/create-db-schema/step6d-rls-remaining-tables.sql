-- PASO 6D: RLS para las tablas restantes
-- Ejecutar en Supabase SQL Editor

-- ========================================
-- RLS para SHARED_CHATS
-- ========================================
ALTER TABLE shared_chats ENABLE ROW LEVEL SECURITY;

-- Solo los dueños del chat pueden crear/gestionar enlaces compartidos
CREATE POLICY "Users can manage shares of own chats" 
ON shared_chats FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = shared_chats.chat_id 
    AND chats.user_id = auth.uid()
  )
);

-- Cualquiera puede ver información de enlaces válidos (para validar tokens)
CREATE POLICY "Anyone can view valid shared chats" 
ON shared_chats FOR SELECT 
USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- ========================================
-- RLS para USER_SETTINGS
-- ========================================
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden gestionar sus propias configuraciones
CREATE POLICY "Users can manage own settings" 
ON user_settings FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- ========================================
-- RLS para CHAT_BOOKMARKS
-- ========================================
ALTER TABLE chat_bookmarks ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden gestionar sus propios favoritos
CREATE POLICY "Users can manage own bookmarks" 
ON chat_bookmarks FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Verificar que solo marcan como favoritos SUS propios chats
CREATE POLICY "Users can only bookmark own chats" 
ON chat_bookmarks FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = chat_bookmarks.chat_id 
    AND chats.user_id = auth.uid()
  )
);

-- ========================================
-- RLS para PROMPT_TEMPLATES
-- ========================================
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver sus propias plantillas
CREATE POLICY "Users can view own templates" 
ON prompt_templates FOR SELECT 
USING (auth.uid() = user_id);

-- Los usuarios pueden crear sus propias plantillas
CREATE POLICY "Users can insert own templates" 
ON prompt_templates FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus propias plantillas
CREATE POLICY "Users can update own templates" 
ON prompt_templates FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden eliminar sus propias plantillas
CREATE POLICY "Users can delete own templates" 
ON prompt_templates FOR DELETE 
USING (auth.uid() = user_id);

-- Cualquiera puede ver plantillas públicas
CREATE POLICY "Anyone can view public templates" 
ON prompt_templates FOR SELECT 
USING (is_public = true);

-- ========================================
-- RLS para USER_USAGE
-- ========================================
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden gestionar su propio uso/límites
CREATE POLICY "Users can manage own usage" 
ON user_usage FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);