import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const post = await db.communityPost.findUnique({ where: { id } })
    if (!post) {
      return NextResponse.json({ error: 'Publicación no encontrada' }, { status: 404 })
    }

    const updated = await db.communityPost.update({
      where: { id },
      data: { likes: { increment: 1 } },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Like POST error:', error)
    return NextResponse.json({ error: 'Error al dar like' }, { status: 500 })
  }
}
