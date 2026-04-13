import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 })
    }

    let user = await db.user.findUnique({ where: { email } })

    // Auto-create user if not exists (since no real auth system)
    if (!user) {
      user = await db.user.create({
        data: {
          name: email.split('@')[0],
          email,
          password: password || null,
        },
      })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 })
  }
}
