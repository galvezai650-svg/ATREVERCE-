import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { isPremium, name, email } = body

    // Build update data dynamically
    const updateData: Record<string, unknown> = {}
    if (typeof isPremium === 'boolean') updateData.isPremium = isPremium
    if (name) updateData.name = name
    if (email) updateData.email = email

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No hay datos para actualizar' }, { status: 400 })
    }

    const user = await db.user.update({
      where: { id },
      data: updateData,
    })

    // If activating premium manually, also approve any pending subscription
    if (isPremium === true) {
      const pendingSub = await db.subscription.findFirst({
        where: { userId: id, status: 'pending' },
        orderBy: { createdAt: 'desc' },
      })
      if (pendingSub) {
        await db.subscription.update({
          where: { id: pendingSub.id },
          data: { status: 'approved', reviewedAt: new Date() },
        })
      } else {
        // Create a manual subscription record for audit trail
        await db.subscription.create({
          data: {
            userId: id,
            status: 'approved',
            amount: 0,
            currency: 'USD',
            planId: 'ADMIN_MANUAL',
            reviewedAt: new Date(),
          },
        })
      }
    }

    // If deactivating premium, mark latest approved subscription as rejected
    if (isPremium === false) {
      await db.subscription.updateMany({
        where: { userId: id, status: 'approved' },
        data: { status: 'rejected', reviewedAt: new Date() },
      })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Delete all related records first
    await db.certificate.deleteMany({ where: { userId: id } })
    await db.communityPost.deleteMany({ where: { userId: id } })
    await db.missionProgress.deleteMany({ where: { userId: id } })
    await db.quizScore.deleteMany({ where: { userId: id } })
    await db.subscription.deleteMany({ where: { userId: id } })

    // Delete the user
    await db.user.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Usuario eliminado correctamente' })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 })
  }
}
