import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await request.json() // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }

    const subscription = await db.subscription.update({
      where: { id },
      data: {
        status,
        reviewedAt: new Date(),
      },
    })

    // If approved, also set user as premium
    if (status === 'approved') {
      await db.user.update({
        where: { id: subscription.userId },
        data: { isPremium: true },
      })
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Review transaction error:', error)
    return NextResponse.json({ error: 'Error al revisar transacción' }, { status: 500 })
  }
}
