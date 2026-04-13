import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({ where: { email } })

    if (user) {
      // Generate a random 6-digit reset code
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

      await db.user.update({
        where: { email },
        data: {
          resetToken: code,
          resetTokenExpiry,
        },
      })
    }

    // Always return success (security best practice - don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: 'Código enviado a tu email',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
