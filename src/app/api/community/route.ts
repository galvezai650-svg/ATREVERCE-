import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const posts = await db.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: {
          select: { name: true },
        },
      },
    })

    const result = posts.map((p) => ({
      ...p,
      userName: p.user.name,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Community GET error:', error)
    return NextResponse.json({ error: 'Error al obtener publicaciones' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, content, category } = body

    if (!userId || !title || !content) {
      return NextResponse.json(
        { error: 'userId, title y content son requeridos' },
        { status: 400 }
      )
    }

    const post = await db.communityPost.create({
      data: {
        userId,
        title,
        content,
        category: category ?? 'general',
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json({ ...post, userName: post.user.name }, { status: 201 })
  } catch (error) {
    console.error('Community POST error:', error)
    return NextResponse.json({ error: 'Error al crear publicación' }, { status: 500 })
  }
}
