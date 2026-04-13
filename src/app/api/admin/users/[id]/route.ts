import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { isPremium } = await request.json()

    const user = await db.user.update({
      where: { id },
      data: { isPremium },
    })

    // If activating premium, also approve the latest pending subscription
    if (isPremium) {
      const pendingSub = await db.subscription.findFirst({
        where: { userId: id, status: 'pending' },
        orderBy: { createdAt: 'desc' },
      })
      if (pendingSub) {
        await db.subscription.update({
          where: { id: pendingSub.id },
          data: { status: 'approved', reviewedAt: new Date() },
        })
      }
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
    })
  } catch (error) {
    console.error('Toggle premium error:', error)
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 })
  }
}
