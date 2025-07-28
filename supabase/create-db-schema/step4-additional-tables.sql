-- PASO 4: Crear tablas adicionales (favoritos, plantillas, límites)
-- Ejecutar en Supabase SQL Editor

-- Tabla de favoritos/marcadores de chats
CREATE TABLE chat_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, chat_id)
);

-- Tabla de plantillas de prompts
CREATE TABLE prompt_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de límites de uso por usuario
CREATE TABLE user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  total_messages INTEGER DEFAULT 0 CHECK (total_messages >= 0),
  total_tokens INTEGER DEFAULT 0 CHECK (total_tokens >= 0),
  reset_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Trigger para auto-actualizar updated_at en prompt_templates
CREATE TRIGGER update_prompt_templates_updated_at 
    BEFORE UPDATE ON prompt_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para auto-actualizar updated_at en user_usage
CREATE TRIGGER update_user_usage_updated_at 
    BEFORE UPDATE ON user_usage 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Función para incrementar el uso del usuario
CREATE OR REPLACE FUNCTION increment_user_usage(
    p_user_id UUID,
    p_messages INTEGER DEFAULT 0,
    p_tokens INTEGER DEFAULT 0
)
RETURNS user_usage AS $$
DECLARE
    usage_record user_usage;
BEGIN
    -- Intentar actualizar registro existente
    UPDATE user_usage 
    SET 
        total_messages = total_messages + p_messages,
        total_tokens = total_tokens + p_tokens,
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING * INTO usage_record;
    
    -- Si no existe, crear nuevo registro
    IF NOT FOUND THEN
        INSERT INTO user_usage (user_id, total_messages, total_tokens) 
        VALUES (p_user_id, p_messages, p_tokens) 
        RETURNING * INTO usage_record;
    END IF;
    
    RETURN usage_record;
END;
$$ LANGUAGE plpgsql;

-- Función para resetear límites de uso (llamar mensualmente)
CREATE OR REPLACE FUNCTION reset_user_usage(p_user_id UUID)
RETURNS user_usage AS $$
DECLARE
    usage_record user_usage;
BEGIN
    UPDATE user_usage 
    SET 
        total_messages = 0,
        total_tokens = 0,
        reset_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING * INTO usage_record;
    
    -- Si no existe, crear nuevo registro
    IF NOT FOUND THEN
        INSERT INTO user_usage (user_id) 
        VALUES (p_user_id) 
        RETURNING * INTO usage_record;
    END IF;
    
    RETURN usage_record;
END;
$$ LANGUAGE plpgsql;