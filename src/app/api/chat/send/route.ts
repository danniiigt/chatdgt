import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/supabase-server";
import { getAIProvider } from "@/lib/ai";
import { Chats, Messages } from "@/services";
import type { Message } from "@/lib/ai/types";

interface SendMessageRequest {
  message: string;
  chatId?: string;
  model?: string;
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

    console.log("Authenticated user:", user.id, user.email);

    // Parse request body
    const body: SendMessageRequest = await request.json();
    const { message, chatId, model } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "El mensaje no puede estar vacío" },
        { status: 400 }
      );
    }

    // TODO: Implement usage limits later
    // For now, we'll skip usage checking to get the MVP working

    // Get or create chat
    let chat;
    if (chatId) {
      // Use existing chat - use server client directly to avoid RLS issues
      const { data: existingChat, error: findError } = await supabase
        .from("chats")
        .select("*")
        .eq("id", chatId)
        .eq("user_id", user.id) // Security: ensure user owns the chat
        .single();
        
      if (findError || !existingChat) {
        console.error("Chat not found or access denied:", findError);
        return NextResponse.json(
          { error: "Chat no encontrado" },
          { status: 404 }
        );
      }
      
      chat = existingChat;
    } else {
      // Create new chat with auto-generated title
      const title = message.slice(0, 50) + (message.length > 50 ? "..." : "");
      console.log("Creating new chat for user:", user.id, "with title:", title);
      
      // Use server supabase client directly to avoid RLS issues
      const { data: newChat, error: createError } = await supabase
        .from("chats")
        .insert({
          user_id: user.id,
          title,
        })
        .select()
        .single();
        
      if (createError) {
        console.error("Error creating chat:", createError);
        throw createError;
      }
      
      chat = newChat;
      console.log("Chat created successfully:", chat.id);
    }

    // Save user message - use server client directly
    const { data: userMessage, error: userMsgError } = await supabase
      .from("messages")
      .insert({
        chat_id: chat.id,
        content: message,
        role: "user",
        token_count: 0, // We'll calculate this later if needed
      })
      .select()
      .single();
      
    if (userMsgError) {
      console.error("Error creating user message:", userMsgError);
      throw userMsgError;
    }

    // Get conversation history for context - use server client directly
    const { data: conversationMessages, error: historyError } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chat.id)
      .order("created_at", { ascending: true });
      
    if (historyError) {
      console.error("Error loading conversation history:", historyError);
      throw historyError;
    }

    // Format messages for AI provider
    const aiMessages: Message[] = (conversationMessages || [])
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

    // Generate AI response
    const aiProvider = getAIProvider();
    const aiResponse = await aiProvider.generateResponse(
      aiMessages,
      model || "gpt-4o-mini"
    );

    // Save AI response - use server client directly
    const { data: assistantMessage, error: assistantMsgError } = await supabase
      .from("messages")
      .insert({
        chat_id: chat.id,
        content: aiResponse.content,
        role: "assistant",
        token_count: aiResponse.tokens,
        model: aiResponse.model,
      })
      .select()
      .single();
      
    if (assistantMsgError) {
      console.error("Error creating assistant message:", assistantMsgError);
      throw assistantMsgError;
    }

    // TODO: Update user usage when implementing limits
    // await UserUsage.increment(1, aiResponse.tokens);

    // Update chat's updated_at timestamp - use server client directly
    await supabase
      .from("chats")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", chat.id);

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
