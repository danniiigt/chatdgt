import { NextRequest, NextResponse } from "next/server";
import { SharedChats } from "@/services/SharedChats";

interface RouteParams {
  params: Promise<{
    token: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: "Token requerido" },
        { status: 400 }
      );
    }

    // Verificar si el token es válido y está activo
    const isValid = await SharedChats.isValidToken(token);
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Enlace no encontrado o expirado" },
        { status: 404 }
      );
    }

    // Obtener información del chat compartido
    const sharedChat = await SharedChats.getByToken(token);
    
    if (!sharedChat) {
      return NextResponse.json(
        { error: "Chat compartido no encontrado" },
        { status: 404 }
      );
    }

    // Obtener el chat y sus mensajes usando privilegios de servicio para bypassear RLS
    // Nota: Para chats compartidos públicamente, necesitamos usar el service role
    const { createClient } = await import("@supabase/supabase-js");
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: chat, error: chatError } = await serviceSupabase
      .from("chats")
      .select(`
        id,
        title,
        created_at,
        messages!messages_chat_id_fkey (
          id,
          content,
          role,
          model,
          created_at
        )
      `)
      .eq("id", sharedChat.chat_id)
      .single();

    if (chatError || !chat) {
      console.error("Error fetching chat:", chatError);
      return NextResponse.json(
        { error: "Chat no encontrado" },
        { status: 404 }
      );
    }

    // Ordenar mensajes por fecha de creación
    const sortedMessages = chat.messages.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Obtener el modelo del primer mensaje del asistente que tenga modelo
    const assistantMessage = chat.messages.find(
      (msg) => msg.role === "assistant" && msg.model
    );
    const model = assistantMessage?.model || "GPT-4";

    // Estructurar la respuesta
    const chatData = {
      id: chat.id,
      title: chat.title,
      model: model,
      created_at: chat.created_at,
      messages: sortedMessages,
      isValid: true,
    };

    return NextResponse.json({
      success: true,
      data: chatData,
    });
  } catch (error: any) {
    console.error("Error fetching shared chat:", error);

    // Handle specific Supabase errors
    if (error.code === "PGRST116") {
      return NextResponse.json(
        { error: "Enlace no encontrado o expirado" },
        { status: 404 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}