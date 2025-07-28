import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { Profiles, UserSettings, UserUsage } from '@/services'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase()
    
    // Verificar que el usuario esté autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' }, 
        { status: 401 }
      )
    }

    // Verificar si el perfil ya existe para evitar duplicados
    const existingProfile = await Profiles.getById(user.id).catch(() => null)
    
    if (existingProfile) {
      return NextResponse.json({
        message: 'Usuario ya configurado',
        profile: existingProfile
      })
    }

    // 1. Crear perfil del usuario
    const profile = await Profiles.create({
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || null
    })

    // 2. Crear configuraciones por defecto usando la función de BD
    const settings = await UserSettings.getOrCreate()

    // 3. Crear registro de uso inicial
    const usage = await UserUsage.getOrCreate()

    return NextResponse.json({
      message: 'Usuario configurado exitosamente',
      data: {
        profile,
        settings,
        usage
      }
    })

  } catch (error) {
    console.error('Error en setup de usuario:', error)
    
    // Manejar errores específicos
    if (error instanceof Error) {
      // Error de duplicado (el usuario ya fue configurado)
      if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
        return NextResponse.json({
          message: 'Usuario ya configurado'
        })
      }
      
      // Error de permisos RLS
      if (error.message.includes('permission') || error.message.includes('policy')) {
        return NextResponse.json(
          { error: 'Error de permisos. Verifica tu autenticación.' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Endpoint GET para verificar el estado del usuario
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' }, 
        { status: 401 }
      )
    }

    // Verificar si el usuario está completamente configurado
    const [profile, settings, usage] = await Promise.allSettled([
      Profiles.getById(user.id),
      UserSettings.getCurrent(),
      UserUsage.getCurrent()
    ])

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at
      },
      setup: {
        profile: profile.status === 'fulfilled' ? profile.value : null,
        settings: settings.status === 'fulfilled' ? settings.value : null,
        usage: usage.status === 'fulfilled' ? usage.value : null,
        isComplete: profile.status === 'fulfilled' && 
                   settings.status === 'fulfilled' && 
                   usage.status === 'fulfilled'
      }
    })

  } catch (error) {
    console.error('Error verificando setup de usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}