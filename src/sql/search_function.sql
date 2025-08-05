-- Create function to search chats and messages
CREATE OR REPLACE FUNCTION search_chats_and_messages(
  user_id UUID,
  search_query TEXT,
  result_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  chat_id UUID,
  chat_title TEXT,
  updated_at TIMESTAMPTZ,
  match_type TEXT,
  message_preview TEXT,
  message_id UUID
) AS $$
BEGIN
  RETURN QUERY
  (
    -- Search in chat titles
    SELECT 
      c.id as chat_id,
      c.title as chat_title,
      c.updated_at,
      'title'::TEXT as match_type,
      NULL::TEXT as message_preview,
      NULL::UUID as message_id
    FROM chats c
    WHERE c.user_id = search_chats_and_messages.user_id
      AND c.is_archived = false
      AND c.title ILIKE '%' || search_query || '%'
    ORDER BY c.updated_at DESC
    LIMIT result_limit / 2
  )
  UNION ALL
  (
    -- Search in message content
    SELECT DISTINCT ON (c.id)
      c.id as chat_id,
      c.title as chat_title,
      c.updated_at,
      'message'::TEXT as match_type,
      -- Extract message preview with context around the match
      CASE 
        WHEN LENGTH(m.content) <= 150 THEN m.content
        ELSE 
          CASE 
            WHEN POSITION(LOWER(search_query) IN LOWER(m.content)) <= 75 THEN
              LEFT(m.content, 150) || '...'
            ELSE
              '...' || SUBSTRING(
                m.content, 
                GREATEST(1, POSITION(LOWER(search_query) IN LOWER(m.content)) - 50),
                150
              ) || '...'
          END
      END as message_preview,
      m.id as message_id
    FROM chats c
    INNER JOIN messages m ON c.id = m.chat_id
    WHERE c.user_id = search_chats_and_messages.user_id
      AND c.is_archived = false
      AND m.content ILIKE '%' || search_query || '%'
    ORDER BY c.id, m.created_at DESC
  )
  ORDER BY updated_at DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;