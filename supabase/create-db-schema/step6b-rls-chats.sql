-- PASO 6B: RLS para la tabla chats
-- Ejecutar en Supabase SQL Editor

-- Habilitar RLS en la tabla chats
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Política 1: Los usuarios pueden ver sus propios chats
CREATE POLICY "Users can view own chats" 
ON chats FOR SELECT 
USING (auth.uid() = user_id);

-- Política 2: Los usuarios pueden crear chats para sí mismos
CREATE POLICY "Users can create own chats" 
ON chats FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Política 3: Los usuarios pueden actualizar sus propios chats
CREATE POLICY "Users can update own chats" 
ON chats FOR UPDATE 
USING (auth.uid() = user_id);

-- Política 4: Los usuarios pueden eliminar sus propios chats
CREATE POLICY "Users can delete own chats" 
ON chats FOR DELETE 
USING (auth.uid() = user_id);