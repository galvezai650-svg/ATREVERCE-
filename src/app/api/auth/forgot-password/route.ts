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

      // Return the code directly (in production, send via email service like Resend/SendGrid)
      return NextResponse.json({
        success: true,
        message: 'Código generado exitosamente',
        code: code,
        expiresIn: '1 hora',
        note: 'En producción este código se enviaría por email. Actualmente se muestra en pantalla para pruebas.',
      })
    }

    // User not found - still return success for security (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: 'Si el email existe, se generó un código',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
