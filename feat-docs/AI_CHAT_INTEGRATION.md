# Plan de Integración de IA para Chat Básico

## 🎯 Objetivo
Implementar un chat funcional donde el usuario pueda mantener conversaciones básicas con un agente de IA.

## 📋 Casos de Uso Principales

### 1. **Crear Nueva Conversación**
- Usuario hace click en "Nueva conversación"
- Se crea un chat vacío en BD
- Se actualiza la URL a `/chat/[chat-id]`
- Se muestra la interfaz lista para escribir

### 2. **Enviar Mensaje del Usuario**
- Usuario escribe mensaje y presiona Enter/Send
- Mensaje se guarda en BD como `role: 'user'`
- Se muestra en la UI inmediatamente
- Se desactiva el input mientras se procesa

### 3. **Generar Respuesta de IA**
- Sistema envía contexto completo a API de IA
- Recibe respuesta (idealmente streaming)
- Guarda respuesta como `role: 'assistant'` con metadata
- Actualiza contador de tokens/uso del usuario
- Reactiva el input para siguiente mensaje

### 4. **Cargar Conversación Existente**
- Usuario selecciona chat del sidebar
- Sistema carga todos los mensajes de la BD
- Se renderizan en orden cronológico
- Scroll automático al último mensaje

## 🔧 Componentes Técnicos Necesarios

### Backend (API Routes)
1. **POST /api/chat/send** - Enviar mensaje y obtener respuesta de IA
2. **GET /api/chat/[id]/messages** - Cargar mensajes de una conversación
3. **POST /api/chat/new** - Crear nueva conversación
4. **GET /api/chat** - Listar conversaciones del usuario

### Frontend (Componentes/Hooks)
1. **Mejorar ChatInput** - Manejo de envío y estados de loading
2. **Crear MessageList** - Renderizar mensajes con diferentes roles
3. **Hook useChat** - Lógica de estado del chat actual
4. **Hook useChatList** - Gestión de lista de conversaciones
5. **Integrar con servicios** existentes

### Integración IA
1. **Configurar provider** (OpenAI/Anthropic)
2. **Manejo de streaming** (opcional pero recomendado)
3. **Control de límites** por usuario
4. **Gestión de contexto** y system prompts

## ✅ Criterios de Aceptación
- [ ] Usuario puede crear nueva conversación
- [ ] Usuario puede enviar mensajes y recibir respuestas
- [ ] Mensajes se persisten correctamente en BD  
- [ ] UI muestra estados de loading apropiados
- [ ] Límites de uso se respetan y actualizan
- [ ] Conversaciones aparecen en sidebar
- [ ] Navegación entre chats funciona
- [ ] Responsive en móvil

## 🚫 Fuera del Alcance (para después)
- Compartir conversaciones
- Plantillas de prompts
- Favoritos
- Búsqueda en mensajes
- Modo avanzado/configuraciones
- Archivos adjuntos

## 📝 Progreso de Implementación

### ✅ Completado
- [x] Creación de rama `feat/ai-chat-integration`
- [x] Documentación del plan

### 🔄 En Progreso
- [ ] Set up AI provider integration (OpenAI/Anthropic)
- [ ] Create API route POST /api/chat/send for sending messages
- [ ] Create API route POST /api/chat/new for creating conversations
- [ ] Create API route GET /api/chat/[id]/messages for loading messages
- [ ] Create API route GET /api/chat for listing user conversations
- [ ] Create MessageList component for rendering chat messages
- [ ] Create useChat hook for managing chat state
- [ ] Create useChatList hook for managing conversations list
- [ ] Enhance ChatInput component with send functionality
- [ ] Integrate usage limits and token counting
- [ ] Update chat page to integrate all components
- [ ] Test complete chat flow end-to-end

## 🛠️ Decisiones Técnicas

### Provider de IA
- **OpenAI**: Más popular, bien documentado, GPT-4 disponible
- **Anthropic**: Claude, buena para conversaciones largas
- **Decisión**: Empezar con OpenAI por simplicidad

### Streaming
- **Con streaming**: Mejor UX, respuestas aparecen progresivamente
- **Sin streaming**: Más simple de implementar inicialmente
- **Decisión**: Implementar sin streaming primero, agregar después

### Gestión de Estado
- **useState local**: Simple para empezar
- **Context/Zustand**: Para estado más complejo
- **Decisión**: useState + custom hooks inicialmente

### Límites de Uso
- **Verificar antes**: Prevenir llamadas innecesarias
- **Verificar después**: Más simple, pero desperdicia tokens
- **Decisión**: Verificar antes de enviar a IA

## 🔧 Variables de Entorno Necesarias
```env
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Para redirects
```

## 📚 Referencias
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Supabase Database Functions](https://supabase.com/docs/guides/database/functions)