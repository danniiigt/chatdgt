-- PASO 8: Configurar RLS para tabla chat_bookmarks
-- Ejecutar en Supabase SQL Editor después de crear la tabla chat_bookmarks

-- Habilitar RLS en la tabla chat_bookmarks
ALTER TABLE chat_bookmarks ENABLE ROW LEVEL SECURITY;

-- Política para SELECT: Los usuarios solo pueden ver sus propios bookmarks
CREATE POLICY "Users can view their own bookmarks" ON chat_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

-- Política para INSERT: Los usuarios solo pueden crear bookmarks para sí mismos
CREATE POLICY "Users can create their own bookmarks" ON chat_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para DELETE: Los usuarios solo pueden eliminar sus propios bookmarks
CREATE POLICY "Users can delete their own bookmarks" ON chat_bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- No permitir UPDATE ya que no es necesario para bookmarks