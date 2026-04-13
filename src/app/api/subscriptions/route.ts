import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, email, subscriptionId, planId } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 })
    }

    // Find or create user
    let user = await db.user.findUnique({ where: { email } })
    if (!user) {
      user = await db.user.create({
        data: {
          name: email.split('@')[0],
          email,
        },
      })
    }

    // Create subscription as pending
    const subscription = await db.subscription.create({
      data: {
        userId: user.id,
        subscriptionId: subscriptionId || null,
        planId: planId || 'P-2YH58611DA4123336NHODNII',
        status: 'pending',
        amount: 4.99,
        currency: 'USD',
      },
    })

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      status: 'pending',
      message: 'Suscripción registrada. Estamos revisando tu pago.',
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ error: 'Error al procesar suscripción' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ isPremium: false, status: 'not_found' })
    }

    // Check for any approved subscription
    const approvedSub = await db.subscription.findFirst({
      where: { userId: user.id, status: 'approved' },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      isPremium: user.isPremium,
      hasApprovedSubscription: !!approvedSub,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },
    })
  } catch (error) {
    console.error('Check subscription error:', error)
    return NextResponse.json({ error: 'Error al verificar suscripción' }, { status: 500 })
  }
}
