import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabase-server";
import { getAIProvider } from "@/lib/ai";
import { ChatsServer } from "@/services/Chats";
import { MessagesServer } from "@/services/Messages";
import type { Message } from "@/lib/ai/types";

interface SendMessageRequest {
  message: string;
  chatId?: string;
  model?: string;
  stream?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    // Parse request body
    const body: SendMessageRequest = await request.json();
    const { message, chatId, model, stream = true } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "El mensaje no puede estar vacío" },
        { status: 400 }
      );
    }

    // TODO: Implement usage limits later
    // For now, we'll skip usage checking to get the MVP working

    // Get or create chat using services
    let chat;
    if (chatId) {
      // Use existing chat with security check
      try {
        chat = await ChatsServer.getByIdAndUserId(chatId, user.id);
      } catch (error) {
        console.error("Chat not found or access denied:", error);
        return NextResponse.json(
          { error: "Chat no encontrado" },
          { status: 404 }
        );
      }
    } else {
      // Create new chat with auto-generated title
      const title = message.slice(0, 50) + (message.length > 50 ? "..." : "");

      chat = await ChatsServer.create({
        user_id: user.id,
        title,
      });
    }

    // Save user message using service
    const userMessage = await MessagesServer.create({
      chat_id: chat.id,
      content: message,
      role: "user",
      token_count: 0, // We'll calculate this later if needed
    });

    // Get conversation history for context using service
    const conversationMessages = await MessagesServer.getByChatId(chat.id, {
      orderBy: "created_at",
      ascending: true,
    });

    // Format messages for AI provider
    const aiMessages: Message[] = conversationMessages
      .filter((msg) => msg.id !== userMessage.id) // Exclude the just-created message
      .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    // Add the new user message
    aiMessages.push({
      role: "user",
      content: message,
    });

    // Handle streaming vs non-streaming responses
    const aiProvider = getAIProvider();

    if (stream) {
      // For streaming, we'll create a streaming response
      const encoder = new TextEncoder();

      // Create a readable stream
      const readable = new ReadableStream({
        async start(controller) {
          try {
            let fullContent = "";
            let totalTokens = 0;
            let assistantMessageId = "";

            // Send initial response with chat and user message info
            const initialData = {
              type: "initial",
              chat: {
                id: chat.id,
                title: chat.title,
                updated_at: chat.updated_at,
              },
              userMessage: {
                id: userMessage.id,
                content: userMessage.content,
                role: userMessage.role,
                created_at: userMessage.created_at,
              },
            };

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`)
            );

            // Stream AI response
            for await (const chunk of aiProvider.generateStreamingResponse(
              aiMessages,
              model || "gpt-4o-mini"
            )) {
              if (!chunk.isComplete) {
                // Send content chunk
                fullContent += chunk.content;
                const chunkData = {
                  type: "chunk",
                  content: chunk.content,
                  isComplete: false,
                };
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify(chunkData)}\n\n`)
                );
              } else {
                // Final chunk - save the complete message
                totalTokens = chunk.tokens || 0;

                const assistantMessage = await MessagesServer.create({
                  chat_id: chat.id,
                  content: fullContent,
                  role: "assistant",
                  token_count: totalTokens,
                  model: chunk.model || model || "gpt-4o-mini",
                });

                assistantMessageId = assistantMessage.id;

                // Update chat timestamp
                await ChatsServer.update(chat.id, {
                  updated_at: new Date().toISOString(),
                });

                // Send completion data
                const completionData = {
                  type: "complete",
                  assistantMessage: {
                    id: assistantMessage.id,
                    content: assistantMessage.content,
                    role: assistantMessage.role,
                    created_at: assistantMessage.created_at,
                    tokens: assistantMessage.token_count,
                    model: assistantMessage.model,
                  },
                  usage: {
                    tokensUsed: totalTokens,
                    tokensRemaining: 10000, // Placeholder
                    messagesRemaining: 100, // Placeholder
                  },
                };

                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify(completionData)}\n\n`)
                );
                break;
              }
            }

            controller.close();
          } catch (error) {
            console.error("Streaming error:", error);
            const errorData = {
              type: "error",
              error: "Error al generar respuesta",
            };
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`)
            );
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      // Non-streaming response (original behavior)
      const aiResponse = await aiProvider.generateResponse(
        aiMessages,
        model || "gpt-4o-mini"
      );

      // Save AI response using service
      const assistantMessage = await MessagesServer.create({
        chat_id: chat.id,
        content: aiResponse.content,
        role: "assistant",
        token_count: aiResponse.tokens,
        model: aiResponse.model,
      });

      // TODO: Update user usage when implementing limits
      // await UserUsage.increment(1, aiResponse.tokens);

      // Update chat's updated_at timestamp using service
      await ChatsServer.update(chat.id, {
        updated_at: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        data: {
          chat: {
            id: chat.id,
            title: chat.title,
            updated_at: chat.updated_at,
          },
          userMessage: {
            id: userMessage.id,
            content: userMessage.content,
            role: userMessage.role,
            created_at: userMessage.created_at,
          },
          assistantMessage: {
            id: assistantMessage.id,
            content: assistantMessage.content,
            role: assistantMessage.role,
            created_at: assistantMessage.created_at,
            tokens: assistantMessage.token_count,
            model: assistantMessage.model,
          },
          usage: {
            tokensUsed: aiResponse.tokens,
            // TODO: Add remaining tokens/messages when implementing limits
            tokensRemaining: 10000, // Placeholder
            messagesRemaining: 100, // Placeholder
          },
        },
      });
    }
  } catch (error: any) {
    console.error("Error in chat send:", error);

    // Handle specific AI provider errors
    if (error.name === "AIRateLimitError") {
      return NextResponse.json(
        {
          error:
            "El servicio de IA está temporalmente ocupado. Inténtalo en unos minutos.",
          retryAfter: error.retryAfter,
        },
        { status: 429 }
      );
    }

    if (error.name === "AIQuotaExceededError") {
      return NextResponse.json(
        {
          error:
            "El servicio de IA ha alcanzado su límite. Inténtalo más tarde.",
        },
        { status: 503 }
      );
    }

    if (error.name === "AIProviderError") {
      return NextResponse.json(
        { error: "Error al procesar tu mensaje. Inténtalo de nuevo." },
        { status: 500 }
      );
    }

    // Handle Supabase/database errors
    if (
      error.message?.includes("permission") ||
      error.message?.includes("policy")
    ) {
      return NextResponse.json(
        { error: "No tienes permisos para realizar esta acción" },
        { status: 403 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
