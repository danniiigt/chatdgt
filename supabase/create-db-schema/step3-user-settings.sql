-- PASO 3: Crear tabla de configuraciones de usuario
-- Ejecutar en Supabase SQL Editor

-- Tabla de configuraciones personalizadas por usuario
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'es',
  default_model TEXT DEFAULT 'gpt-4o-mini',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Trigger para auto-actualizar updated_at
CREATE TRIGGER update_user_settings_updated_at 
    BEFORE UPDATE ON user_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Función para obtener o crear configuraciones de usuario
CREATE OR REPLACE FUNCTION get_or_create_user_settings(p_user_id UUID)
RETURNS user_settings AS $$
DECLARE
    settings user_settings;
BEGIN
    -- Intentar obtener configuraciones existentes
    SELECT * INTO settings FROM user_settings WHERE user_id = p_user_id;
    
    -- Si no existen, crear configuraciones por defecto
    IF NOT FOUND THEN
        INSERT INTO user_settings (user_id) 
        VALUES (p_user_id) 
        RETURNING * INTO settings;
    END IF;
    
    RETURN settings;
END;
$$ LANGUAGE plpgsql;